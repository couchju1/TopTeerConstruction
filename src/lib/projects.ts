import type { ImageMetadata } from 'astro';

export interface BeforeAfterPair {
  before: ImageMetadata;
  after: ImageMetadata;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
}

export async function getBeforeAfterPair(): Promise<BeforeAfterPair | null> {
  return null;
}
