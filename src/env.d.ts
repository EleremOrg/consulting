/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Google Search Console HTML-tag verification token. Public by design. */
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
