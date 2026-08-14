import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/content/types";
import { localeHref, type Locale } from "@/i18n/config";

/**
 * The text sits on a solid band rather than on the photo. A gradient works
 * until someone publishes a light image, and then it fails silently — the band
 * is legible regardless of what is behind it, and the photo stays visible
 * around it.
 */
export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const { meta } = post.locales[locale];
  const hasCover = Boolean(meta.coverUrl);

  return (
    <Link
      href={localeHref(locale, `/blog/${post.slug}`)}
      className="group relative flex min-h-52 flex-col justify-end overflow-hidden border border-rule bg-surface transition-colors hover:border-accent sm:min-h-60"
    >
      {meta.coverUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- content image, sized by the layout rather than by a pipeline */}
          <img
            src={meta.coverUrl}
            alt={meta.coverAlt ?? ""}
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
          />
        </>
      ) : null}

      <div
        className={
          hasCover
            ? "relative bg-black/75 p-5 backdrop-blur-sm transition-colors group-hover:bg-black/85 sm:p-6"
            : "relative p-5 sm:p-6"
        }
      >
        <time
          dateTime={meta.publishedAt}
          className={`font-mono text-xs uppercase tracking-widest ${
            hasCover ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          {meta.publishedAt}
        </time>

        <h3
          className={`mt-2 flex items-center gap-2 font-serif text-xl leading-tight tracking-tight sm:text-2xl ${
            hasCover ? "text-white" : "text-foreground"
          }`}
        >
          {meta.title}
          <ArrowRight
            className="size-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden="true"
          />
        </h3>

        <p
          className={`mt-2 max-w-[68ch] text-sm leading-relaxed ${
            hasCover ? "text-white/75" : "text-muted-foreground"
          }`}
        >
          {meta.summary}
        </p>
      </div>
    </Link>
  );
}
