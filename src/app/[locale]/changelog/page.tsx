import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { changelogSources } from "@/lib/changelog-sources";
import { getReleases, releaseDate } from "@/lib/integrations";

const path = "/changelog";
const label = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

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
 * An index rather than every release stacked together: you pick a project and
 * read that project's history. Only the newest release of each is fetched here,
 * which is all a row shows.
 */
export default async function ChangelogPage({
  params,
}: PageProps<"/[locale]/changelog">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  const rows = (
    await Promise.all(
      changelogSources(locale).map(async (entry) => ({
        ...entry,
        latest: (await getReleases(1, entry.source))[0] ?? null,
      })),
    )
  ).filter((row) => row.latest !== null);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="grid gap-5 py-12 md:grid-cols-[8rem_1fr] md:gap-10 md:py-20">
        <p className={`${label} md:pt-3`}>{dict.changelog.title}</p>
        <div>
          <h1 className="font-serif text-[1.65rem] leading-tight tracking-tight sm:text-3xl md:text-[2.4rem]">
            {dict.changelog.title}
          </h1>
          <p className="mt-4 max-w-[68ch] leading-relaxed text-muted-foreground">
            {dict.changelog.note}
          </p>
        </div>
      </header>

      {rows.length === 0 ? (
        <p className="max-w-[68ch] border-t border-rule py-12 leading-relaxed text-muted-foreground">
          {dict.changelog.empty}
        </p>
      ) : (
        <ul>
          {rows.map((row) => (
            <li key={row.key}>
              <Link
                href={localeHref(locale, `${path}/${row.key}`)}
                className="group grid gap-2 border-t border-rule py-8 transition-colors hover:text-accent md:grid-cols-[8rem_1fr] md:gap-10"
              >
                <p className={`${label} md:pt-1`}>{row.latest?.tag}</p>
                <div>
                  <h2 className="font-serif text-lg tracking-tight sm:text-xl">
                    {row.name}
                    <ArrowRight
                      className="ml-2 inline size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </h2>
                  <p className={`mt-2 ${label}`}>
                    {dict.changelog.latest}
                    {releaseDate(row.latest?.publishedAt ?? null, locale)
                      ? ` — ${releaseDate(row.latest?.publishedAt ?? null, locale)}`
                      : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
