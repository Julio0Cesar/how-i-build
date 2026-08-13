import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";

export type Release = {
  tag: string;
  version: string | null;
  publishedAt: string | null;
  url: string;
};

/**
 * Fetched once during `next build` — the default `fetch` cache is exactly that,
 * so the route stays statically prerendered and production makes no API call.
 * Nothing here needs to be fresher: every release triggers a sync merge, which
 * triggers a deploy, which runs this again.
 *
 * Returns null on anything unexpected — a private repository answers 404, an
 * exhausted rate limit answers 403, and neither is worth failing a build over.
 */
export async function getLatestRelease(): Promise<Release | null> {
  const { owner, repo } = site.github;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as {
      tag_name?: string;
      published_at?: string | null;
      html_url?: string;
    };
    if (!data.tag_name) return null;

    return {
      tag: data.tag_name,
      version: releaseVersion(data.tag_name),
      publishedAt: data.published_at ?? null,
      url: data.html_url ?? `${repoUrl()}/releases`,
    };
  } catch {
    return null;
  }
}

export function repoUrl(): string {
  return `https://github.com/${site.github.owner}/${site.github.repo}`;
}

/** `v1.2.3` → `1.2.3`. Anything else is left alone. */
export function releaseVersion(tag: string | null | undefined): string | null {
  if (!tag) return null;
  const match = /^v?(\d+\.\d+\.\d+.*)$/.exec(tag.trim());
  return match?.[1] ?? tag.trim();
}

export function releaseMonth(
  published: string | null,
  locale: Locale,
): string | null {
  if (!published) return null;
  const date = new Date(published);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}
