import type { ReactNode } from "react";

/**
 * Elementos de markdown na tipografia do site.
 *
 * Text lives at 68 characters, which is the reading measure. A technical block
 * — code, a table — breathes up to 84: it is the one that has to fit without
 * wrapping when the subject is a chain of commands.
 */
const read = "max-w-none";
const wide = "max-w-full";
export const prose = {
  h2: ({ children, ...props }: { children?: ReactNode; id?: string }) => (
    <h2
      {...props}
      className="mt-16 scroll-mt-28 font-sans text-[1.75rem] font-bold leading-[1.15] tracking-[-0.022em] first:mt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: { children?: ReactNode; id?: string }) => (
    <h3 {...props} className="mt-10 scroll-mt-28 font-sans text-xl font-semibold tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className={`mt-5 ${read} leading-[1.7]`}>{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className={`mt-5 ${read} list-disc space-y-2 pl-5 leading-relaxed`}>
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className={`mt-5 ${read} list-decimal space-y-2 pl-5 leading-relaxed`}>
      {children}
    </ol>
  ),
  /**
   * A fenced block arrives as `code` inside `pre` and carries a `language-*`
   * class. Styling it like inline code would stack a second background and a
   * second padding inside the block, so the fenced case renders bare and lets
   * the `pre` above own the frame.
   */
  code: ({ children, className }: { children?: ReactNode; className?: string }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="bg-muted px-1 py-0.5 font-mono text-[0.82em] [font-stretch:87.5%]">{children}</code>
    ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className={`mt-8 ${wide} overflow-x-auto border border-foreground bg-[oklch(0.21_0.02_255)] p-5 font-mono text-[0.8rem] leading-relaxed text-[oklch(0.93_0.008_230)] [font-stretch:87.5%] dark:border-rule dark:bg-[oklch(0.16_0.018_255)]`}>
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className={`mt-10 ${read} text-2xl italic leading-snug border-l border-foreground pl-5 [&_p]:mt-0`}>
      {children}
    </blockquote>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-foreground [&_code]:bg-transparent">{children}</strong>
  ),
  hr: () => <hr className={`mt-10 ${wide} border-t border-rule`} />,
  table: ({ children }: { children?: ReactNode }) => (
    /* The wrapper scrolls on mobile; the table alone would push the whole page. */
    <div className={`mt-6 ${wide} overflow-x-auto`}>
      <table className="w-full border-collapse font-sans text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="border-b border-rule px-3 py-2 text-left data text-xs font-normal text-muted-foreground">
      {children}
    </th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="border-b border-rule px-3 py-2 align-top leading-relaxed">{children}</td>
  ),
};
