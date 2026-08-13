import { readFileSync } from "node:fs";
import path from "node:path";
import { slug } from "github-slugger";
import type { Locale } from "@/i18n/config";

export type TocItem = { id: string; label: string };

/** Fenced code can contain anything, including something that looks like a heading. */
function withoutFences(source: string): string {
  return source.replace(/^```[\s\S]*?^```/gm, "");
}

/**
 * Entries are read from the file at build time, in document order, in either
 * form: a `##` heading, or an `<Entry title="…">` when the entry carries a date.
 *
 * Ids come from `slug()` — the same function `<Entry>` uses, and the same
 * algorithm behind `rehype-slug` — so the table of contents and the headings
 * agree without a custom plugin, which Turbopack could not run anyway.
 */
export function caseToc(slugName: string, locale: Locale): TocItem[] {
  const file = path.join(
    process.cwd(),
    "src/content/projects",
    `${slugName}.${locale}.mdx`,
  );
  const source = withoutFences(readFileSync(file, "utf8"));
  const pattern = /^##\s+(.+)$|<Entry[^>]*\btitle="([^"]+)"/gm;

  const items: TocItem[] = [];
  for (const match of source.matchAll(pattern)) {
    const label = (match[1] ?? match[2])?.trim();
    if (label) items.push({ id: slug(label), label });
  }

  return items;
}
