import type { MDXComponents } from "mdx/types";
import { Anchor } from "@/components/mdx/anchor";
import { Decision, Tradeoffs } from "@/components/mdx/callout";
import { Entry } from "@/components/mdx/entry";
import { Img, Video } from "@/components/mdx/media";
import { prose } from "@/components/mdx/prose";
import { Release } from "@/components/mdx/release";

/**
 * Required by `@next/mdx` and kept as wiring only. The components themselves
 * live in `src/components/mdx/`, so adding one does not grow this file.
 */
const components: MDXComponents = {
  ...prose,
  a: Anchor,
  img: Img,
  video: Video,
  Entry,
  Decision,
  Tradeoffs,
  Release,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
