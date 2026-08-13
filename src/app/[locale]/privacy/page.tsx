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
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="grid gap-5 py-12 md:grid-cols-[8rem_1fr] md:gap-10 md:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:pt-3">
          {dict.privacy.title}
        </p>
        <h1 className="font-serif text-[1.65rem] leading-tight tracking-tight sm:text-3xl md:text-[2.4rem]">
          {dict.privacy.title}
        </h1>
      </header>

      <article className="border-t border-rule py-10 md:py-12">
        <Body />
      </article>
    </div>
  );
}
