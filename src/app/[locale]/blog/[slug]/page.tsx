import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/reading-progress";
import { posts } from "@/content/posts";
import type { Post } from "@/content/types";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { neighbours } from "@/lib/posts";

const label = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

function find(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = find(slug);
  if (!isLocale(locale) || !post) return {};

  const { meta } = post.locales[locale];
  const path = `/blog/${post.slug}`;

  return {
    title: meta.title,
    description: meta.summary,
    openGraph: meta.coverUrl ? { images: [meta.coverUrl] } : undefined,
    alternates: {
      canonical: localeHref(locale, path),
      languages: {
        ...Object.fromEntries(
          locales.map((entry) => [entry, localeHref(entry, path)]),
        ),
        "x-default": path,
      },
    },
  };
}

export default async function PostPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const post = find(slug);
  if (!post) notFound();

  const { meta, Body } = post.locales[locale];
  const dict = getDictionary(locale);
  const { previous, next } = neighbours(posts, locale, post.slug);

  return (
    <div>
      <ReadingProgress />

      {/*
        Pinned while the article scrolls over it. The content below is opaque
        and comes later in the DOM, so it occludes the image without a negative
        z-index — which would put it behind the page's own background and out
        of sight entirely.
      */}
      {meta.coverUrl ? (
        <div className="sticky top-14 h-[55vh] w-full overflow-hidden sm:top-16 sm:h-[65vh]">
          {/* eslint-disable-next-line @next/next/no-img-element -- content image, sized by the layout rather than by a pipeline */}
          <img
            src={meta.coverUrl}
            alt={meta.coverAlt ?? ""}
            className="size-full object-cover"
          />
        </div>
      ) : null}

      <div
        className={`relative mx-auto max-w-3xl bg-background px-4 sm:px-6 ${
          meta.coverUrl ? "-mt-[14vh] pb-16 pt-10 sm:pt-12" : "pb-16 pt-12 md:pt-20"
        }`}
      >
        <header>
          <time dateTime={meta.publishedAt} className={label}>
            {meta.publishedAt}
          </time>
          <h1 className="mt-3 font-serif text-[1.65rem] leading-tight tracking-tight sm:text-3xl md:text-[2.4rem]">
            {meta.title}
          </h1>
        </header>

        <article className="pt-6">
          <Body />
        </article>

        {previous || next ? (
          <nav aria-label={dict.blog.title} className="mt-16 border-t border-rule">
            {[
              { post: next, caption: dict.blog.next },
              { post: previous, caption: dict.blog.previous },
            ].map(({ post: sibling, caption }) =>
              sibling ? (
                <Link
                  key={sibling.slug}
                  href={localeHref(locale, `/blog/${sibling.slug}`)}
                  className="group block border-b border-rule py-5 transition-transform hover:translate-x-2"
                >
                  <span className={`block ${label}`}>{caption}</span>
                  <span className="mt-1 block font-serif text-lg tracking-tight transition-colors group-hover:text-accent">
                    {sibling.locales[locale].meta.title}
                  </span>
                </Link>
              ) : null,
            )}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
