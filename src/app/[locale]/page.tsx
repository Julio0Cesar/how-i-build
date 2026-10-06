import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Log } from "@/components/log";
import { LogLayout, LogSidebar } from "@/components/log-sidebar";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { logEntries } from "@/lib/log";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: localeHref(locale, "/"),
      languages: {
        ...Object.fromEntries(
          locales.map((entry) => [entry, localeHref(entry, "/")]),
        ),
        "x-default": "/",
      },
    },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const entries = await logEntries(locale);

  return (
    <LogLayout sidebar={<LogSidebar locale={locale} dict={dict} intro />}>
      <Log entries={entries} locale={locale} labels={dict.log} />
    </LogLayout>
  );
}
