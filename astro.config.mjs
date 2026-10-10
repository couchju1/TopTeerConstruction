import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import siteConfig from './site.config.json' with { type: 'json' };
import { launchScan } from './src/lib/launch-scan.mjs';
import { siteFiles } from './src/lib/site-files.mjs';
import { analyticsProvider, analyticsSources } from './src/lib/analytics.ts';

const launchCheck = process.env.SITE_ENV !== 'draft';
const excluded = ['/thanks/', '/dev/', '/404'];
const provider = analyticsProvider();

export default defineConfig({
  site: siteConfig.site.url,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({ filter: (page) => !excluded.some((path) => new URL(page).pathname.startsWith(path)) }),
    siteFiles({ siteUrl: siteConfig.site.url, analytics: provider ? analyticsSources[provider] : undefined }),
    ...(launchCheck ? [launchScan()] : []),
  ],
  vite: {
    define: {
      __LAUNCH_CHECK__: JSON.stringify(launchCheck),
    },
  },
});
