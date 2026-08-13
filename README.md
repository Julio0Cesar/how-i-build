# how-i-build

A template for an engineering notes site: short write-ups on what you build and the decisions behind them, in two languages, with the version and changelog read from your own GitHub releases.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime and package manager | Bun |
| UI | React 19, Tailwind CSS 4, IBM Plex |
| i18n | `/[locale]` routing, default locale unprefixed |
| Releases | release-please, GitHub Releases as the only changelog |
| Hosting | Vercel |

## Commands

```bash
bun install
bun run dev
bun run build
bun run start
bun run lint
bun run typecheck
```

Bun is the package manager and task runner. Node runs the build — forcing the Bun runtime for `next build` crashes on teardown, so the scripts deliberately do not.

## URLs

The default locale carries no prefix:

```
/                 English
/pt               Portuguese
/en               redirects to /
```

Each page therefore has exactly one address per language, which is what lets both be indexed and shared.

## Making it yours

Three places, in the order you will need them:

| What | Where |
|---|---|
| Repository, deployed URL, social links, locales | `src/config/site.ts` |
| Your writing | `src/content/` — see [`docs/CONTENT.md`](docs/CONTENT.md) |
| Interface strings | `src/i18n/dictionaries.ts` |
| Colours and type | `src/app/globals.css` |

Nothing in the template names *you*. The placeholders are in `src/config/site.ts` and in the sample project's repository URL, and `grep -ri "your-username" src/` finds both.

English defines the key set in the dictionary, so a locale missing a key fails the type check rather than rendering a blank space. The same is true of content: a case study without a translation does not build.

Adding a locale is one line in `site.ts`, and then every existing case must be translated before the project compiles again. That is deliberate — see [`docs/CONTENT.md`](docs/CONTENT.md#adding-a-locale).

## Repository settings

Two things live in GitHub rather than in a file, and the release workflow does not work without them:

- **Settings → Actions → General → Workflow permissions**: *Read and write*, and *Allow GitHub Actions to create and approve pull requests*. Without it the workflow fails with `GitHub Actions is not permitted to create or approve pull requests`, which reads like a broken workflow and is not one.
- **Settings → General → Pull Requests**: squash merge. Release notes come from commit subjects, and a merge commit adds the pull request title a second time.

## Gotchas

**Do not force the Bun runtime.** Neither `bun --bun next build` nor `[run] bun = true` in `bunfig.toml` — they are the same thing, and both segfault on teardown *after* the build has already succeeded, which looks like a build failure and is not. Bun is the package manager and task runner; Node runs the build.

**The build needs network access.** `next/font/google` downloads IBM Plex during `next build`, so a connectivity hiccup fails the build with module-not-found errors about generated CSS — which does not look like a network problem at all.

**`typecheck` does three things**: generates Next's route types, runs `tsc`, then checks that every piece of content exists in every locale. Running `tsc` alone will fail on a clean clone, because the route type globals do not exist yet.

**Privacy.** The [privacy page](src/content/privacy.en.mdx) describes what *this* template stores: one cookie for the language, one `localStorage` entry for the theme, both written only when a reader chooses. Add analytics to a fork and that page becomes wrong — and you probably need a consent banner, which this template deliberately does not have.

## Branches

- `main` — the template. No personal content.
- `site` — your content, and the production branch on Vercel.

Merges go **`main → site`**, never the other way. A template bug found while writing content is committed on `main` and comes down through the sync.

`main` owns shape: `src/app/`, `src/components/`, `src/lib/`, `src/i18n/`, `src/config/types.ts`.
`site` owns data: `src/content/`, the values in `src/config/site.ts`, `public/brand/`.

The `Sync site` workflow merges `main` into `site` on every push to `main`. It does nothing if there is no `site` branch, so the second branch is optional.

## Documentation

| | |
|---|---|
| [`docs/CONTENT.md`](docs/CONTENT.md) | writing case studies and pages |
| [`docs/RELEASING.md`](docs/RELEASING.md) | how versions are cut |

Scope and decisions live in the repository's issues rather than in a `specs/`
folder — including the reasoning behind most of what is in here.

## License

MIT — see [LICENSE](LICENSE).
