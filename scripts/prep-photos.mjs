import { mkdir, readdir, readFile } from 'node:fs/promises';
import { extname, basename, join } from 'node:path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const RAW = 'src/assets/photos/raw';
const OUT = 'src/assets/photos/projects';
const HERO_MIN_WIDTH = 1600;
const MAX_EDGE = 3000;
const INPUT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tif', '.tiff']);

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function decode(path) {
  const ext = extname(path).toLowerCase();
  const input = await readFile(path);
  if (ext === '.heic' || ext === '.heif') {
    return Buffer.from(await heicConvert({ buffer: input, format: 'JPEG', quality: 1 }));
  }
  return input;
}

await mkdir(OUT, { recursive: true });
const files = (await readdir(RAW)).filter((f) => INPUT.has(extname(f).toLowerCase()));

if (files.length === 0) {
  console.log(`No photos in ${RAW}`);
  process.exit(0);
}

const narrow = [];
const failed = [];

for (const file of files) {
  const name = `${slug(basename(file, extname(file)))}.jpg`;
  try {
    const info = await sharp(await decode(join(RAW, file)))
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(join(OUT, name));
    console.log(`${file} -> ${join(OUT, name)} (${info.width}x${info.height})`);
    if (info.width < HERO_MIN_WIDTH) narrow.push(`${name} (${info.width}px)`);
  } catch (error) {
    failed.push(`${file}: ${error.message}`);
  }
}

if (narrow.length > 0) {
  console.log(`\nUnder ${HERO_MIN_WIDTH}px wide, not usable as a hero:`);
  for (const line of narrow) console.log(`  ${line}`);
}

if (failed.length > 0) {
  console.error('\nFailed:');
  for (const line of failed) console.error(`  ${line}`);
  process.exit(1);
}
