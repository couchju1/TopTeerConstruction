import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';
const BANNED = [
  'delve', 'elevate', 'empower', 'seamless', 'unlock', 'robust', 'leverage', 'streamline', 'comprehensive',
  'cutting-edge', 'top-notch', 'one-stop', 'tailored', 'passionate', 'trusted partner', 'pride ourselves',
  'journey', "whether you're", 'look no further',
];
const CHECKS = [
  { label: 'em dash', test: /—/ },
  { label: 'en dash', test: /–/ },
  { label: 'semicolon', test: /;/ },
  ...BANNED.map((word) => ({
    label: `banned "${word}"`,
    test: new RegExp(`\\b${word.replace(/[-']/g, (c) => (c === "'" ? "['’]" : c))}`, 'i'),
  })),
];

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '\u00a9')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [])),
  );
  return nested.flat();
}

function visibleText(html) {
  const body = html
    .replace(/<head>[\s\S]*?<\/head>/, '')
    .replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+\balt="([^"]*)"[^>]*>/g, ' $1 ')
    .replace(/<[^>]+\baria-label="([^"]*)"[^>]*>/g, ' $1 ');
  const head = [...html.matchAll(/<title>([^<]*)<\/title>|<meta name="description" content="([^"]*)"/g)]
    .map((m) => m[1] ?? m[2]);
  const text = decode(body.replace(/<[^>]+>/g, '\n'));
  return [...head.map(decode), ...text.split(/\n+/)].map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

const files = await htmlFiles(DIST).catch(() => []);
if (files.length === 0) {
  console.error(`Copy check: no HTML in ${DIST}/. Run a build first.`);
  process.exit(1);
}

const hits = [];
for (const file of files) {
  const lines = visibleText(await readFile(file, 'utf8'));
  lines.forEach((line, i) => {
    for (const { label, test } of CHECKS) {
      if (test.test(line)) hits.push(`${relative(DIST, file)}  text #${i + 1}  [${label}]  ${line.slice(0, 140)}`);
    }
  });
}

if (hits.length === 0) {
  console.log('Copy check: no hits.');
} else {
  console.log(`Copy check: ${hits.length} hit(s)\n${hits.join('\n')}`);
  process.exitCode = 1;
}
