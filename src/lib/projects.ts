import type { Project } from "@/content/types";
import type { Locale } from "@/i18n/config";

/**
 * Sorting is shape, not data, so it lives here rather than next to the content
 * the `site` branch owns.
 */

/** The most recent section update, or null for a project with no dates yet. */
export function latestUpdate(project: Project, locale: Locale): string | null {
  const dates = Object.values(project.locales[locale].updated).filter(
    (date): date is string => Boolean(date),
  );
  if (dates.length === 0) return null;
  // ISO dates sort correctly as strings.
  return dates.reduce((newest, date) => (date > newest ? date : newest));
}

/**
 * Newest first. A project with no dates — a stub — goes last, and ties keep the
 * order they were declared in, so the list never reshuffles on its own.
 */
export function byRecency(projects: Project[], locale: Locale): Project[] {
  return projects
    .map((project, index) => ({
      project,
      index,
      updated: latestUpdate(project, locale),
    }))
    .sort((a, b) => {
      if (a.updated && b.updated) {
        if (a.updated !== b.updated) return a.updated > b.updated ? -1 : 1;
        return a.index - b.index;
      }
      if (a.updated) return -1;
      if (b.updated) return 1;
      return a.index - b.index;
    })
    .map((entry) => entry.project);
}
