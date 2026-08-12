import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import Link from "next/link";
import { locale as rootLocale } from "next/root-params";
import { defaultLocale, isLocale, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const meta = "font-mono text-xs uppercase tracking-widest text-muted-foreground";
const linkClass =
  "cursor-pointer border-b border-rule transition-colors hover:border-accent hover:text-accent";

async function currentDict() {
  const value = await rootLocale();
  return getDictionary(value && isLocale(value) ? value : defaultLocale);
}

/**
 * Content writes `/projects/foo` and never `/pt/projects/foo`; the locale is
 * added here. Same rule the typed renderer had — it survived the move to MDX.
 */
async function Anchor({
  href = "",
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (href.startsWith("/")) {
    const value = await rootLocale();
    const locale = value && isLocale(value) ? value : defaultLocale;
    return (
      <Link href={localeHref(locale, href)} className={linkClass}>
        {children}
      </Link>
    );
  }

  const web = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      target={web ? "_blank" : undefined}
      rel={web ? "noreferrer noopener" : undefined}
      className={linkClass}
    >
      {children}
    </a>
  );
}

/** An entry: everything under a `##` until the next one. */
function Heading2({ children, ...props }: { children?: ReactNode; id?: string }) {
  return (
    <h2
      {...props}
      className="mt-14 scroll-mt-24 border-t border-rule pt-10 font-serif text-xl tracking-tight first:mt-0 first:border-t-0 first:pt-0"
    >
      {children}
    </h2>
  );
}

/** Opt-in structure. Use it where the call deserves its own weight. */
async function Decision({ children }: { children?: ReactNode }) {
  const dict = await currentDict();
  return (
    <div className="mt-6 border-l-2 border-accent pl-5">
      <p className={meta}>{dict.case.decision}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

async function Tradeoffs({ children }: { children?: ReactNode }) {
  const dict = await currentDict();
  return (
    <div className="mt-6">
      <p className={meta}>{dict.case.tradeoffs}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const components: MDXComponents = {
  h2: Heading2,
  h3: ({ children, ...props }) => (
    <h3 {...props} className="mt-8 scroll-mt-24 font-serif text-lg tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-5 max-w-[68ch] leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 max-w-[68ch] list-disc space-y-2 pl-5 leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 max-w-[68ch] list-decimal space-y-2 pl-5 leading-relaxed">
      {children}
    </ol>
  ),
  code: ({ children }) => (
    <code className="bg-muted px-1 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  ),
  a: Anchor,
  Decision,
  Tradeoffs,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
