import { defineConfig } from 'astro/config';
import siteConfig from './site.config.json' with { type: 'json' };
import { launchScan } from './src/lib/launch-scan.mjs';

const launchCheck = process.env.SITE_ENV !== 'draft';

export default defineConfig({
  site: siteConfig.site.url,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: launchCheck ? [launchScan()] : [],
  vite: {
    define: {
      __LAUNCH_CHECK__: JSON.stringify(launchCheck),
    },
  },
});
