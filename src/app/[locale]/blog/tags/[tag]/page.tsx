import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PostIndex } from "@/components/post-index";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { allTags, counterpartTag, postsWithTag } from "@/lib/tags";


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
  if (!found) {
    /**
     * A tag slug is language-specific, so the language switch rebuilds a path
     * that exists only in the locale it came from. Rather than a dead end,
     * answer with the same tag in this locale. A slug no locale knows still
     * reaches `notFound`.
     */
    for (const other of locales) {
      if (other === locale) continue;

      const counterpart = counterpartTag(tag, other, locale);
      if (counterpart) redirect(localeHref(locale, `/blog/tags/${counterpart}`));
    }

    notFound();
  }

  const dict = getDictionary(locale);

  return (
    <PostIndex
      title={found.label}
      posts={postsWithTag(tag, locale)}
      tags={allTags(locale)}
      current={found.slug}
      locale={locale}
      dict={dict}
    />
  );
}
