import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostIndex } from "@/components/post-index";
import { posts } from "@/content/posts";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { byDate } from "@/lib/posts";
import { allTags } from "@/lib/tags";

const path = "/blog";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: getDictionary(locale).blog.title,
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

export default async function BlogIndex({
  params,
}: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <PostIndex
      title={dict.blog.title}
      posts={byDate(posts, locale)}
      tags={allTags(locale)}
      locale={locale}
      dict={dict}
    />
  );
}
