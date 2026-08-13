import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { parseReleaseBody } from "@/lib/changelog";
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

export default async function ChangelogPage({
  params,
}: PageProps<"/[locale]/changelog">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const releases = await getReleases();

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
                className="grid gap-5 border-t border-rule py-10 md:grid-cols-[8rem_1fr] md:gap-10 md:py-12"
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
                    // An unexpected body shape degrades to a link instead of blank space.
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
                                  {ref.label.replace(/^([0-9a-f]{7})[0-9a-f]+$/, "$1")}
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
