import Link from "next/link";
import type { Post } from "@/content/types";
import { localeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Tag } from "@/lib/tags";
import { PostTeaser } from "./post-teaser";

/**
 * The archive as a reading list: the newest post leads at full width, the
 * rest follow one per line. Tags sit under the heading as the only way to
 * narrow it, and the current one is marked.
 */
export function PostIndex({
  title,
  posts,
  tags,
  current,
  locale,
  dict,
}: {
  title: string;
  posts: Post[];
  tags: Tag[];
  current?: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const [lead, ...rest] = posts;

  return (
    <div className="mx-auto max-w-[52rem] px-5 pb-24 pt-14 sm:pt-20">
      <header className="text-center">
        <h1 className="text-[2.6rem] font-bold leading-none tracking-[-0.03em] sm:text-6xl">
          {title}
        </h1>
        {tags.length > 0 ? (
          <nav aria-label={dict.blog.tags} className="mt-8">
            <ul className="flex flex-wrap justify-center gap-2">
              <li>
                <Link
                  href={localeHref(locale, "/blog")}
                  aria-current={current ? undefined : "page"}
                  className="block border border-rule px-3 py-1 text-sm font-medium transition-colors hover:border-foreground aria-[current=page]:border-foreground aria-[current=page]:bg-foreground aria-[current=page]:text-background"
                >
                  {dict.blog.all}
                </Link>
              </li>
              {tags.map((tag) => (
                <li key={tag.slug}>
                  <Link
                    href={localeHref(locale, `/blog/tags/${tag.slug}`)}
                    aria-current={current === tag.slug ? "page" : undefined}
                    className="block border border-rule px-3 py-1 text-sm font-medium transition-colors hover:border-foreground aria-[current=page]:border-foreground aria-[current=page]:bg-foreground aria-[current=page]:text-background"
                  >
                    {tag.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      {lead ? (
        <>
          <div className="mt-14 md:mt-20">
            <PostTeaser post={lead} locale={locale} dict={dict} variant="feature" />
          </div>
          {rest.length > 0 ? (
            <ul className="mt-14 divide-y divide-rule border-t border-rule">
              {rest.map((post) => (
                <li key={post.slug}>
                  <PostTeaser post={post} locale={locale} dict={dict} />
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">{dict.blog.empty}</p>
      )}
    </div>
  );
}
