import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { allTags, postsWithTag } from "@/lib/tags";

const label = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

export function generateStaticParams() {
  // A tag that exists only in one language generates only that route.
  return locales.flatMap((locale) =>
    allTags(locale).map((tag) => ({ locale, tag: tag.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/tags/[tag]">): Promise<Metadata> {
  const { locale, tag } = await params;
  if (!isLocale(locale)) return {};

  const found = allTags(locale).find((entry) => entry.slug === tag);
  if (!found) return {};

  const path = `/blog/tags/${tag}`;
  return {
    title: found.label,
    alternates: {
      canonical: localeHref(locale, path),
      languages: {
        ...Object.fromEntries(
          locales.map((entry) => [entry, localeHref(entry, path)]),
        ),
      },
    },
  };
}

export default async function TagPage({
  params,
}: PageProps<"/[locale]/blog/tags/[tag]">) {
  const { locale, tag } = await params;
  if (!isLocale(locale)) notFound();

  const found = allTags(locale).find((entry) => entry.slug === tag);
  if (!found) notFound();

  const dict = getDictionary(locale);
  const listed = postsWithTag(tag, locale);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="grid gap-5 py-12 md:grid-cols-[8rem_1fr] md:gap-10 md:py-20">
        <p className={`${label} md:pt-3`}>{dict.blog.tag}</p>
        <h1 className="font-serif text-[1.65rem] leading-tight tracking-tight sm:text-3xl md:text-[2.4rem]">
          {found.label}
        </h1>
      </header>

      <ul className="space-y-5 border-t border-rule pt-10">
        {listed.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}
