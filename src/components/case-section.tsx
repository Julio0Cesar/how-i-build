import type { ReactNode } from "react";

/**
 * `scroll-mt-24` is the price of the fixed header decided in #7: without it,
 * following a table-of-contents link parks the heading underneath the bar.
 */
export function CaseSection({
  id,
  label,
  updatedAt,
  updatedLabel,
  children,
}: {
  id: string;
  label: string;
  updatedAt?: string;
  updatedLabel: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="grid scroll-mt-24 gap-5 border-t border-rule py-10 md:grid-cols-[8rem_1fr] md:gap-10 md:py-12"
    >
      <div className="md:pt-2">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </h2>
        {updatedAt ? (
          <time
            dateTime={updatedAt}
            className="mt-2 block font-mono text-[0.65rem] text-muted-foreground"
          >
            {updatedLabel} {updatedAt}
          </time>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
