import HowIBuildEn, { meta as howIBuildEn } from "./projects/how-i-build.en.mdx";
import HowIBuildPt, { meta as howIBuildPt } from "./projects/how-i-build.pt.mdx";
import LyricsLensEn, { meta as lyricsLensEn } from "./projects/lyricslens.en.mdx";
import LyricsLensPt, { meta as lyricsLensPt } from "./projects/lyricslens.pt.mdx";
import type { Project } from "./types";
import { caseMeta } from "./validate";

export const projects: Project[] = [
  {
    slug: "how-i-build",
    status: "prod",
    visibility: "public",
    stack: ["Next.js", "TypeScript", "Bun"],
    markUrl: "/icon.svg",
    liveUrl: "https://how-i-build-delta.vercel.app",
    repoUrl: "https://github.com/Julio0Cesar/how-i-build",
    cases: {
      en: {
        meta: caseMeta(howIBuildEn, "projects/how-i-build.en.mdx"),
        Body: HowIBuildEn,
      },
      pt: {
        meta: caseMeta(howIBuildPt, "projects/how-i-build.pt.mdx"),
        Body: HowIBuildPt,
      },
    },
  },
  {
    slug: "lyricslens",
    status: "prod",
    visibility: "public",
    stack: ["Rust"],
    markUrl: "/brand/lyricslens.svg",
    repoUrl: "https://github.com/Julio0Cesar/lyricslens",
    cases: {
      en: {
        meta: caseMeta(lyricsLensEn, "projects/lyricslens.en.mdx"),
        Body: LyricsLensEn,
      },
      pt: {
        meta: caseMeta(lyricsLensPt, "projects/lyricslens.pt.mdx"),
        Body: LyricsLensPt,
      },
    },
  },
];
