import HowIBuildEn, { meta as howIBuildEn } from "./projects/how-i-build.en.mdx";
import HowIBuildPt, { meta as howIBuildPt } from "./projects/how-i-build.pt.mdx";
import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "how-i-build",
    status: "prod",
    visibility: "public",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Bun"],
    liveUrl: "https://how-i-build-delta.vercel.app",
    repoUrl: "https://github.com/Julio0Cesar/how-i-build",
    cases: {
      en: { meta: howIBuildEn, Body: HowIBuildEn },
      pt: { meta: howIBuildPt, Body: HowIBuildPt },
    },
  },
];
