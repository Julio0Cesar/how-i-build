"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { localeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { SearchEntry } from "@/lib/search";
import { IconButton } from "./ui/icon-button";
import { SiteSearch } from "./site-search";
import { LocaleSwitch } from "./locale-switch";
import { ThemeSelect } from "./theme-select";

const routes = [
  { key: "home" as const, path: "/" },
  { key: "blog" as const, path: "/blog" },
  { key: "changelog" as const, path: "/changelog" },
  { key: "about" as const, path: "/about" },
  { key: "privacy" as const, path: "/privacy" },
];

export function SiteHeaderNav({
  locale,
  dict,
  searchIndex,
}: {
  locale: Locale;
  dict: Dictionary;
  searchIndex: SearchEntry[];
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
      className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
    >
      {dict.nav[route.key]}
    </Link>
  ));

  return (
    <>
      <nav className="hidden items-center gap-5 md:flex" aria-label={dict.nav.menu}>
        {links}
        <SiteSearch index={searchIndex} labels={dict.search} />
        <LocaleSwitch locale={locale} labels={dict.locale} />
        <ThemeSelect labels={dict.theme} />
      </nav>

      <IconButton
        label={open ? dict.nav.close : dict.nav.open}
        className="md:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X className="size-4" aria-hidden="true" />
        ) : (
          <Menu className="size-4" aria-hidden="true" />
        )}
      </IconButton>

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
              {/* Closing the panel first: the search overlay covers it, and
                  leaving it open behind means dismissing two things. */}
              <SiteSearch
                index={searchIndex}
                labels={dict.search}
                onOpen={() => setOpen(false)}
              />
              <LocaleSwitch locale={locale} labels={dict.locale} />
              <ThemeSelect labels={dict.theme} />
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
