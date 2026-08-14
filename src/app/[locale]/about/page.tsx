import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { about } from "@/content/about";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const path = "/about";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: getDictionary(locale).about.title,
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

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const Body = about[locale];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="py-12 md:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {dict.about.title}
        </p>
        <h1 className="mt-3 font-serif text-[1.65rem] leading-tight tracking-tight sm:text-3xl md:text-[2.4rem]">
          {dict.about.heading}
        </h1>
      </header>

      <article className="border-t border-rule pb-16 pt-10">
        <Body />
      </article>
    </div>
  );
}
