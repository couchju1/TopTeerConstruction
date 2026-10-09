import siteConfig from '../../site.config.json';
import { copy } from './copy';

export type SiteConfig = typeof siteConfig;
export type Service = SiteConfig['services'][number];

export interface Review {
  name: string;
  town: string;
  text: string;
  service?: string;
}

const PLACEHOLDER_MARKERS = ['[CONFIRM', '[NEEDS CLIENT PROOF'];

const sources: Record<string, unknown> = { ...siteConfig, copy };

export const launchCheck: boolean = __LAUNCH_CHECK__;

export function isPlaceholder(value: unknown): boolean {
  if (typeof value === 'string') return PLACEHOLDER_MARKERS.some((m) => value.includes(m));
  if (Array.isArray(value)) return value.some(isPlaceholder);
  if (value && typeof value === 'object') return Object.values(value).some(isPlaceholder);
  return false;
}

export class LaunchBlockerError extends Error {
  constructor(field: string, value: unknown) {
    super(
      `Launch check failed: "${field}" is still ${JSON.stringify(value)}. ` +
        `Replace it in site.config.json (or src/lib/copy.ts for "copy.*") before a production build, ` +
        `or run "npm run build" for a draft build.`,
    );
    this.name = 'LaunchBlockerError';
  }
}

export function assertLaunchReady(field: string, value: unknown): void {
  if (!launchCheck) return;
  if (isPlaceholder(value)) throw new LaunchBlockerError(field, value);
  if (field === 'contact.phoneDisplay' && !siteConfig.contact.phoneConfirmed) {
    throw new LaunchBlockerError('contact.phoneConfirmed', siteConfig.contact.phoneConfirmed);
  }
}

function resolve(field: string): unknown {
  return field.split('.').reduce<unknown>((node, key) => {
    if (node && typeof node === 'object' && key in node) return (node as Record<string, unknown>)[key];
    throw new Error(`Unknown config field "${field}"`);
  }, sources);
}

export function fact(field: string): { value: string; placeholder: boolean } {
  const raw = resolve(field);
  assertLaunchReady(field, raw);
  const value = Array.isArray(raw) ? raw.join(', ') : String(raw);
  return { value, placeholder: isPlaceholder(raw) };
}

export const business = siteConfig.business;
export const contact = siteConfig.contact;
export const location = siteConfig.location;
export const site = siteConfig.site;
export const social = siteConfig.social;
export const credentials = siteConfig.credentials;
export const services = siteConfig.services;
export const reviews = {
  minimumToShow: siteConfig.reviews.minimumToShow,
  items: siteConfig.reviews.items as Review[],
};

export const telHref = `tel:${contact.phoneE164}`;
export const mailHref = `mailto:${contact.email}`;
export const wordmarkSuffix = business.name.replace(business.shortName, '').trim();
const [firstWord, ...restWords] = business.shortName.split(' ');
export const wordmarkFirst = firstWord;
export const wordmarkRest = restWords.join(' ');

export const estimatePath = '/free-estimate/';
export const privacyPath = '/privacy/';

export type NavItem = { href: string; label: string };

export const navItems: NavItem[] = [
  ...services.map((s) => ({ href: `/${s.slug}/`, label: s.name })),
  { href: '/our-work/', label: 'Our work' },
  { href: '/about/', label: 'About' },
];

export function isCurrent(href: string, pathname: string): boolean {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return path === href || path.startsWith(href);
}
