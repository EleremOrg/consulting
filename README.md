# Elerem website

Marketing site for **Elerem**, an independent software consultancy.
Built with [Astro](https://astro.build) and Tailwind CSS, with a strong SEO baseline.

## Tech stack

- **Astro 5** — content-first, ships zero JS by default (great Core Web Vitals).
- **Tailwind CSS** + `@tailwindcss/typography` for prose pages.
- **Content Collections** with Zod schemas for type-safe blog authoring.
- **`@astrojs/sitemap`** for auto-generated `sitemap-index.xml`.
- **`@astrojs/rss`** for the `/rss.xml` feed.

## SEO features out of the box

- Canonical URLs on every page (driven by `site` in `astro.config.mjs`).
- Unique `<title>` and `<meta name="description">` for each page.
- Open Graph + Twitter Card tags with a default OG image (`public/og/default.svg`).
- JSON-LD structured data: `Organization`, `WebSite`, `ProfessionalService`,
  per-service `Service` entries, `Article` on blog posts, `BreadcrumbList`,
  `FAQPage` on the About page.
- `robots.txt`, `sitemap-index.xml`, `rss.xml` and `site.webmanifest`.
- Semantic HTML, `skip to content` link, accessible focus rings, `aria-current`
  on active nav items, `prefers-reduced-motion` support.
- `max-image-preview:large` robots directive for rich search snippets.
- `noindex` flag on blog posts via frontmatter, plus on the 404 page.
- Prefetch of in-viewport links for near-instant navigation.
- Font preconnect + non-blocking CSS load to protect LCP.

## Before going live — checklist

1. **Set your real domain** in `astro.config.mjs` (`site`) and `public/robots.txt`.
2. Update brand, contact email, social links in `src/consts.ts`.
3. Replace the OG fallback at `public/og/default.svg` with a branded version
   (or generate per-page OG images).
4. Add `public/favicon.ico` and `public/apple-touch-icon.png` (180×180).
5. Swap the Formspree action in `src/pages/contact.astro` for your real endpoint.
6. Submit `https://yourdomain/sitemap-index.xml` to Google Search Console
   and Bing Webmaster Tools.
7. Set up privacy-friendly analytics (Plausible, Fathom or server-side GA4).

## Getting started

```bash
# Inside the Nix dev shell (flake provides Node 22 + pnpm)
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # production build in ./dist
pnpm preview    # preview the production build
pnpm check      # astro check (TS + content schema)
```

## Project structure

```
src/
  components/      # BaseHead, Header, Footer, Hero, Section
  content/
    blog/          # Markdown essays (type-checked via content.config.ts)
  layouts/
    BaseLayout.astro
  pages/
    index.astro    # Home
    about.astro
    services.astro
    work.astro     # Case studies
    contact.astro
    blog/
      index.astro
      [...slug].astro
    rss.xml.ts
    404.astro
  styles/
    global.css     # Tailwind + design tokens
  consts.ts        # Site-wide constants used across SEO tags
public/
  robots.txt
  site.webmanifest
  favicon.svg
  og/default.svg
```

## Writing a blog post

Create a new Markdown file at `src/content/blog/<slug>.md`:

```md
---
title: "Your post title — 10 to 70 characters"
description: "A 50–170 character meta description. This is what Google shows."
publishedAt: 2026-04-17
updatedAt: 2026-04-17        # optional
tags: ["architecture", "slo"]
draft: false                  # true = excluded from build
noindex: false                # true = emit noindex, keep it in RSS off
canonicalUrl: "https://…"     # optional, for syndicated posts
---

Your content here…
```

The content collection schema (`src/content.config.ts`) will fail the build
if SEO-critical fields are missing or malformed.
