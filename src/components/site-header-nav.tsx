"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { localeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LocaleSwitch } from "./locale-switch";
import { ThemeToggle } from "./theme-toggle";

/**
 * Only routes that exist. #14 appends the changelog when there is one to link
 * to — a header that 404s is worse than a header with one entry.
 */
const routes = [{ key: "home" as const, path: "/" }];

export function SiteHeaderNav({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const links = routes.map((route) => (
    <Link
      key={route.key}
      href={localeHref(locale, route.path)}
      onClick={() => setOpen(false)}
      className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
    >
      {dict.nav[route.key]}
    </Link>
  ));

  return (
    <>
      <nav className="hidden items-center gap-5 md:flex" aria-label={dict.nav.menu}>
        {links}
        <LocaleSwitch locale={locale} labels={dict.locale} />
        <ThemeToggle labels={dict.theme} />
      </nav>

      <button
        type="button"
        className="inline-flex size-10 items-center justify-center border border-rule transition-colors hover:border-accent hover:text-accent md:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? dict.nav.close : dict.nav.open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X className="size-4" aria-hidden="true" />
        ) : (
          <Menu className="size-4" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full z-40 border-b border-rule bg-background md:hidden"
        >
          <nav
            className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5 sm:px-6"
            aria-label={dict.nav.menu}
          >
            {links}
            <div className="flex flex-wrap items-center gap-3 border-t border-rule pt-4">
              <LocaleSwitch locale={locale} labels={dict.locale} />
              <ThemeToggle labels={dict.theme} />
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
