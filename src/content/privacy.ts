import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";
import PrivacyEn from "./privacy.en.mdx";
import PrivacyPt from "./privacy.pt.mdx";

/** Same guarantee as the cases: a missing locale is a type error. */
export const privacy: Record<Locale, ComponentType> = {
  en: PrivacyEn,
  pt: PrivacyPt,
};
