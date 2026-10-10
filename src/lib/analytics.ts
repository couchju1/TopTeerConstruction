import siteConfig from '../../site.config.json';

export type Provider = 'plausible' | 'ga4';

export const analyticsSources: Record<Provider, { script: string[]; connect: string[]; img: string[] }> = {
  plausible: {
    script: ['https://plausible.io'],
    connect: ['https://plausible.io'],
    img: [],
  },
  ga4: {
    script: ['https://www.googletagmanager.com'],
    connect: ['https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'],
    img: ['https://*.google-analytics.com', 'https://*.googletagmanager.com'],
  },
};

export function analyticsProvider(): Provider | null {
  const provider = siteConfig.analytics.provider;
  return provider === 'plausible' || provider === 'ga4' ? provider : null;
}
