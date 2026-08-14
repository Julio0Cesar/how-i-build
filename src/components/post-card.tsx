import Link from "next/link";
import type { Post } from "@/content/types";
import { localeHref, type Locale } from "@/i18n/config";

/**
 * A tile with the cover behind the title. Without a cover it keeps the same
 * shape on a plain surface, so a post can be published before its image exists.
 */
export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const { meta } = post.locales[locale];
  const hasCover = Boolean(meta.coverUrl);

  return (
    <Link
      href={localeHref(locale, `/blog/${post.slug}`)}
      className="group relative flex aspect-[16/10] flex-col justify-end overflow-hidden border border-rule bg-surface p-5 transition-colors hover:border-accent sm:aspect-[16/9]"
    >
      {meta.coverUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- content image, sized by the layout rather than by a pipeline */}
          <img
            src={meta.coverUrl}
            alt={meta.coverAlt ?? ""}
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Readability, not decoration: the title sits on an arbitrary photo. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10"
          />
        </>
      ) : null}

      <div className="relative">
        <time
          dateTime={meta.publishedAt}
          className={`font-mono text-xs uppercase tracking-widest ${
            hasCover ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          {meta.publishedAt}
        </time>
        <h3
          className={`mt-2 font-serif text-lg leading-tight tracking-tight sm:text-xl ${
            hasCover ? "text-white" : "text-foreground"
          }`}
        >
          {meta.title}
        </h3>
        <p
          className={`mt-2 line-clamp-2 text-sm leading-relaxed ${
            hasCover ? "text-white/75" : "text-muted-foreground"
          }`}
        >
          {meta.summary}
        </p>
      </div>
    </Link>
  );
}
