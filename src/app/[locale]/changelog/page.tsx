import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Log } from "@/components/log";
import { LogLayout, LogSidebar } from "@/components/log-sidebar";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { logEntries } from "@/lib/log";

const path = "/changelog";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/changelog">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    title: dict.changelog.title,
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

/**
 * Every repository's releases, as the log opened on releases. Each row leads
 * to that repository's own history.
 */
export default async function ChangelogPage({
  params,
}: PageProps<"/[locale]/changelog">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const entries = await logEntries(locale);

  return (
    <LogLayout sidebar={<LogSidebar locale={locale} dict={dict} heading={dict.changelog.title} />}>
      <p className="mb-4 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
        {dict.changelog.note}
      </p>
      <Log entries={entries} locale={locale} labels={dict.log} initial="release" />
    </LogLayout>
  );
}
