// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const BLOG_DIR = 'src/content/blog';

/**
 * Pull `updatedAt` / `publishedAt` out of a post's frontmatter.
 *
 * The sitemap integration's `serialize` hook has no access to content
 * collections, so we read the raw frontmatter instead. Post frontmatter is
 * flat key/value YAML, which makes a line match sufficient — no YAML parser
 * needed, and nothing to keep in sync with the content schema.
 */
/** @param {string} source @returns {Date | undefined} */
const postDate = (source) => {
  const field = source.match(/^(updatedAt|publishedAt):\s*(.+)$/m);
  if (!field) return undefined;
  const date = new Date(field[2].trim().replace(/^["']|["']$/g, ''));
  return Number.isNaN(date.valueOf()) ? undefined : date;
};

/** Map of `/blog/<slug>` -> last modification date, for sitemap `lastmod`. */
const postLastmod = new Map();
for (const file of readdirSync(BLOG_DIR)) {
  if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
  const source = readFileSync(`${BLOG_DIR}/${file}`, 'utf8');
  const date = postDate(source);
  if (date) postLastmod.set(`/blog/${file.replace(/\.mdx?$/, '')}`, date);
}

// IMPORTANT: update `site` to the production domain — used for canonical URLs,
// sitemap.xml, robots.txt and Open Graph absolute URLs. SEO relies on this.
// It must match the host actually serving the site, and the `Sitemap:` line in
// public/robots.txt. If these disagree, search engines follow the canonical to
// a host that does not resolve and index nothing.
export default defineConfig({
  site: 'https://consulting.elerem.com',
  trailingSlash: 'never',
  build: {
    // 'file' emits /blog.html rather than /blog/index.html. With
    // trailingSlash: 'never' the canonical is /blog, so 'directory' made the
    // static host 307-redirect /blog -> /blog/ and the canonical disagreed
    // with the redirect target.
    format: 'file',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // No global `lastmod`. `lastmod: new Date()` stamped the build time onto
      // every URL on every deploy, which tells crawlers all pages changed
      // always and makes the field worthless. Instead each post reports its
      // real frontmatter date; static pages omit lastmod rather than lie.
      serialize: (item) => {
        const lastmod = postLastmod.get(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : { ...item, lastmod: undefined };
      },
    }),
  ],
});
