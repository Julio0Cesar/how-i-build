import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  defaultLocale,
  isLocale,
  locales,
  localeHref,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { parseReleaseBody } from "@/lib/changelog";
import { changelogSources } from "@/lib/changelog-sources";
import { getReleases, releaseDate } from "@/lib/integrations";


function find(locale: Locale, repo: string) {
  return changelogSources(locale).find((entry) => entry.key === repo);
}

export function generateStaticParams() {
  // Keys do not depend on the language; only the display name does.
  const keys = changelogSources(defaultLocale).map((entry) => entry.key);
  return locales.flatMap((locale) => keys.map((repo) => ({ locale, repo })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/changelog/[repo]">): Promise<Metadata> {
  const { locale, repo } = await params;
  if (!isLocale(locale)) return {};

  const entry = find(locale, repo);
  if (!entry) return {};

  const path = `/changelog/${repo}`;
  const dict = getDictionary(locale);

  return {
    title: `${entry.name} — ${dict.changelog.title}`,
    alternates: {
      canonical: localeHref(locale, path),
      languages: {
        ...Object.fromEntries(
          locales.map((other) => [other, localeHref(other, path)]),
        ),
        "x-default": path,
      },
    },
  };
}

/**
 * One project's releases. Every entry carries its tag as an id, which is what
 * lets a `<Release>` inside a case study link to the release it names instead
 * of sending the reader to GitHub.
 */
export default async function ProjectChangelogPage({
  params,
}: PageProps<"/[locale]/changelog/[repo]">) {
  const { locale, repo } = await params;
  if (!isLocale(locale)) notFound();

  const entry = find(locale, repo);
  if (!entry) notFound();

  const dict = getDictionary(locale);
  const releases = await getReleases(30, entry.source);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:px-6 lg:pt-14">
      <div>
      <header className="border-b border-foreground pb-10">
        <div>
          <Link
            href={localeHref(locale, "/changelog")}
            className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              className="size-3.5 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            {dict.changelog.title}
          </Link>
        </div>
        <div>
          <h1 className="mt-6 text-[2.4rem] font-bold leading-[1.06] tracking-[-0.03em] sm:text-[3.4rem]">
            {entry.name}
          </h1>
          <p className="mt-4 max-w-[68ch] leading-relaxed text-muted-foreground">
            {dict.changelog.note}
          </p>
        </div>
      </header>

      {releases.length === 0 ? (
        <p className="max-w-[68ch] py-10 leading-relaxed text-muted-foreground">
          {dict.changelog.empty}
        </p>
      ) : (
        <ol>
          {releases.map((release) => {
            const sections = parseReleaseBody(release.body);
            const date = releaseDate(release.publishedAt, locale);

            return (
              <li
                key={release.tag}
                id={release.tag}
                // Clears the fixed header when the page opens on an anchor.
                className="grid scroll-mt-24 gap-5 border-t border-rule py-8 first:border-t-0 md:grid-cols-[9rem_1fr] md:gap-10"
              >
                <div>
                  <h2 className="data text-lg font-medium">
                    <a
                      href={release.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="cursor-pointer transition-colors hover:text-accent"
                    >
                      {release.tag}
                    </a>
                  </h2>
                  {date ? (
                    <time
                      dateTime={release.publishedAt ?? undefined}
                      className="data mt-1 block text-xs text-muted-foreground"
                    >
                      {date}
                    </time>
                  ) : null}
                </div>

                <div className="min-w-0">
                  {sections.length === 0 ? (
                    <a
                      href={release.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="cursor-pointer border-b border-rule text-sm transition-colors hover:border-foreground hover:text-foreground"
                    >
                      {dict.changelog.release}
                    </a>
                  ) : (
                    sections.map((section) => (
                      <div key={section.title} className="mt-6 first:mt-0">
                        {section.title ? (
                          <h3 className="text-sm font-semibold">{section.title}</h3>
                        ) : null}
                        <ul className="mt-2 max-w-[68ch] list-disc space-y-2 pl-5 leading-relaxed">
                          {section.items.map((item, index) => (
                            <li key={index}>
                              {item.text}
                              {item.refs.map((ref) => (
                                <a
                                  key={ref.url}
                                  href={ref.url}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="ml-2 cursor-pointer font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
                                >
                                  {ref.label.replace(
                                    /^([0-9a-f]{7})[0-9a-f]+$/,
                                    "$1",
                                  )}
                                </a>
                              ))}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
      </div>
    </div>
  );
}
