import type { Locale } from "./config";

/**
 * English is the source of the key set: `Dictionary` is derived from it, so a
 * missing or misspelled key in another locale is a compile error rather than a
 * blank space on the page.
 *
 * Chrome strings only. Project copy lives in `src/content`.
 */
const en = {
  nav: {
    home: "Index",
    menu: "Site",
    open: "Open menu",
    close: "Close menu",
  },
  locale: {
    group: "Language",
    en: "EN",
    pt: "PT",
  },
  theme: {
    toDark: "Dark",
    toLight: "Light",
  },
  social: {
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
  },
};

export type Dictionary = typeof en;

const pt: Dictionary = {
  nav: {
    home: "Início",
    menu: "Site",
    open: "Abrir menu",
    close: "Fechar menu",
  },
  locale: {
    group: "Idioma",
    en: "EN",
    pt: "PT",
  },
  theme: {
    toDark: "Escuro",
    toLight: "Claro",
  },
  social: {
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "E-mail",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, pt };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
