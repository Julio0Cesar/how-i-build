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
import { searchIndex } from "@/lib/search";
import {
  getLatestRelease,
  releaseMonth,
  repoUrl,
} from "@/lib/integrations";
import packageJson from "../../package.json";
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
        <SiteHeaderNav locale={locale} dict={dict} searchIndex={searchIndex(locale)} />
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const locale = await currentLocale();
  const dict = getDictionary(locale);
  const release = await getLatestRelease();
  /** package.json is bumped by the same release, so it is a truthful fallback. */
  const version = release?.version ?? packageJson.version;
  const month = releaseMonth(release?.publishedAt ?? null, locale);

  return (
    <footer className="mt-16 border-t border-rule md:mt-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-8 text-center sm:px-6 md:flex-row md:items-baseline md:justify-between md:py-10 md:text-left">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {site.name}
          <span className="mx-2 text-rule" aria-hidden="true">
            ·
          </span>
          <a
            href={release?.url ?? `${repoUrl()}/releases`}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-accent"
          >
            {dict.footer.template} v{version}
          </a>
          {month ? (
            <>
              <span className="mx-2 text-rule" aria-hidden="true">
                ·
              </span>
              {dict.footer.updated} {month}
            </>
          ) : null}
        </p>
        <SocialLinks dict={dict} />
      </div>
    </footer>
  );
}
