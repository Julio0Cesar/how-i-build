/**
 * The contract for `site.ts`. This file is the template's shape; the values
 * that fill it are the only thing a fork needs to edit.
 */
export interface SiteConfig {
  /** Browser tab and metadata title. */
  name: string;
  /** One line about the site, used as the meta description. */
  tagline: string;
  /** The repository the site reports on: release version, live status, links. */
  github: {
    owner: string;
    repo: string;
  };
  /** Deployed URL. Health-checked and used for canonical metadata. */
  liveUrl: string;
  socials: {
    email: string;
    github: string;
    linkedin: string;
  };
  /** Available locales. A non-empty tuple so at least one always exists. */
  locales: readonly [string, ...string[]];
  /** Must be one of `locales` — enforced where `Locale` is derived. */
  defaultLocale: string;
}
