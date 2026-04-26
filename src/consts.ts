/**
 * Site-wide constants used for SEO metadata, structured data, and branding.
 * Keep these accurate — they appear in page titles, meta descriptions,
 * schema.org JSON-LD, sitemap, RSS feed, and social previews.
 */

export const SITE = {
  name: 'Elerem',
  legalName: 'Elerem',
  tagline: 'Independent software consultancy',
  description:
    'Elerem is an independent software consultancy helping startups and scale-ups ship resilient, high-performance products. Architecture reviews, hands-on engineering, and technical leadership.',
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

export const NAV_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];
