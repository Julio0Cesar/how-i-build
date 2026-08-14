import type { Post } from "@/content/types";
import type { Locale } from "@/i18n/config";

/** Newest first. Ties keep declaration order, so the list never reshuffles. */
export function byDate(posts: Post[], locale: Locale): Post[] {
  return posts
    .map((post, index) => ({ post, index }))
    .sort((a, b) => {
      const left = a.post.locales[locale].meta.publishedAt;
      const right = b.post.locales[locale].meta.publishedAt;
      // ISO dates compare correctly as strings.
      if (left !== right) return left > right ? -1 : 1;
      return a.index - b.index;
    })
    .map((entry) => entry.post);
}

/**
 * Reading order, not list order: `previous` is the post published before this
 * one, so it sits later in a newest-first list.
 */
export function neighbours(posts: Post[], locale: Locale, slug: string) {
  const ordered = byDate(posts, locale);
  const index = ordered.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined };

  return {
    previous: ordered[index + 1],
    next: ordered[index - 1],
  };
}
