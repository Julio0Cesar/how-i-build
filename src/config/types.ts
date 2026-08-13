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
  /**
   * Optional icon paths, served from `public/`. Absent means the label renders
   * as text — which is what the template ships, so a fork inherits no
   * third-party trademarks it did not ask for.
   */
  icons?: {
    /** Technology name to path. A name with no entry stays text. */
    stack?: Record<string, string>;
    /**
     * Marks drawn in one flat colour, listed by stack name or social key.
     * Brightness cannot rescue them on a dark background, so they invert
     * instead — and an SVG loaded through `<img>` is an isolated document, so
     * `currentColor` inside it would not inherit the page's colour.
     */
    monochrome?: string[];
    social?: Partial<Record<"email" | "github" | "linkedin", string>>;
  };
  /** Available locales. A non-empty tuple so at least one always exists. */
  locales: readonly [string, ...string[]];
  /** Must be one of `locales` — enforced where `Locale` is derived. */
  defaultLocale: string;
}
