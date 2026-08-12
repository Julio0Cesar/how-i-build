/**
 * Every piece of content must exist in every configured locale.
 *
 * Static imports in `src/content/*.ts` already fail the build when a file they
 * reference is missing. This catches the gap they cannot: a file added before
 * it is wired into an index, where nothing imports it and nothing complains.
 *
 * Run with bun, which reads the TypeScript config directly rather than keeping
 * a second copy of the locale list.
 */
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { site } from "../src/config/site";

const root = path.join(process.cwd(), "src", "content");
const locales: readonly string[] = site.locales;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const groups = new Map<string, Set<string>>();

for (const file of walk(root)) {
  const match = /^(.*)\.([a-z]{2})\.mdx$/.exec(file);
  if (!match) continue;
  const [, base, locale] = match;
  if (!locales.includes(locale!)) continue;
  const set = groups.get(base!) ?? new Set<string>();
  set.add(locale!);
  groups.set(base!, set);
}

const missing: string[] = [];

for (const [base, found] of groups) {
  for (const locale of locales) {
    if (!found.has(locale)) {
      missing.push(path.relative(process.cwd(), `${base}.${locale}.mdx`));
    }
  }
}

if (missing.length > 0) {
  console.error("Missing translations:");
  for (const file of missing) console.error(`  ${file}`);
  process.exit(1);
}

console.log(`content: ${groups.size} entries complete in ${locales.join(", ")}`);
