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
];
