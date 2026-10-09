# Elerem website

check https://www.raphaelbauer.com/services/

we can have
    "predev": "pnpm run favicons",
    "prebuild": "pnpm run favicons",
to run things pre some condition, cool

TODO
create blog post:
- how bad management slwos down the team
- how lack of clear goals and objectives makes you run in circles
- about the distributed monolith problem and not moving forward
- about reliying on llms and ignoring years of expertise
- about trying to anticipate issues instead of solving the one sin front of you



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
6. Submit `https://consulting.elerem.com/sitemap-index.xml` to Google Search
   Console and Bing Webmaster Tools. See "Search Console" below.
7. Set up privacy-friendly analytics (Plausible, Fathom or server-side GA4).

## Search Console

Verified via a **DNS TXT record** on `consulting.elerem.com`:

```txt
google-site-verification=8NPa8vMkhwo3HAU4dXcvvaGcjGPAGsGz58ZZLXZ-2FE
```

DNS is the primary method because it proves control of the zone without the
site having to respond, and it survives deploys, theme swaps and platform
moves. Google re-checks it periodically — **do not delete the record**, or the
property loses verification.

There is also an optional HTML-tag fallback in `src/components/BaseHead.astro`,
emitted only when set:

```bash
PUBLIC_GOOGLE_SITE_VERIFICATION=8NPa8vMkhwo3HAU4dXcvvaGcjGPAGsGz58ZZLXZ-2FE pnpm build
```

The token is public in the HTML by design, so it is a `PUBLIC_` var and needs no
CI secret. It is a fallback, not the primary — if the two ever disagree, trust
DNS.

Note that verification says nothing about whether the site is reachable or
where its canonicals point. Check the canonical host when impressions look
empty; see the `site` comment in `astro.config.mjs`.

## Getting started

```bash
# Inside the Nix dev shell (flake provides Node 22 + pnpm)
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # production build in ./dist
pnpm preview    # preview the production build
pnpm check      # astro check (TS + content schema)
pnpm og         # regenerate Open Graph cards only
```

`predev` and `prebuild` run `favicons` then `og`, so generated assets are always
current. You rarely need to invoke them directly.

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
scripts/
  build-favicon-round.mjs   # favicon.svg -> favicon-round.svg
  build-og.mjs              # blog frontmatter -> public/og/*.png
  fonts/                    # vendored Inter TTFs (OFL) for OG rendering
linkedin/                   # LinkedIn post drafts + publishing calendar
public/
  robots.txt
  site.webmanifest
  favicon.svg
  og/               # generated: default.png + one card per blog post
```

## Open Graph cards

`scripts/build-og.mjs` reads the `title` and `description` of every file in
`src/content/blog/` and renders a 1200×630 PNG per post into `public/og/`. It
also writes `public/og/default.png`, the site-wide fallback referenced by
`SITE.defaultOgImage`.

Cards are **PNG, not SVG**, on purpose: LinkedIn, Facebook, Slack and X silently
drop SVG OG images.

Inter is embedded from `scripts/fonts/` because libvips resolves fonts through
the host fontconfig, and the Nix flake does not provide Inter — without
vendoring it the cards would silently render in DejaVu Sans while the site
renders in Inter. See `scripts/fonts/README.md`.

To use a card, set `cover` in the post frontmatter:

```md
cover: "/og/<slug>.png"
coverAlt: "Descriptive alt text for the card"
```

Add new weights by dropping the static TTF into `scripts/fonts/` and listing it
in `WEIGHTS`.

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
cover: "/og/<slug>.png"       # optional OG card (see scripts/build-og.mjs)
coverAlt: "Alt text for the card"
canonicalUrl: "https://…"     # optional, for syndicated posts
---

Your content here…
```

The content collection schema (`src/content.config.ts`) will fail the build
if SEO-critical fields are missing or malformed.

Run `pnpm og` after adding or renaming a post so the card matches the new slug.

## LinkedIn

`linkedin/` holds the post drafts and the publishing calendar — see
`linkedin/README.md` for the voice rule, the cadence and the week-by-week plan.

## Push new release
```bash
git tag v1.2.3
git push origin v1.2.3
```
