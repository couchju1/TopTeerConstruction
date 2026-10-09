import { defineConfig } from 'astro/config';
import siteConfig from './site.config.json' with { type: 'json' };

const launchCheck = process.env.SITE_ENV !== 'draft';

export default defineConfig({
  site: siteConfig.site.url,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    define: {
      __LAUNCH_CHECK__: JSON.stringify(launchCheck),
    },
  },
});
