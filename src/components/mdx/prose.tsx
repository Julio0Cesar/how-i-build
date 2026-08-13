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
  code: ({ children }: { children?: ReactNode }) => (
    <code className="bg-muted px-1 py-0.5 font-mono text-[0.9em]">{children}</code>
  ),
};
