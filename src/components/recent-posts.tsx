import Link from "next/link";
import type { Post } from "@/content/types";
import { localeHref, type Locale } from "@/i18n/config";

/** Titles and dates only: this sits beside an article, not instead of one. */
export function RecentPosts({
  posts,
  locale,
  label,
}: {
  posts: Post[];
  locale: Locale;
  label: string;
}) {
  const listed = posts.slice(0, 6);
  if (listed.length === 0) return null;

  return (
    <section aria-label={label}>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <ul className="mt-4 space-y-4">
        {listed.map((post) => {
          const { meta } = post.locales[locale];
          return (
            <li key={post.slug}>
              <Link
                href={localeHref(locale, `/blog/${post.slug}`)}
                className="group block"
              >
                <span className="block text-sm leading-snug transition-colors group-hover:text-accent">
                  {meta.title}
                </span>
                <time
                  dateTime={meta.publishedAt}
                  className="mt-1 block font-mono text-[0.65rem] text-muted-foreground"
                >
                  {meta.publishedAt}
                </time>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
