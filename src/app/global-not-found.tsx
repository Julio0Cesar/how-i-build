import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { defaultLocale, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { applyTheme, htmlClass } from "./shell";
import "./globals.css";

const dict = getDictionary(defaultLocale);

export const metadata: Metadata = {
  title: dict.notFound.title,
};

/**
 * The 404 for a URL that matches no route at all.
 *
 * A plain `not-found.tsx` cannot do this here: the root layout sits inside
 * `[locale]`, and Next has no params to resolve a not-found boundary against,
 * so it renders one without the layout and without server markup — the page
 * would only exist once JavaScript ran. The framework names this exact case as
 * the reason `global-not-found` exists.
 *
 * The cost is that it bypasses the layout, so the document, the stylesheet and
 * the theme script are repeated here. It also has no locale to read — nothing
 * matched, so there is nothing to read one from — and answers in the default
 * language.
 */
export default function GlobalNotFound() {
  return (
    <html
      lang={defaultLocale}
      className={htmlClass}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: applyTheme }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1 pt-14 sm:pt-16">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
            <div className="text-center">
              <span className="stamp text-accent">404</span>
              <h1 className="mt-4 text-[2.4rem] font-bold leading-[1.06] tracking-[-0.03em] text-balance sm:text-[3.4rem]">
                {dict.notFound.title}
              </h1>
              <p className="mx-auto mt-5 max-w-[34em] text-lg leading-relaxed text-muted-foreground">
                {dict.notFound.body}
              </p>
              <Link
                href={localeHref(defaultLocale, "/")}
                className="link mt-8 inline-block font-medium"
              >
                {dict.notFound.home}
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
