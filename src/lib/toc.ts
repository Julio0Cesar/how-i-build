import { readFileSync } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { Locale } from "@/i18n/config";

export type TocItem = { id: string; label: string };

/**
 * Entries are the `##` headings of the case, read from the file at build time.
 * The ids come from the same slugger `rehype-slug` uses, so they match what
 * ends up in the HTML without a custom plugin — which Turbopack could not run
 * anyway, since it only accepts plugins named by string.
 */
export function caseToc(slug: string, locale: Locale): TocItem[] {
  const file = path.join(
    process.cwd(),
    "src/content/projects",
    `${slug}.${locale}.mdx`,
  );
  const source = readFileSync(file, "utf8");
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of source.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line.startsWith("## ")) continue;
    const label = line.slice(3).trim();
    items.push({ id: slugger.slug(label), label });
  }

  return items;
}
