import LedgerEn, { meta as ledgerEn } from "./projects/ledger.en.mdx";
import LedgerPt, { meta as ledgerPt } from "./projects/ledger.pt.mdx";
import AtlasEn, { meta as atlasEn } from "./projects/atlas.en.mdx";
import AtlasPt, { meta as atlasPt } from "./projects/atlas.pt.mdx";
import type { Project } from "./types";
import { caseMeta } from "./validate";

/**
 * Static imports, not a lookup by path. A missing file fails the build here,
 * and `Record<Locale, Case>` on `cases` fails the type check if a locale is
 * left out — so a half-translated case cannot ship, without anyone running
 * anything.
 */
export const projects: Project[] = [
  {
    slug: "ledger",
    status: "prod",
    visibility: "public",
    stack: ["TypeScript", "SQLite", "Bun"],
    repoUrl: "https://github.com/your-username/ledger",
    cases: {
      en: { meta: caseMeta(ledgerEn, "projects/ledger.en.mdx"), Body: LedgerEn },
      pt: { meta: caseMeta(ledgerPt, "projects/ledger.pt.mdx"), Body: LedgerPt },
    },
  },
  {
    slug: "atlas",
    status: "in-dev",
    visibility: "private",
    stack: ["Rust", "PostgreSQL"],
    stub: true,
    cases: {
      en: { meta: caseMeta(atlasEn, "projects/atlas.en.mdx"), Body: AtlasEn },
      pt: { meta: caseMeta(atlasPt, "projects/atlas.pt.mdx"), Body: AtlasPt },
    },
  },
];
