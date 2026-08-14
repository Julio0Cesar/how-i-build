import type { Post } from "@/content/types";
import { localeHref, type Locale } from "@/i18n/config";

export type PostDay = { date: string; title: string; href: string };

/** Every post as a day the calendar can mark, oldest first. */
export function postDays(posts: Post[], locale: Locale): PostDay[] {
  return posts
    .map((post) => {
      const { meta } = post.locales[locale];
      return {
        date: meta.publishedAt,
        title: meta.title,
        href: localeHref(locale, `/blog/${post.slug}`),
      };
    })
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
