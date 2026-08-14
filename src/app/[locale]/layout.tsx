import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { isLocale, locales } from "@/i18n/config";
import { applyTheme, htmlClass } from "../shell";
import "../globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.tagline,
  metadataBase: new URL(site.liveUrl),
  /**
   * Wiring lives here, the file lives in `public/` — which the `site` branch
   * owns, so replacing the mark never touches a file `main` maintains.
   */
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
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
      className={htmlClass}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
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
