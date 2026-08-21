import HelloEn, { meta as helloEn } from "./posts/hello-world.en.mdx";
import HelloPt, { meta as helloPt } from "./posts/hello-world.pt.mdx";
import InstallingRustEn, { meta as installingRustEn } from "./posts/installing-rust.en.mdx";
import InstallingRustPt, { meta as installingRustPt } from "./posts/installing-rust.pt.mdx";
import type { Post } from "./types";
import { postMeta, tagAlignment } from "./validate";

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
    slug: "installing-rust",
    locales: {
      en: {
        meta: postMeta(installingRustEn, "posts/installing-rust.en.mdx"),
        Body: InstallingRustEn,
      },
      pt: {
        meta: postMeta(installingRustPt, "posts/installing-rust.pt.mdx"),
        Body: InstallingRustPt,
      },
    },
  },
];

tagAlignment(posts);
