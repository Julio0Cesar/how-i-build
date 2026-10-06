import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostMeta, PostTeaser } from "@/components/post-teaser";
import { ReadingProgress } from "@/components/reading-progress";
import { TagChips } from "@/components/tag-chips";
import { posts } from "@/content/posts";
import type { Post } from "@/content/types";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { byDate } from "@/lib/posts";
import { slug as slugOf } from "github-slugger";

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
  const tag = meta.tags?.[0];
  const more = byDate(posts, locale)
    .filter((entry) => entry.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="pb-24">
      <ReadingProgress />

      <article>
        {/* Nothing beside the text: the header, the cover and the column are
            all the page is while it is being read. */}
        <header className="mx-auto max-w-[46rem] px-5 pt-14 text-center sm:pt-20">
          {tag ? (
            <Link
              href={localeHref(locale, `/blog/tags/${slugOf(tag)}`)}
              className="text-sm font-semibold text-accent transition-opacity hover:opacity-75"
            >
              {tag}
            </Link>
          ) : null}
          <h1 className="mt-4 text-[2.4rem] font-bold leading-[1.06] tracking-[-0.03em] text-balance sm:text-[3.4rem] md:text-[3.9rem]">
            {meta.title}
          </h1>
          <p className="mx-auto mt-6 max-w-[34em] text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
            {meta.summary}
          </p>
          <PostMeta post={post} locale={locale} dict={dict} className="mt-6 justify-center" />
        </header>

        {meta.coverUrl ? (
          <figure className="mx-auto mt-12 max-w-[72rem] px-0 sm:px-5 md:mt-16">
            {/* eslint-disable-next-line @next/next/no-img-element -- content image, sized by the layout rather than by a pipeline */}
            <img
              src={meta.coverUrl}
              alt={meta.coverAlt ?? ""}
              className="aspect-[16/9] max-h-[78vh] w-full object-cover"
            />
          </figure>
        ) : (
          <hr className="mx-auto mt-14 w-16 border-t border-foreground" />
        )}

        <div className="post-body mx-auto mt-12 max-w-[42rem] px-5 text-[1.1875rem] md:mt-16">
          <Body />

          {meta.tags?.length ? (
            <div className="mt-14 border-t border-rule pt-6">
              <TagChips tags={meta.tags} locale={locale} />
            </div>
          ) : null}
        </div>
      </article>

      {more.length > 0 ? (
        <section className="mt-24 border-t border-rule bg-sheet py-16 md:mt-32" aria-labelledby="read-next">
          <div className="mx-auto max-w-[72rem] px-5">
            <h2 id="read-next" className="text-2xl font-bold tracking-tight">
              {dict.blog.readNext}
            </h2>
            <ul className="mt-8 grid gap-12 md:grid-cols-3 md:gap-10">
              {more.map((entry) => (
                <li key={entry.slug}>
                  <PostTeaser post={entry} locale={locale} dict={dict} variant="card" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
