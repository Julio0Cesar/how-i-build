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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href={localeHref(locale, "/")}
          className="flex min-w-0 max-w-[70%] items-center gap-2.5 text-lg font-bold tracking-tight [font-stretch:85%]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- the site mark is a local SVG */}
          <img src="/icon.svg" alt="" aria-hidden="true" className="size-7 shrink-0" />
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
    <footer className="border-t border-foreground bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p className="data text-xs text-muted-foreground">
          {site.name}
          <span className="mx-2 text-rule" aria-hidden="true">
            ·
          </span>
          <a
            href={release?.url ?? `${repoUrl()}/releases`}
            target="_blank"
            rel="noreferrer noopener"
            className="link"
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
