import WorkspaceEn, { meta as workspaceEn } from "./posts/placeholder-workspace.en.mdx";
import WorkspacePt, { meta as workspacePt } from "./posts/placeholder-workspace.pt.mdx";
import CircuitEn, { meta as circuitEn } from "./posts/placeholder-circuit.en.mdx";
import CircuitPt, { meta as circuitPt } from "./posts/placeholder-circuit.pt.mdx";
import RepeatEn, { meta as repeatEn } from "./posts/placeholder-repeat.en.mdx";
import RepeatPt, { meta as repeatPt } from "./posts/placeholder-repeat.pt.mdx";
import HelloEn, { meta as helloEn } from "./posts/hello-world.en.mdx";
import HelloPt, { meta as helloPt } from "./posts/hello-world.pt.mdx";
import type { Post } from "./types";
import { postMeta } from "./validate";

/**
 * Static imports, like the case studies: a missing file fails the build here,
 * and `Record<Locale, PostContent>` fails the type check if a locale is left
 * out. `postMeta` checks the shape of what each file exports, which `tsc`
 * cannot do — it does not read `.mdx`.
 */
export const posts: Post[] = [
  {
    slug: "hello-world",
    locales: {
      en: {
        meta: postMeta(helloEn, "posts/hello-world.en.mdx"),
        Body: HelloEn,
      },
      pt: {
        meta: postMeta(helloPt, "posts/hello-world.pt.mdx"),
        Body: HelloPt,
      },
    },
  },
  {
    slug: "placeholder-workspace",
    locales: {
      en: {
        meta: postMeta(workspaceEn, "posts/placeholder-workspace.en.mdx"),
        Body: WorkspaceEn,
      },
      pt: {
        meta: postMeta(workspacePt, "posts/placeholder-workspace.pt.mdx"),
        Body: WorkspacePt,
      },
    },
  },
  {
    slug: "placeholder-circuit",
    locales: {
      en: {
        meta: postMeta(circuitEn, "posts/placeholder-circuit.en.mdx"),
        Body: CircuitEn,
      },
      pt: {
        meta: postMeta(circuitPt, "posts/placeholder-circuit.pt.mdx"),
        Body: CircuitPt,
      },
    },
  },
  {
    slug: "placeholder-repeat",
    locales: {
      en: {
        meta: postMeta(repeatEn, "posts/placeholder-repeat.en.mdx"),
        Body: RepeatEn,
      },
      pt: {
        meta: postMeta(repeatPt, "posts/placeholder-repeat.pt.mdx"),
        Body: RepeatPt,
      },
    },
  },
];
