import type { ReactNode } from "react";

/** Markdown elements, given the site's typography. */
export const prose = {
  h2: ({ children, ...props }: { children?: ReactNode; id?: string }) => (
    <h2
      {...props}
      className="mt-14 scroll-mt-24 border-t border-rule pt-10 font-serif text-xl tracking-tight first:mt-0 first:border-t-0 first:pt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: { children?: ReactNode; id?: string }) => (
    <h3 {...props} className="mt-8 scroll-mt-24 font-serif text-lg tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mt-5 max-w-[68ch] leading-relaxed">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mt-5 max-w-[68ch] list-disc space-y-2 pl-5 leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mt-5 max-w-[68ch] list-decimal space-y-2 pl-5 leading-relaxed">
      {children}
    </ol>
  ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="mt-5 max-w-[68ch] overflow-x-auto border border-rule bg-muted p-4 font-mono text-[0.85em] leading-relaxed">
      {children}
    </pre>
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
      <code className="bg-muted px-1 py-0.5 font-mono text-[0.9em]">{children}</code>
    ),
};
