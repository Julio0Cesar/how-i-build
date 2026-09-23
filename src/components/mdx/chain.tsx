import type { ReactNode } from "react";

/**
 * Um encadeamento técnico como sequência numerada, e não como parágrafo.
 *
 * Cada elo traz o número, o nome em monoespaçada e o que ele faz. A régua entre
 * os elos carrega a ordem; seta desenhada seria enfeite, porque a ordem já está
 * no número. O contador é do CSS, então inserir um elo no meio não obriga a
 * renumerar o texto.
 */
export function Chain({ children }: { children?: ReactNode }) {
  return (
    <ol className="mt-6 max-w-[84ch] list-none border-y border-rule [counter-reset:chain]">
      {children}
    </ol>
  );
}

export function Step({ name, children }: { name: string; children?: ReactNode }) {
  return (
    <li className="grid grid-cols-[2rem_minmax(0,9rem)_1fr] items-baseline gap-x-4 border-b border-rule py-3 last:border-b-0 [counter-increment:chain] before:font-mono before:text-xs before:text-muted-foreground before:content-[counter(chain)]">
      <span className="font-mono text-sm">{name}</span>
      <span className="text-[0.95rem] leading-relaxed text-muted-foreground">{children}</span>
    </li>
  );
}
