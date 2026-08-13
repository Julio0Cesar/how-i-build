import Link from "next/link";
import type { ReactNode } from "react";
import { localeHref } from "@/i18n/config";
import { currentLocale } from "./locale";

const linkClass =
  "cursor-pointer border-b border-rule transition-colors hover:border-accent hover:text-accent";

/**
 * Content writes `/projects/foo` and never `/pt/projects/foo`; the locale is
 * added here. Same rule the typed renderer had — it survived the move to MDX.
 */
export async function Anchor({
  href = "",
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (href.startsWith("/")) {
    const locale = await currentLocale();
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
