/**
 * `@types/mdx` declares `*.mdx` with only a default export; each file also
 * exports its own metadata.
 *
 * Typed `unknown` on purpose. `tsc` does not parse `.mdx`, so declaring a shape
 * here would assert it rather than check it — a file missing a required field
 * would compile and render `undefined`. The shape is enforced at module load by
 * the validators in `content/validate.ts`, which run during the build.
 *
 * It also lets posts and cases carry different metadata, which a single
 * declared type could not.
 */
declare module "*.mdx" {
  export const meta: unknown;
}
