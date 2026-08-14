import { posts } from "@/content/posts";
import { projects } from "@/content/projects";
import { localeHref, type Locale } from "@/i18n/config";
import { byDate } from "./posts";
import { byRecency } from "./projects";

export type SearchEntry = {
  kind: "post" | "project";
  title: string;
  summary: string;
  date: string;
  href: string;
};

/**
 * Built once per locale at build time and handed to the client, so searching
 * needs no server and no request. It carries titles and summaries only — the
 * bodies would dwarf the page they ship with.
 */
export function searchIndex(locale: Locale): SearchEntry[] {
  const fromPosts: SearchEntry[] = byDate(posts, locale).map((post) => {
    const { meta } = post.locales[locale];
    return {
      kind: "post",
      title: meta.title,
      summary: meta.summary,
      date: meta.publishedAt,
      href: localeHref(locale, `/blog/${post.slug}`),
    };
  });

  const fromProjects: SearchEntry[] = byRecency(projects, locale)
    // A stub has no page; offering it as a result would lead to a 404.
    .filter((project) => !project.stub)
    .map((project) => {
      const { meta } = project.cases[locale];
      return {
        kind: "project",
        title: meta.name,
        summary: meta.summary,
        date: meta.updatedAt ?? "",
        href: localeHref(locale, `/projects/${project.slug}`),
      };
    });

  return [...fromPosts, ...fromProjects];
}
