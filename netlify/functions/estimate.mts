import nodemailer from 'nodemailer';
import { formSettings as settings } from '../../src/lib/form';

const FORM_PATH = '/free-estimate/';
const THANKS_PATH = '/thanks/';
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/heic': 'heic',
  'image/webp': 'webp',
};
const HEIF_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'];

type Errors = Record<string, string>;

function sniff(bytes: Uint8Array): string | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes[0] === 0x89 && ascii(1, 4) === 'PNG') return 'image/png';
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  if (ascii(4, 8) === 'ftyp' && HEIF_BRANDS.includes(ascii(8, 12))) return 'image/heic';
  return null;
}

function cleanLine(value: FormDataEntryValue | null, max: number): string {
  const text = typeof value === 'string' ? value : '';
  return text
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max + 1);
}

function cleanText(value: FormDataEntryValue | null): string {
  const text = typeof value === 'string' ? value : '';
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, '')
    .trim();
}

function finish(req: Request, ok: boolean, location: string, errors: Errors = {}, status = 200): Response {
  if ((req.headers.get('accept') ?? '').includes('application/json')) {
    return Response.json({ ok, redirect: location, errors }, { status });
  }
  return new Response(null, { status: 303, headers: { Location: location } });
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });

  const { messages, limits } = settings;
  let data: FormData;
  try {
    data = await req.formData();
  } catch {
    return finish(req, false, `${FORM_PATH}#estimate-error`, { photos: messages.photosSize }, 400);
  }

  if (cleanLine(data.get(settings.honeypot), 200) !== '') return finish(req, true, THANKS_PATH);

  const elapsed = cleanLine(data.get('elapsed'), 12);
  if (elapsed !== '' && (!/^\d+$/.test(elapsed) || Number(elapsed) < settings.minSeconds * 1000)) {
    return finish(req, true, THANKS_PATH);
  }

  const name = cleanLine(data.get('name'), limits.name);
  const phone = cleanLine(data.get('phone'), 30);
  const email = cleanLine(data.get('email'), limits.email);
  const town = cleanLine(data.get('town'), limits.town);
  const projectType = cleanLine(data.get('projectType'), 60);
  const details = cleanText(data.get('details'));

  const errors: Errors = {};
  if (name === '' || name.length > limits.name) errors.name = messages.name;
  let digits = phone.replace(/\D+/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (digits.length !== 10) errors.phone = messages.phone;
  if (email !== '' && (email.length > limits.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) errors.email = messages.email;
  if (town === '' || town.length > limits.town) errors.town = messages.town;
  if (!settings.projectTypes.includes(projectType)) errors.projectType = messages.projectType;
  if (details.length > limits.details) errors.details = messages.details;

  const files = data.getAll('photos[]').filter((f): f is File => typeof f !== 'string' && f.size > 0);
  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
  if (files.length > settings.maxFiles) {
    errors.photos = messages.photosCount;
  } else {
    for (const [i, file] of files.entries()) {
      if (file.size > settings.maxFileBytes) {
        errors.photos = messages.photosSize;
        break;
      }
      const content = Buffer.from(await file.arrayBuffer());
      const type = sniff(content);
      if (!type || !settings.acceptedTypes.includes(type)) {
        errors.photos = messages.photosType;
        break;
      }
      attachments.push({ filename: `photo-${i + 1}.${EXTENSIONS[type]}`, content, contentType: type });
    }
  }

  if (Object.keys(errors).length > 0) return finish(req, false, `${FORM_PATH}#estimate-error`, errors, 422);

  const env = process.env;
  if (!env.SMTP_HOST) {
    console.error('estimate: SMTP_HOST is not set');
    return finish(req, false, `${FORM_PATH}#estimate-server-error`, {}, 500);
  }

  const secure = (env.SMTP_SECURE ?? 'tls').toLowerCase();
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT ?? 587),
    secure: secure === 'ssl',
    requireTLS: secure === 'tls',
    ignoreTLS: secure === 'none',
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS ?? '' } : undefined,
  });

  const sent = new Date().toLocaleString('en-US', {
    timeZone: settings.timezone,
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const text = [
    'New estimate request from the website.',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email || '(not given)'}`,
    `Town: ${town}`,
    `Project: ${projectType}`,
    '',
    'Details:',
    details || '(none)',
    '',
    `Photos attached: ${attachments.length}`,
    `Sent: ${sent} Central`,
  ].join('\n');

  try {
    await transport.sendMail({
      from: { name: `${settings.businessName} website`, address: env.MAIL_FROM ?? env.SMTP_USER ?? settings.recipient },
      to: settings.recipient,
      replyTo: email ? { name, address: email } : undefined,
      subject: `Estimate request: ${projectType}, ${town}`,
      text,
      attachments,
    });
  } catch (error) {
    console.error('estimate: send failed', error instanceof Error ? error.message : error);
    return finish(req, false, `${FORM_PATH}#estimate-server-error`, {}, 502);
  }

  const query = new URLSearchParams({ sent: '1', town, type: projectType });
  return finish(req, true, `${THANKS_PATH}?${query}`);
};

export const config = { path: '/api/estimate' };
