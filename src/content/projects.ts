import HowIBuildEn, { meta as howIBuildEn } from "./projects/how-i-build.en.mdx";
import HowIBuildPt, { meta as howIBuildPt } from "./projects/how-i-build.pt.mdx";
import type { Project } from "./types";
import { caseMeta } from "./validate";

export const projects: Project[] = [
  {
    slug: "how-i-build",
    status: "prod",
    visibility: "public",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Bun"],
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
];
