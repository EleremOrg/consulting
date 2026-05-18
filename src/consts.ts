/**
 * Site-wide constants used for SEO metadata, structured data, and branding.
 * Keep these accurate — they appear in page titles, meta descriptions,
 * schema.org JSON-LD, sitemap, RSS feed, and social previews.
 */

export const SITE = {
  name: 'Elerem',
  legalName: 'Elerem',
  tagline: 'Helping teams fall back in love with their codebase',
  description:
    'We help software teams eliminate tech debt, ship with confidence, and build engineering practices that last — so you can focus on what matters.',
  url: 'https://elerem.com',
  locale: 'en_US',
  language: 'en',
  defaultOgImage: '/og/default.svg',
  twitter: '@elerem',
  email: 'hello@elerem.com',
  founderName: 'Elerem Team',
  foundingDate: '2024-01-01',
  address: {
    addressLocality: 'Remote',
    addressCountry: 'EU',
  },
  sameAs: [
    'https://github.com/elerem',
    'https://www.linkedin.com/company/elerem',
  ],
} as const;

/**
 * Primary navigation links — kept intentionally small.
 * The "Contact" CTA is rendered as a button in Header/Footer separately
 * and so is not included here.
 */
export const NAV_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  // { href: '/#services', label: 'Services' }, // merged into the home page
  // { href: '/blog', label: 'Blog' }, // hidden until first post is published
];
