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
/**
 * Inverse of `localeHref`: takes a path and returns it without any locale
 * segment. A path cannot be translated by swapping its first segment, because
 * the default locale has none.
 *
 * The default prefix is stripped too. `usePathname()` reports the rewritten
 * path, so a reader sitting on `/` is seen as `/en` — without this, the switch
 * would build `/pt/en`.
 */
export function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }
  return pathname;
}

export function localeHref(locale: Locale, path: string): string {
  const suffix = path === "/" ? "" : path;
  if (locale === defaultLocale) return suffix || "/";
  return `/${locale}${suffix}`;
}
