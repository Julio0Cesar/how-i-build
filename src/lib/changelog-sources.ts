import { site } from "@/config/site";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import {
  parseRepo,
  repoKey,
  siteRepo,
  type RepoSource,
} from "@/lib/integrations";

export type ChangelogSource = {
  /** The repository name, which is also the route segment. */
  key: string;
  name: string;
  source: RepoSource;
};

/**
 * Two repositories of the same name under different owners would collide on the
 * route segment; the first one configured wins.
 *
 * Kept apart from `lib/changelog.ts` deliberately. That module is imported by
 * the `<Release>` MDX component, and this one imports the project index, which
 * imports the MDX files that use the component — putting the two together would
 * close the cycle.
 */
export function changelogSources(locale: Locale): ChangelogSource[] {
  const sources: ChangelogSource[] = [
    { key: repoKey(siteRepo), name: site.name, source: siteRepo },
  ];

  for (const project of projects) {
    if (project.visibility !== "public" || !project.repoUrl) continue;
    const source = parseRepo(project.repoUrl);
    if (!source) continue;

    const key = repoKey(source);
    if (sources.some((entry) => entry.key === key)) continue;

    sources.push({ key, name: project.cases[locale].meta.name, source });
  }

  return sources;
}

