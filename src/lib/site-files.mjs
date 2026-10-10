import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(path);
      return entry.name.endsWith('.html') ? [path] : [];
    }),
  );
  return nested.flat();
}

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function htaccess({ host, scriptHashes, analytics }) {
  const csp = [
    "default-src 'self'",
    ['script-src', "'self'", ...analytics.script, ...scriptHashes.map((h) => `'${h}'`)].join(' '),
    "style-src 'self' 'unsafe-inline'",
    ['img-src', "'self'", 'data:', ...analytics.img].join(' '),
    "font-src 'self'",
    ['connect-src', "'self'", ...analytics.connect].join(' '),
    "form-action 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

  return `ErrorDocument 404 /404.html
Options -Indexes
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On

  RewriteCond %{HTTPS} off [OR]
  RewriteCond %{HTTP_HOST} !^${host.replace(/\./g, '\\.')}(:[0-9]+)?$ [NC]
  RewriteRule ^ https://${host}%{REQUEST_URI} [L,R=301]

  RewriteRule (^|/)\\.(?!well-known/) - [F]
  RewriteRule \\.(env|log|ini|sql|bak|lock|md)$ - [F,NC]
  RewriteRule ^(logs|storage|vendor|node_modules|src)(/|$) - [F,NC]
</IfModule>

<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Content-Security-Policy "${csp}"

  <FilesMatch "\\.(css|js|woff2|avif|webp)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(jpe?g|png|svg|ico|xml|txt)$">
    Header set Cache-Control "public, max-age=604800"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=300, must-revalidate"
  </FilesMatch>
  <FilesMatch "\\.php$">
    Header set Cache-Control "no-store"
  </FilesMatch>
</IfModule>
`;
}

export function siteFiles({ siteUrl, analytics = { script: [], connect: [], img: [] } }) {
  return {
    name: 'site-files',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        const files = await htmlFiles(root);
        const problems = [];
        const titles = new Map();
        const descriptions = new Map();
        const hashes = new Set();

        for (const file of files) {
          const page = `/${relative(root, file)}`;
          const html = await readFile(file, 'utf8');
          const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
          const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
          if (!title) problems.push(`${page}: missing <title>`);
          if (!description) problems.push(`${page}: missing meta description`);
          titles.set(title, [...(titles.get(title) ?? []), page]);
          descriptions.set(description, [...(descriptions.get(description) ?? []), page]);

          const canonicals = (html.match(/<link rel="canonical"/g) ?? []).length;
          const isNotFound = page === '/404.html';
          if (!isNotFound && canonicals !== 1) problems.push(`${page}: ${canonicals} canonical links`);
          if (/<meta name="generator"/.test(html)) problems.push(`${page}: generator meta tag`);
          if (/<!--/.test(html)) problems.push(`${page}: HTML comment`);

          for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
            if (/\bsrc=/.test(attrs) || /application\/ld\+json/.test(attrs)) continue;
            hashes.add(`sha256-${createHash('sha256').update(body).digest('base64')}`);
          }
        }

        for (const [title, pages] of titles) {
          if (title && pages.length > 1) problems.push(`duplicate title "${title}" on ${pages.join(', ')}`);
        }
        for (const [description, pages] of descriptions) {
          if (description && pages.length > 1) problems.push(`duplicate description on ${pages.join(', ')}`);
        }
        if (problems.length > 0) throw new Error(`SEO check failed:\n${problems.join('\n')}`);

        const host = new URL(siteUrl).host;
        await writeFile(join(root, '.htaccess'), htaccess({ host, scriptHashes: [...hashes].sort(), analytics }));
      },
    },
  };
}
