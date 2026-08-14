import { site } from "@/config/site";

const placeholder = "https://example.com";

/**
 * Absolute origin for the sitemap and for `robots.txt`, both of which need one.
 *
 * The template ships with a placeholder on purpose, so building with it is not
 * an error — cloning the repository and running `build` has to work before
 * anyone edits a config. It is an error in one case only: a production deploy,
 * which would otherwise publish canonicals pointing at example.com behind a
 * green build. That has happened here once already.
 */
export function baseUrl(): string {
  const url = site.liveUrl.replace(/\/+$/, "");

  if (url === placeholder) {
    const message = `site.liveUrl is still ${placeholder}`;
    if (process.env.VERCEL_ENV === "production") throw new Error(message);
    console.warn(`warning: ${message} — the sitemap will point there`);
  }

  return url;
}
