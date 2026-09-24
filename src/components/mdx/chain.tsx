import type { ReactNode } from "react";

/**
 * A technical chain as a numbered sequence rather than a paragraph.
 *
 * Each link carries its number, its name in mono, and what it does. The rule
 * between links carries the order; a drawn arrow would be ornament, because the
 * number already says it. The counter is CSS, so inserting a link in the middle
 * does not force the text to be renumbered.
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
