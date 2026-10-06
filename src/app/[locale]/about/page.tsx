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
    <div className="pb-24">
      <header className="mx-auto max-w-[46rem] px-5 pt-14 text-center sm:pt-20">
        <h1 className="text-[2.4rem] font-bold leading-[1.06] tracking-[-0.03em] text-balance sm:text-[3.4rem] md:text-[3.9rem]">
          {dict.about.heading}
        </h1>
      </header>
      <hr className="mx-auto mt-14 w-16 border-t border-foreground" />
      <article className="mx-auto mt-12 max-w-[48rem] px-5 text-[1.125rem] md:mt-16">
        <Body />
      </article>
    </div>
  );
}
