import Link from "next/link";
import { locale as rootLocale } from "next/root-params";
import { site } from "@/config/site";
import {
  defaultLocale,
  isLocale,
  localeHref,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeaderNav } from "./site-header-nav";
import { SocialLinks } from "./social-links";

/**
 * `[locale]` sits before the root layout, which makes it a root parameter: any
 * Server Component can read it without the layout threading it down as a prop.
 */
async function currentLocale(): Promise<Locale> {
  const value = await rootLocale();
  return value && isLocale(value) ? value : defaultLocale;
}

export async function SiteHeader() {
  const locale = await currentLocale();
  const dict = getDictionary(locale);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href={localeHref(locale, "/")}
          className="flex min-w-0 max-w-[70%] items-center gap-2 font-mono text-sm font-medium tracking-tight"
        >
          <span className="h-3 w-1 shrink-0 bg-accent" aria-hidden="true" />
          <span className="truncate">{site.name}</span>
        </Link>
        <SiteHeaderNav locale={locale} dict={dict} />
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const locale = await currentLocale();
  const dict = getDictionary(locale);

  return (
    <footer className="mt-16 border-t border-rule md:mt-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-8 text-center sm:px-6 md:flex-row md:items-baseline md:justify-between md:py-10 md:text-left">
        {/* Version and last-updated land here in #13. */}
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {site.name}
        </p>
        <SocialLinks dict={dict} />
      </div>
    </footer>
  );
}
