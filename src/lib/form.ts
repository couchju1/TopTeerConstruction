import siteConfig from '../../site.config.json';

export const form = siteConfig.form;

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];
export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.heic', '.webp'];
export const MIN_SECONDS = 3;

export const limits = {
  name: 80,
  town: 60,
  email: 120,
  details: 2000,
};

export const messages = {
  name: 'Please enter your name.',
  phone: 'Please enter a phone number with area code.',
  email: 'That email address does not look right.',
  town: 'Please enter the town the job is in.',
  projectType: 'Please choose what kind of job it is.',
  details: `Please keep this under ${limits.details} characters.`,
  photosCount: `You can attach up to ${form.maxFiles} photos.`,
  photosSize: `Each photo needs to be under ${form.maxFileMB} MB.`,
  photosType: 'Photos need to be JPG, PNG, HEIC or WebP.',
};

export const formSettings = {
  recipient: siteConfig.contact.formRecipient,
  businessName: siteConfig.business.name,
  timezone: 'America/Chicago',
  projectTypes: form.projectTypes,
  honeypot: form.honeypotField,
  maxFiles: form.maxFiles,
  maxFileBytes: form.maxFileMB * 1024 * 1024,
  acceptedTypes: ACCEPTED_TYPES,
  minSeconds: MIN_SECONDS,
  limits,
  messages,
};
