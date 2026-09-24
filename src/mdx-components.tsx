import type { MDXComponents } from "mdx/types";
import { Anchor } from "@/components/mdx/anchor";
import { Decision, Tradeoffs } from "@/components/mdx/callout";
import { Chain, Step } from "@/components/mdx/chain";
import { Entry } from "@/components/mdx/entry";
import { Experiment, Hypothesis, Observation } from "@/components/mdx/investigation";
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
  /* A `<video>` written as JSX in a file is not routed through the `video`
     entry above; the named form is. */
  Img,
  Video,
  Entry,
  Decision,
  Tradeoffs,
  Observation,
  Hypothesis,
  Experiment,
  Chain,
  Step,
  Release,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
