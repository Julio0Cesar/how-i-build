import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";

export type Release = {
  tag: string;
  version: string | null;
  publishedAt: string | null;
  url: string;
  body: string | null;
};

type ApiRelease = {
  tag_name?: string;
  published_at?: string | null;
  html_url?: string;
  body?: string | null;
};

function toRelease(data: ApiRelease): Release | null {
  if (!data.tag_name) return null;
  return {
    tag: data.tag_name,
    version: releaseVersion(data.tag_name),
    publishedAt: data.published_at ?? null,
    url: data.html_url ?? `${repoUrl()}/releases`,
    body: data.body ?? null,
  };
}

const headers = { Accept: "application/vnd.github+json" };

export type RepoSource = { owner: string; repo: string };

/** `https://github.com/owner/name` or `owner/name`. Null when it is neither. */
export function parseRepo(input: string): RepoSource | null {
  const cleaned = input
    .trim()
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/\.git$/, "");
  const [owner, repo] = cleaned.split("/");
  return owner && repo ? { owner, repo } : null;
}

export const siteRepo: RepoSource = site.github;

/**
 * Route segment for a repository's changelog. Lives here rather than beside the
 * sources so `<Release>` can build a link without importing the project index,
 * which imports the MDX files that use the component.
 */
export function repoKey(source: RepoSource): string {
  return source.repo.toLowerCase();
}

/** One release by tag. Null when it does not exist, is private, or the limit is spent. */
export async function getRelease(
  source: RepoSource,
  tag: string,
): Promise<Release | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${source.owner}/${source.repo}/releases/tags/${tag}`,
      { headers },
    );
    if (!response.ok) return null;
    return toRelease((await response.json()) as ApiRelease);
  } catch {
    return null;
  }
}

/**
 * One page of releases, newest first. Thirty is the API default and far more
 * than a changelog page needs to show — a deliberate ceiling rather than one
 * that turns up on its own in two years.
 */
export async function getReleases(
  limit = 30,
  source: RepoSource = site.github,
): Promise<Release[]> {
  const { owner, repo } = source;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${limit}`,
      { headers },
    );
    if (!response.ok) return [];
    const data = (await response.json()) as ApiRelease[];
    return data.map(toRelease).filter((release): release is Release => Boolean(release));
  } catch {
    return [];
  }
}

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
      { headers },
    );
    if (!response.ok) return null;
    return toRelease((await response.json()) as ApiRelease);
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

export function releaseDate(
  published: string | null,
  locale: Locale,
): string | null {
  if (!published) return null;
  const date = new Date(published);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);
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
