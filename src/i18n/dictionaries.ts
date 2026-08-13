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
    group: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  social: {
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
  },
  home: {
    profile: "Profile",
    projects: "Projects",
  },
  footer: {
    /** Labelled as the template's version, not a count of content updates. */
    template: "Template",
    updated: "Updated",
  },
  status: {
    "in-dev": "In development",
    prod: "Live",
    archived: "Archived",
  },
  visibility: {
    public: "Public",
    private: "Private",
  },
  project: {
    pending: "Write-up pending",
  },
  case: {
    toc: "On this page",
    problem: "Problem",
    decisions: "Decisions",
    challenges: "Challenges",
    outcome: "Outcome",
    references: "References",
    updated: "Updated",
    context: "Context",
    decision: "Decision",
    tradeoffs: "Trade-offs",
    live: "Live",
    repository: "Repository",
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
    group: "Tema",
    light: "Claro",
    dark: "Escuro",
    system: "Sistema",
  },
  social: {
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "E-mail",
  },
  home: {
    profile: "Perfil",
    projects: "Projetos",
  },
  footer: {
    template: "Template",
    updated: "Atualizado em",
  },
  status: {
    "in-dev": "Em desenvolvimento",
    prod: "No ar",
    archived: "Arquivado",
  },
  visibility: {
    public: "Público",
    private: "Privado",
  },
  project: {
    pending: "Registro pendente",
  },
  case: {
    toc: "Nesta página",
    problem: "Problema",
    decisions: "Decisões",
    challenges: "Desafios",
    outcome: "Resultado",
    references: "Referências",
    updated: "Atualizado",
    context: "Contexto",
    decision: "Decisão",
    tradeoffs: "Trade-offs",
    live: "No ar",
    repository: "Repositório",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, pt };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
