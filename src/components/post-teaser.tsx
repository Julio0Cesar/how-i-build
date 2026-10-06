import Link from "next/link";
import type { Post } from "@/content/types";
import { localeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { readingMinutes } from "@/lib/toc";

export function postDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** Date and reading time, the two facts a reader uses to pick what to open. */
export function PostMeta({
  post,
  locale,
  dict,
  className = "",
}: {
  post: Post;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}) {
  const { meta } = post.locales[locale];
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground ${className}`}>
      <time dateTime={meta.publishedAt}>{postDate(meta.publishedAt, locale)}</time>
      <span aria-hidden="true">·</span>
      <span>
        {readingMinutes(post.slug, locale)} {dict.blog.minutes}
      </span>
    </p>
  );
}

/**
 * A post as the reader meets it before opening it. `feature` leads the list
 * with the cover at full width; `row` is the archive line, cover at the side;
 * `card` sits in a grid under an article.
 */
export function PostTeaser({
  post,
  locale,
  dict,
  variant = "row",
}: {
  post: Post;
  locale: Locale;
  dict: Dictionary;
  variant?: "feature" | "row" | "card";
}) {
  const { meta } = post.locales[locale];
  const href = localeHref(locale, `/blog/${post.slug}`);
  const tag = meta.tags?.[0];

  const cover = meta.coverUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- content image, sized by the layout rather than by a pipeline
    <img
      src={meta.coverUrl}
      alt={meta.coverAlt ?? ""}
      loading={variant === "feature" ? "eager" : "lazy"}
      className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
    />
  ) : null;

  if (variant === "feature") {
    return (
      <Link href={href} className="group block">
        {cover ? <div className="aspect-[16/9] overflow-hidden bg-muted">{cover}</div> : null}
        <div className={cover ? "mt-8" : ""}>
          {tag ? <p className="text-sm font-semibold text-accent">{tag}</p> : null}
          <h2 className="mt-2 text-[2.25rem] font-bold leading-[1.08] tracking-[-0.025em] text-balance transition-colors group-hover:text-accent sm:text-5xl">
            {meta.title}
          </h2>
          <p className="mt-4 max-w-[38em] text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {meta.summary}
          </p>
          <PostMeta post={post} locale={locale} dict={dict} className="mt-5" />
        </div>
      </Link>
    );
  }

  if (variant === "card") {
    return (
      <Link href={href} className="group block">
        {cover ? <div className="mb-5 aspect-[3/2] overflow-hidden bg-muted">{cover}</div> : null}
        {tag ? <p className="text-sm font-semibold text-accent">{tag}</p> : null}
        <h3 className="mt-1.5 text-xl font-bold leading-snug tracking-tight text-balance transition-colors group-hover:text-accent">
          {meta.title}
        </h3>
        <p className="mt-2 line-clamp-3 leading-relaxed text-muted-foreground">{meta.summary}</p>
        <PostMeta post={post} locale={locale} dict={dict} className="mt-3" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group grid gap-5 py-8 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-start sm:gap-8"
    >
      <div className="min-w-0">
        {tag ? <p className="text-sm font-semibold text-accent">{tag}</p> : null}
        <h3 className="mt-1.5 text-2xl font-bold leading-snug tracking-tight text-balance transition-colors group-hover:text-accent">
          {meta.title}
        </h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{meta.summary}</p>
        <PostMeta post={post} locale={locale} dict={dict} className="mt-3" />
      </div>
      {cover ? <div className="order-first aspect-[3/2] overflow-hidden bg-muted sm:order-none">{cover}</div> : null}
    </Link>
  );
}
