import { slug } from "github-slugger";
import { posts } from "@/content/posts";
import type { Post } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { byDate } from "./posts";

export type Tag = { label: string; slug: string; count: number };

/**
 * Slugs come from the same function the headings and the table of contents use,
 * so a label and its URL never disagree.
 */
export function tagsOf(post: Post, locale: Locale): string[] {
  return post.locales[locale].meta.tags ?? [];
}

/** Every tag in a locale, most used first, then alphabetical. */
export function allTags(locale: Locale): Tag[] {
  const counts = new Map<string, { label: string; count: number }>();

  for (const post of posts) {
    for (const label of tagsOf(post, locale)) {
      const key = slug(label);
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { label, count: 1 });
    }
  }

  return [...counts.entries()]
    .map(([key, value]) => ({ slug: key, label: value.label, count: value.count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function postsWithTag(tagSlug: string, locale: Locale): Post[] {
  return byDate(posts, locale).filter((post) =>
    tagsOf(post, locale).some((label) => slug(label) === tagSlug),
  );
}
