# Contributing

This is a template as much as it is a site. Most changes belong to one of two
categories, and knowing which decides almost everything else.

## Shape or data

`main` owns shape: routes, components, libraries, i18n, configuration schema,
infrastructure. `site` owns data: the projects, the posts, the profile, the
values in `src/config/site.ts`, brand assets.

Merges go `main → site`, never the reverse. A template bug found while writing
content is fixed on `main` and arrives on `site` through the sync merge. See
[Branches](README.md#branches).

## Before opening a pull request

Run the chain with `.next/` removed, and check exit codes rather than output —
the build prints its route table before it can still fail:

```bash
bun install && bun run typecheck && bun run lint && bun run build
```

`typecheck` runs `next typegen` first, because `tsconfig.json` includes
`.next/types/**` and those globals do not exist on a clean clone. It also runs
`scripts/check-content.ts`, which catches content that exists in one locale and
not another.

CI runs the same three commands on every pull request.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org), English, imperative
mood, lowercase subject. The version is derived from them, so the prefix is not
decoration — see [docs/RELEASING.md](docs/RELEASING.md).

A body only when there is a *why* worth recording: a constraint, an alternative
that was rejected, a trap avoided. The diff already says what changed, so a
bullet-point summary of it is noise.

```
fix: resolve @/* alias from src instead of repo root
```

## Content

Content is MDX and lives in `src/content`. Every piece of it exists in every
configured locale, and the build fails when it does not.
[docs/CONTENT.md](docs/CONTENT.md) covers the formats, the components available
inside a case study, and how to add a project, a post or a language.

## Things that will bite you

- **Never run Next through the Bun runtime.** Not `bun --bun next build`, not
  `[run] bun = true` in `bunfig.toml`. Both segfault on teardown *after* the
  build has succeeded, which looks like a build failure and is not one. Bun is
  the package manager and the task runner; Node runs the build.
- **This version of Next uses `src/proxy.ts`, not `middleware.ts`.**
- **A stale `.next/` hides a broken `typecheck`.** Remove it before trusting a
  pass.
