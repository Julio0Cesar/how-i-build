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
    owner: "Julio0Cesar",
    repo: "how-i-build",
  },
  liveUrl: "https://how-i-build-delta.vercel.app",
  socials: {
    email: "juliocesar70777077@gmail.com",
    github: "https://github.com/Julio0Cesar",
    linkedin: "https://www.linkedin.com/in/byjuliocesa/",
  },
  locales: ["en", "pt"],
  defaultLocale: "en",
} as const satisfies SiteConfig;
