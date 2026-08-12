import { site } from "@/config/site";

export const locales = site.locales;

export type Locale = (typeof locales)[number];

/**
 * Annotated on purpose: if `site.defaultLocale` is ever set to something that
 * is not in `site.locales`, this line stops compiling.
 */
export const defaultLocale: Locale = site.defaultLocale;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * The default locale is never in the URL; every other locale carries its
 * segment. `/projects` is English, `/pt/projects` is Portuguese.
 */
export function localeHref(locale: Locale, path: string): string {
  const suffix = path === "/" ? "" : path;
  if (locale === defaultLocale) return suffix || "/";
  return `/${locale}${suffix}`;
}
