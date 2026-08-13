import { site } from "./site";
import type { SiteConfig } from "./types";

/**
 * `site` is declared with `as const satisfies`, so its type is the literal
 * object — precise, and blind to optional fields the config leaves out. Reading
 * `site.icons` directly does not compile in the template, where there are none.
 *
 * Widening to `SiteConfig` once, here, keeps the literal types everywhere else
 * — `locales` and `defaultLocale` still narrow the way #5 depends on.
 */
const icons = (site as SiteConfig).icons;

export const stackIcons = icons?.stack ?? {};
export const monochromeIcons = new Set(icons?.monochrome ?? []);
export const socialIcons = icons?.social ?? {};
