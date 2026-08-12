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

Everything that names you lives in `src/config/site.ts`: repository, deployed URL, social links, locales. No other file in the template refers to an owner, a repo or a handle.

Chrome strings are in `src/i18n/dictionaries.ts`. English defines the key set, so a locale missing a key fails the type check rather than rendering a blank.

## Branches

- `main` — the template. No personal content.
- `site` — your content, and the production branch on Vercel.

Merges go **`main → site`**, never the other way. A template bug found while writing content is committed on `main` and comes down through the sync.

`main` owns shape: `src/app/`, `src/components/`, `src/lib/`, `src/i18n/`, `src/config/types.ts`.
`site` owns data: `src/content/`, the values in `src/config/site.ts`, `public/brand/`.

The `Sync site` workflow merges `main` into `site` whenever a release is published. It does nothing if there is no `site` branch, so the second branch is optional.

## Releasing

Versions are cut by release-please from Conventional Commits. See [`docs/RELEASING.md`](docs/RELEASING.md).

## License

MIT — see [LICENSE](LICENSE).
