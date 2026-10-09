import { readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { exiftool } from 'exiftool-vendored';

const ROOTS = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ['dist', 'src/assets/photos/projects'];
const IMAGES = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', '.heif', '.tif', '.tiff']);

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const nested = await Promise.all(
    entries.map((e) => {
      const path = join(dir, e.name);
      if (e.isDirectory()) return walk(path);
      return IMAGES.has(extname(e.name).toLowerCase()) ? [path] : [];
    }),
  );
  return nested.flat();
}

const files = (await Promise.all(ROOTS.map(walk))).flat();
const leaks = [];

try {
  for (const file of files) {
    const tags = await exiftool.read(file);
    const gps = Object.keys(tags).filter((key) => key.startsWith('GPS'));
    if (gps.length > 0) leaks.push(`${file}: ${gps.join(', ')}`);
  }
} finally {
  await exiftool.end();
}

if (leaks.length > 0) {
  console.error(`GPS data found in ${leaks.length} file(s):`);
  for (const line of leaks) console.error(`  ${line}`);
  process.exit(1);
}

console.log(`Checked ${files.length} image(s) in ${ROOTS.join(', ')}: no GPS data.`);
