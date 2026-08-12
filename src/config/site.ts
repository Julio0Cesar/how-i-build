import type { SiteConfig } from "./types";

/**
 * `as const` keeps the literal types; `satisfies` checks the shape without
 * widening them. With a plain `: SiteConfig` annotation, `locales` would widen
 * to `string[]` and the `Locale` type derived from it would accept any string.
 */
export const site = {
  name: "how-i-build",
  tagline: "Engineering notes: what I build and the decisions behind it",
  github: {
    owner: "your-username",
    repo: "your-repo",
  },
  liveUrl: "https://example.com",
  socials: {
    email: "you@example.com",
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-handle/",
  },
  locales: ["en", "pt"],
  defaultLocale: "en",
} as const satisfies SiteConfig;
