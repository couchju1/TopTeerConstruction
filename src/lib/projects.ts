import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export interface BeforeAfterPair {
  before: ImageMetadata;
  after: ImageMetadata;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
}

export interface GalleryPhoto {
  id: string;
  src: ImageMetadata;
  alt: string;
  kind: 'before' | 'after' | 'detail' | 'wide';
  town: string;
  caption: string;
  service: string;
}

export async function getProjects(service?: string): Promise<Project[]> {
  const all = await getCollection('projects', (p) => !service || p.data.service === service);
  return all.sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.date.getTime() - a.data.date.getTime(),
  );
}

export function toGalleryPhotos(projects: Project[]): GalleryPhoto[] {
  return projects.flatMap((project) =>
    project.data.photos.map((photo, index) => ({
      id: `${project.id}-${index}`,
      src: photo.src,
      alt: photo.alt,
      kind: photo.kind,
      town: project.data.town,
      caption: project.data.caption,
      service: project.data.service,
    })),
  );
}

export async function getBeforeAfterPair(): Promise<BeforeAfterPair | null> {
  for (const project of await getProjects()) {
    const before = project.data.photos.find((p) => p.kind === 'before');
    const after = project.data.photos.find((p) => p.kind === 'after');
    if (before && after) {
      return {
        before: before.src,
        after: after.src,
        beforeAlt: before.alt,
        afterAlt: after.alt,
        caption: `${project.data.town}. ${project.data.caption}`,
      };
    }
  }
  return null;
}
