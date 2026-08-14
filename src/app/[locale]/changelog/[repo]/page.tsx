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

const label = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

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
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="grid gap-5 py-12 md:grid-cols-[8rem_1fr] md:gap-10 md:py-20">
        <div className="md:pt-3">
          <Link
            href={localeHref(locale, "/changelog")}
            className={`group inline-flex cursor-pointer items-center gap-2 transition-colors hover:text-accent ${label}`}
          >
            <ArrowLeft
              className="size-3.5 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            {dict.changelog.title}
          </Link>
        </div>
        <div>
          <h1 className="font-serif text-[1.65rem] leading-tight tracking-tight sm:text-3xl md:text-[2.4rem]">
            {entry.name}
          </h1>
          <p className="mt-4 max-w-[68ch] leading-relaxed text-muted-foreground">
            {dict.changelog.note}
          </p>
        </div>
      </header>

      {releases.length === 0 ? (
        <p className="max-w-[68ch] border-t border-rule py-12 leading-relaxed text-muted-foreground">
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
                className="grid scroll-mt-24 gap-5 border-t border-rule py-10 md:grid-cols-[8rem_1fr] md:gap-10 md:py-12"
              >
                <div className="md:pt-1">
                  <h2 className="font-mono text-sm tracking-tight">
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
                      className={`mt-2 block ${label}`}
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
                      className="cursor-pointer border-b border-rule text-sm transition-colors hover:border-accent hover:text-accent"
                    >
                      {dict.changelog.release}
                    </a>
                  ) : (
                    sections.map((section) => (
                      <div key={section.title} className="mt-6 first:mt-0">
                        {section.title ? (
                          <p className={label}>{section.title}</p>
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
  );
}
