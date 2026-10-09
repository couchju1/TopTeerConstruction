import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import siteConfig from '../site.config.json';

const towns = siteConfig.location.serviceTowns as [string, ...string[]];
const serviceSlugs = siteConfig.services.map((s) => s.slug) as [string, ...string[]];

const required = (label: string) => z.string().trim().min(1, `${label} must not be empty`);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: required('title'),
      town: z.enum(towns),
      service: z.enum(serviceSlugs),
      date: z.coerce.date(),
      cover: image(),
      photos: z
        .array(
          z.object({
            src: image(),
            alt: required('alt'),
            kind: z.enum(['before', 'after', 'detail', 'wide']),
          }),
        )
        .min(1),
      caption: required('caption').refine((c) => !/\n/.test(c) && (c.match(/[.!?](\s|$)/g) ?? []).length <= 1, {
        message: 'caption must be one plain sentence',
      }),
      featured: z.boolean().default(false),
    }),
});

export const collections = { projects };
