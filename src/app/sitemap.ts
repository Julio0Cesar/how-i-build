import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { projects } from "@/content/projects";
import { locales, localeHref, type Locale } from "@/i18n/config";
import { baseUrl } from "@/lib/base-url";
import { allTags } from "@/lib/tags";

/** Present in every locale, whatever the content happens to be. */
const chrome = ["/", "/about", "/blog", "/changelog", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = baseUrl();
  const absolute = (locale: Locale, path: string) =>
    `${origin}${localeHref(locale, path)}`;

  /**
   * One entry per locale, each carrying the others as alternates — the same
   * relationship the pages already declare with `hreflang`, in the one place a
   * crawler reads before it has seen a page.
   *
   * `available` exists because content is not uniformly bilingual: a tag that
   * appears only in Portuguese has only a Portuguese route, and listing an
   * English one would advertise a 404.
   */
  const entry = (
    path: string,
    available: readonly Locale[] = locales,
  ): MetadataRoute.Sitemap =>
    available.map((locale) => ({
      url: absolute(locale, path),
      alternates: {
        languages: Object.fromEntries(
          available.map((other) => [other, absolute(other, path)]),
        ),
      },
    }));

  return [
    ...chrome.flatMap((path) => entry(path)),

    // Stubs have no body and therefore no page — the route would 404.
    ...projects
      .filter((project) => !project.stub)
      .flatMap((project) => entry(`/projects/${project.slug}`)),

    ...posts.flatMap((post) => entry(`/blog/${post.slug}`)),

    ...tagRoutes().flatMap(([slug, available]) =>
      entry(`/blog/tags/${slug}`, available),
    ),
  ];
}

/**
 * Tag slug to the locales that actually have it. A slug can coincide across
 * languages — `process` is spelled the same way in both — and when it does the
 * two routes are alternates of each other rather than two lonely pages.
 */
function tagRoutes(): [string, Locale[]][] {
  const found = new Map<string, Locale[]>();

  for (const locale of locales) {
    for (const tag of allTags(locale)) {
      found.set(tag.slug, [...(found.get(tag.slug) ?? []), locale]);
    }
  }

  return [...found];
}
