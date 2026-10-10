import siteConfig from '../../site.config.json';
import { assertLaunchReady, isPlaceholder, services } from './config';

const base = siteConfig.site.url.replace(/\/$/, '');
export const businessId = `${base}/#business`;
export const absolute = (path: string) => new URL(path, `${base}/`).href;

const pageNames: Record<string, string> = {
  ...Object.fromEntries(services.map((s) => [s.slug, s.name])),
  'our-work': 'Our work',
  about: 'About',
  'service-area': 'Service area',
  'free-estimate': 'Free estimate',
  privacy: 'Privacy',
  thanks: 'Thanks',
};

const areaServed = siteConfig.location.serviceTowns.map((name) => ({
  '@type': 'City',
  name,
  containedInPlace: { '@type': 'State', name: 'South Dakota' },
}));

export function businessJsonLd() {
  const { business, contact, location, social } = siteConfig;
  assertLaunchReady('business.ownerLastName', business.ownerLastName);

  const sameAs = [social.facebook, social.googleBusinessProfile].filter((url) => url && !isPlaceholder(url));
  const hours = contact.openingHoursSpecification as unknown[];
  const geo = location.geo;

  return {
    '@context': 'https://schema.org',
    '@type': business.schemaType,
    '@id': businessId,
    name: business.name,
    url: `${base}/`,
    telephone: contact.phoneE164,
    email: contact.email,
    image: absolute(siteConfig.site.defaultOgImage),
    logo: absolute('/logo.png'),
    description: business.tagline,
    foundingDate: String(business.foundingYear),
    founder: { '@type': 'Person', name: `${business.owner} ${business.ownerLastName}` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.city,
      addressRegion: location.region,
      postalCode: location.postalCode,
      addressCountry: location.country,
    },
    ...(typeof geo.lat === 'number' && typeof geo.lng === 'number'
      ? { geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng } }
      : {}),
    areaServed,
    sameAs,
    ...(!isPlaceholder(contact.hours) && hours.length > 0 ? { openingHoursSpecification: hours } : {}),
  };
}

export function serviceJsonLd(slug: string, pagePath: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service "${slug}"`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absolute(pagePath)}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.short,
    url: absolute(pagePath),
    provider: { '@id': businessId },
    areaServed,
  };
}

export function breadcrumbJsonLd(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  const crumbs = [{ name: 'Home', path: '/' }];
  let path = '/';
  for (const segment of segments) {
    path += `${segment}/`;
    crumbs.push({ name: pageNames[segment] ?? segment, path });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}
