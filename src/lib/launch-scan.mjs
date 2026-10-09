import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const MARKERS = /\[(CONFIRM|NEEDS CLIENT PROOF)[^\]]*\]/g;

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

export function launchScan() {
  return {
    name: 'launch-scan',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        const hits = [];
        for (const file of await htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          for (const match of html.matchAll(MARKERS)) {
            hits.push(`${relative(root, file)}: ${html.slice(match.index, match.index + 90).replace(/\s+/g, ' ')}`);
          }
        }
        if (hits.length > 0) {
          throw new Error(`Launch check failed: placeholder text in built HTML\n${hits.join('\n')}`);
        }
      },
    },
  };
}
