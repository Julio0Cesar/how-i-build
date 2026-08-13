# Writing content

Two kinds of content live in `src/content`, and both are MDX.

```
src/content/
├── projects.ts          project-level data and the imports that bind it
├── profile.ts           who you are
├── privacy.ts           the privacy note
├── profile.en.mdx       standalone pages: body only
├── profile.pt.mdx
├── privacy.en.mdx
├── privacy.pt.mdx
└── projects/
    ├── ledger.en.mdx    a case study: metadata plus body
    └── ledger.pt.mdx
```

Every file exists once per locale, named `<name>.<locale>.mdx`.

## A case study

The file exports its own metadata, then the prose.

```mdx
export const meta = {
  name: "Ledger",
  summary: "One line, shown on the card and in search results.",
  role: "Sole author",
  period: "2026",
  updatedAt: "2026-07-19",
  references: [{ label: "SQLite as a file format", url: "https://…" }],
};

Anything before the first entry is the opening — the situation, the constraint,
what the project is up against.

<Entry title="Storage format" date="2026-06-21" />

One topic: what you hit, what you chose, what came of it.

<Decision>
A single `ledger.db` file, queried in process.
</Decision>

<Tradeoffs>
- A binary file cannot be diffed in a pull request
- Concurrent writes are rejected rather than merged
</Tradeoffs>
```

`updatedAt` is what orders the home page. A case without it sorts last.

## Entries

An entry is one topic. `<Entry>` renders its title and date at opposite ends of
the heading, and the title becomes the table of contents item, so write it as
something worth navigating to.

A plain `## Heading` works too, for a heading that carries no date. Both appear
in the table of contents, in the order they appear in the file.

## Components

| | |
|---|---|
| `<Entry title date />` | starts an entry; `date` is optional |
| `<Decision>` | the call, set apart from the narration |
| `<Tradeoffs>` | what it cost — a list reads best |

They are optional. Where the structure does not help, write paragraphs.

Markdown works as expected: `` `code` ``, **bold**, lists, `[links](/somewhere)`.

## Links

Write internal links without a locale:

```mdx
See [the changelog](/changelog).
```

The renderer adds the current locale, so `/changelog` becomes `/pt/changelog`
for a reader in Portuguese. Writing `/pt/changelog` yourself would send English
readers to the Portuguese page.

External links and `mailto:` are left alone.

## Adding a project

1. Write `src/content/projects/<slug>.<locale>.mdx` for **every** locale.
2. Add it to `src/content/projects.ts`:

```ts
import MineEn, { meta as mineEn } from "./projects/mine.en.mdx";
import MinePt, { meta as minePt } from "./projects/mine.pt.mdx";

export const projects: Project[] = [
  {
    slug: "mine",
    status: "prod",           // in-dev · prod · archived
    visibility: "public",     // private hides the repository link
    stack: ["TypeScript"],
    repoUrl: "https://github.com/you/mine",
    cases: {
      en: { meta: mineEn, Body: MineEn },
      pt: { meta: minePt, Body: MinePt },
    },
  },
];
```

The imports are static on purpose: a missing file fails the build with the path
it could not find, rather than rendering an empty page.

Set `stub: true` for a project you want listed without a write-up. Its card does
not link anywhere, and `/projects/<slug>` returns 404 — an empty page in a
search index is worse than no page.

## Adding a locale

Add it to `locales` in `src/config/site.ts`. **Every existing case will stop
compiling until it has a file in the new language.**

That is the intended behaviour, not a bug to work around: `cases` is a
`Record<Locale, Case>`, so a half-translated site cannot be published by
accident. `bun run typecheck` also runs `scripts/check-content.ts`, which lists
every missing file at once:

```
Missing translations:
  src/content/projects/ledger.es.mdx
```

## Icons

Stack and social labels render as text unless `src/config/site.ts` maps them to
files. The template ships no map, so a fork inherits no third-party marks it did
not ask for.

```ts
icons: {
  stack: { "Next.js": "/brand/nextjs.svg", Bun: "/brand/bun.svg" },
  monochrome: ["Next.js"],          // inverts in dark mode
  social: { github: "/brand/github.svg" },
},
```

A name with no entry stays text, so the map can be partial.

## The site icon

`public/icon.svg` is the browser tab mark. The template ships a neutral
placeholder; replace the file and nothing else changes — the wiring lives in the
root layout and points at that path.

## Standalone pages

`profile` and `privacy` are body-only — no `meta`, no entries. They are wired
the same way, through a `Record<Locale, ComponentType>`, and the same
completeness rules apply.
