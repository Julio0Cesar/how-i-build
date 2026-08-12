"use client";

import { usePathname } from "next/navigation";
import { localeHref, locales, stripLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function LocaleSwitch({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Dictionary["locale"];
}) {
  /**
   * The current path has to be stripped before it can be rebuilt in another
   * locale. Swapping the first segment would work only if every locale carried
   * a prefix; the default one does not, so `/projects` would become `/pt` and
   * lose the page.
   */
  const path = stripLocale(usePathname() ?? "/");

  return (
    <div
      role="group"
      aria-label={labels.group}
      className="flex items-center gap-1 border border-rule px-1 py-0.5"
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          /**
           * A plain anchor, not <Link>: switching locale changes a root
           * parameter, so a client navigation re-renders the root layout — and
           * React refuses to run the theme <script> during a client render,
           * warning about it in development. A document navigation also lets
           * the server read the cookie written just below on the next request.
           */
          <a
            key={code}
            href={localeHref(code, path)}
            hrefLang={code}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              // The proxy only reads this cookie. Choosing here is the one
              // moment a reader actually states a preference.
              document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000;samesite=lax`;
            }}
            className={
              active
                ? "bg-accent-soft px-2 py-0.5 font-mono text-xs uppercase tracking-widest text-accent"
                : "px-2 py-0.5 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
            }
          >
            {labels[code]}
          </a>
        );
      })}
    </div>
  );
}
