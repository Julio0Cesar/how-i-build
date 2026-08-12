# Releasing

Versions are cut by [release-please](https://github.com/googleapis/release-please) from the commit history. Nobody edits `version` in `package.json` by hand.

## The flow

Releasing takes two merges, not one:

```
PR merged into main
  → release-please opens or updates a Release PR
  → that PR accumulates every releasable commit and proposes the next version
  → you merge the Release PR
  → tag vX.Y.Z + GitHub Release
```

The gap between the two is deliberate. Several features can land on `main` and go out as a single version, and the proposed number is visible before it becomes a tag.

## What decides the version

Conventional Commits, read from the subject line:

| Commit | Bump |
|---|---|
| `feat:` | minor |
| `fix:` / `perf:` | patch |
| any type with `!`, or `BREAKING CHANGE:` in the body | major |
| `chore:` / `docs:` / `ci:` / `refactor:` / `style:` / `test:` / `build:` | none |

A batch of commits takes the highest bump among them. If nothing releasable landed, no Release PR appears — that is the expected state, not a failure.

## There is no CHANGELOG.md

`skip-changelog` is on. The release notes live in the GitHub Release, generated from the commits, and that is the only record. The site reads them through the GitHub API for the footer version and the `/changelog` page, so the Release body is not decoration — it is the content of a page.

Two consequences worth knowing:

- The Release PR diff is nearly empty. It bumps `version` in `package.json` and the entry in `.release-please-manifest.json`, and nothing else. To see what is going into the version, read the PR description, not the diff.
- Commit subjects are published. They are what the notes are built from, so they are read by people who will never open the repository.

## Releases are cut from `main` only

`site` never publishes its own releases. It inherits tags when `main` is merged into it.

This means the version in the site footer is the **template** version, not a count of content updates. Writing three case studies on `site` does not move it. That is intentional — the number tracks the thing the template promises to keep stable — but the UI has to label it so nobody reads it as "the site changed three times".

## Files

| File | Role |
|---|---|
| `release-please-config.json` | strategy (`node`), `skip-changelog` |
| `.release-please-manifest.json` | the current version — the source of truth |
| `.github/workflows/release.yml` | runs the action on every push to `main` |

`.release-please-manifest.json` is what release-please reads to know where the project is. It is maintained by the tool; editing it by hand is how you would force a version, and also how you would break the sequence.

## Forcing a version

Add `Release-As: 1.2.3` to a commit body on `main`. The next Release PR proposes that version regardless of what the commits imply. Use it for the 1.0.0 cut, which is a decision about the public API contract rather than something the commit types can infer.
