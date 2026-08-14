import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";
import AboutEn from "./about.en.mdx";
import AboutPt from "./about.pt.mdx";

export const about: Record<Locale, ComponentType> = {
  en: AboutEn,
  pt: AboutPt,
};
