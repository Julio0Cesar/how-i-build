import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Serif,
} from "next/font/google";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { isLocale, locales } from "@/i18n/config";
import "../globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
});

const serif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-serif",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

/**
 * Runs before first paint, so the page never renders in the wrong theme.
 * Reading this on the server instead would opt every route into dynamic
 * rendering, and next/script defers inline content past the first paint, which
 * is the one thing this cannot do.
 *
 * It owns the whole rule, not just the first paint: the class (what is painted)
 * and `data-theme-choice` (what the reader picked) are two facts, because
 * "system" resolved to dark is indistinguishable from "dark" by class alone.
 * `window.__theme.set` is how the control changes it, so the resolution logic
 * exists once instead of being mirrored in TypeScript.
 */
const applyTheme = `(function(){var K="theme",r=document.documentElement,m=matchMedia("(prefers-color-scheme: dark)");function read(){try{return localStorage.getItem(K)||"system"}catch(e){return "system"}}function apply(c){r.dataset.themeChoice=c;r.classList.toggle("dark",c==="dark"||(c==="system"&&m.matches))}window.__theme={set:function(c){try{localStorage.setItem(K,c)}catch(e){}apply(c);dispatchEvent(new Event("themechoice"))}};m.addEventListener("change",function(){if(read()==="system")apply("system")});apply(read())})()`;

export const metadata: Metadata = {
  title: site.name,
  description: site.tagline,
  metadataBase: new URL(site.liveUrl),
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: applyTheme }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {/* Offsets the fixed header. */}
        <main className="flex-1 pt-14 sm:pt-16">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
