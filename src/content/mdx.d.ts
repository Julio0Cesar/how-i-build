/**
 * `@types/mdx` declares `*.mdx` with only a default export. Each case exports
 * its own metadata as typed JavaScript — `@next/mdx` does not support
 * frontmatter, and this is better, because TypeScript checks it.
 */
declare module "*.mdx" {
  import type { CaseMeta } from "@/content/types";
  export const meta: CaseMeta;
}
