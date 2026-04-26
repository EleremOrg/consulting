import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog content collection with an SEO-focused schema:
 *  - title/description drive <title> and meta description
 *  - publishedAt/updatedAt feed Article JSON-LD and sitemap lastmod
 *  - canonicalUrl lets you syndicate without duplicate-content penalties
 *  - noindex flags drafts out of search results at build time
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(10).max(70),
      description: z.string().min(50).max(170),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: z.string().default('Elerem Team'),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      noindex: z.boolean().default(false),
      canonicalUrl: z.string().url().optional(),
    }),
});

export const collections = { blog };
