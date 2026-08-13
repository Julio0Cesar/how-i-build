import IntroEn from "./profile.en.mdx";
import IntroPt from "./profile.pt.mdx";
import type { Profile } from "./types";

export const profile: Profile = {
  name: "Júlio César",
  location: { en: "Brazil", pt: "Brasil" },
  role: {
    en: "Software engineer — end-to-end products and architecture decisions",
    pt: "Engenheiro de software — produtos ponta a ponta e decisões de arquitetura",
  },
  intro: { en: IntroEn, pt: IntroPt },
};
