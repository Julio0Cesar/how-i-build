import type { MDXComponents } from "mdx/types";
import { Anchor } from "@/components/mdx/anchor";
import { Decision, Tradeoffs } from "@/components/mdx/callout";
import { Entry } from "@/components/mdx/entry";
import { prose } from "@/components/mdx/prose";

/**
 * Required by `@next/mdx` and kept as wiring only. The components themselves
 * live in `src/components/mdx/`, so adding one does not grow this file.
 */
const components: MDXComponents = {
  ...prose,
  a: Anchor,
  Entry,
  Decision,
  Tradeoffs,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
