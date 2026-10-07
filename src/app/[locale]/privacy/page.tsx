import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { privacy } from "@/content/privacy";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const path = "/privacy";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: getDictionary(locale).privacy.title,
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

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const Body = privacy[locale];

  return (
    <div className="pb-24">
      <header className="mx-auto max-w-[46rem] px-5 pt-14 text-center sm:pt-20">
        <h1 className="text-[2.4rem] font-bold leading-[1.06] tracking-[-0.03em] text-balance sm:text-[3.4rem] md:text-[3.9rem]">
          {dict.privacy.title}
        </h1>
      </header>
      <hr className="mx-auto mt-14 w-16 border-t border-foreground" />
      <article className="mx-auto mt-12 max-w-[48rem] px-5 font-serif text-[1.1875rem] md:mt-16">
        <Body />
      </article>
    </div>
  );
}
