import IntroEn from "./profile.en.mdx";
import IntroPt from "./profile.pt.mdx";
import type { Profile } from "./types";

/**
 * Placeholder on purpose. Identity is the one thing a fork must not inherit by
 * accident, so this reads as unfinished until it is replaced.
 */
export const profile: Profile = {
  name: "Your name",
  location: { en: "Your city", pt: "Sua cidade" },
  role: {
    en: "What you do, in one line",
    pt: "O que você faz, em uma linha",
  },
  intro: { en: IntroEn, pt: IntroPt },
};
