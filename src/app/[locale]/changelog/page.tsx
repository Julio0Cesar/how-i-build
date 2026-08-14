import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { parseReleaseBody } from "@/lib/changelog";
import { projects } from "@/content/projects";
import {
  getReleases,
  parseRepo,
  releaseDate,
  siteRepo,
  type RepoSource,
} from "@/lib/integrations";

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

  /**
   * This site first, then every public project that names a repository. A
   * private one answers 404 and drops out silently rather than failing a build.
   */
  const sources: { name: string; source: RepoSource }[] = [
    { name: site.name, source: siteRepo },
    ...projects.flatMap((project) => {
      if (project.visibility !== "public" || !project.repoUrl) return [];
      const source = parseRepo(project.repoUrl);
      if (!source) return [];
      return [{ name: project.cases[locale].meta.name, source }];
    }),
  ];

  const groups = (
    await Promise.all(
      sources.map(async (entry) => ({
        ...entry,
        releases: await getReleases(30, entry.source),
      })),
    )
  ).filter((group) => group.releases.length > 0);

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

      {groups.length === 0 ? (
        <p className="max-w-[68ch] border-t border-rule py-12 leading-relaxed text-muted-foreground">
          {dict.changelog.empty}
        </p>
      ) : (
        groups.map((group) => (
          <section key={`${group.source.owner}/${group.source.repo}`}>
            <h2 className={`border-t border-rule pt-10 ${label}`}>{group.name}</h2>
            <ol>
              {group.releases.map((release) => {
                const sections = parseReleaseBody(release.body);
                const date = releaseDate(release.publishedAt, locale);

                return (
                  <li
                    key={release.tag}
                    className="grid gap-5 border-t border-rule py-8 first:border-t-0 md:grid-cols-[8rem_1fr] md:gap-10"
                  >
                    <div className="md:pt-1">
                      <h3 className="font-mono text-sm tracking-tight">
                        <a
                          href={release.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="cursor-pointer transition-colors hover:text-accent"
                        >
                          {release.tag}
                        </a>
                      </h3>
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
          </section>
        ))
      )}
    </div>
  );
}
