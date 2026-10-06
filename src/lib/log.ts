import { posts } from "@/content/posts";
import { projects } from "@/content/projects";
import { localeHref, type Locale } from "@/i18n/config";
import { changelogSources } from "@/lib/changelog-sources";
import { getReleases } from "@/lib/integrations";
import { caseEntries } from "@/lib/toc";

export type LogKind = "post" | "decision" | "release";

export type LogEntry = {
  kind: LogKind;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  title: string;
  href: string;
  /** The series an entry belongs to: a project name, or a release's repository. */
  series?: string;
  /** The series' mark, when the project has one. */
  mark?: string;
  summary?: string;
  tags?: string[];
};

/**
 * Everything the site records, as one stream. A post, a dated decision inside
 * a case, and a release are the same kind of thing here: something that
 * happened on a day.
 */
export async function logEntries(locale: Locale): Promise<LogEntry[]> {
  const entries: LogEntry[] = [];

  for (const post of posts) {
    const { meta } = post.locales[locale];
    entries.push({
      kind: "post",
      date: meta.publishedAt,
      title: meta.title,
      href: localeHref(locale, `/blog/${post.slug}`),
      summary: meta.summary,
      tags: meta.tags,
    });
  }

  for (const project of projects) {
    if (project.stub) continue;
    const name = project.cases[locale].meta.name;
    for (const entry of caseEntries(project.slug, locale)) {
      entries.push({
        kind: "decision",
        date: entry.date,
        title: entry.label,
        href: localeHref(locale, `/projects/${project.slug}#${entry.id}`),
        series: name,
        mark: project.markUrl,
      });
    }
  }

  const releases = await Promise.all(
    changelogSources(locale).map(async (source) => ({
      source,
      list: await getReleases(12, source.source),
    })),
  );
  for (const { source, list } of releases) {
    for (const release of list) {
      if (!release.publishedAt) continue;
      entries.push({
        kind: "release",
        date: release.publishedAt.slice(0, 10),
        title: release.tag,
        href: localeHref(locale, `/changelog/${source.key}#${release.tag}`),
        series: source.name,
      });
    }
  }

  return entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export type Series = { slug: string; name: string; count: number; stub: boolean; mark?: string };

/** Projects as series: how many dated entries each has written. */
export function series(locale: Locale): Series[] {
  return projects.map((project) => ({
    slug: project.slug,
    name: project.cases[locale].meta.name,
    count: project.stub ? 0 : caseEntries(project.slug, locale).length,
    stub: Boolean(project.stub),
    mark: project.markUrl,
  }));
}
