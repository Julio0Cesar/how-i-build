import { paragraph, plain, type Profile } from "./types";

/**
 * Placeholder on purpose. Identity is the one thing a fork must not inherit by
 * accident, so this reads as unfinished until it is replaced.
 */
export const profile: Profile = {
  name: "Your name",
  location: {
    en: "Your city",
    pt: "Sua cidade",
  },
  role: {
    en: "What you do, in one line",
    pt: "O que você faz, em uma linha",
  },
  intro: {
    en: [
      paragraph(
        plain(
          "Replace this with a paragraph about what you build and why you write it down. Two or three sentences is enough.",
        ),
      ),
      paragraph(
        plain(
          "A second paragraph can say what this site is not — not a tutorial, not a wiki — so a reader knows what to expect before clicking into a project.",
        ),
      ),
    ],
    pt: [
      paragraph(
        plain(
          "Troque isto por um parágrafo sobre o que você constrói e por que registra. Duas ou três frases bastam.",
        ),
      ),
      paragraph(
        plain(
          "Um segundo parágrafo pode dizer o que este site não é — nem tutorial, nem wiki — para o leitor saber o que esperar antes de abrir um projeto.",
        ),
      ),
    ],
  },
};
