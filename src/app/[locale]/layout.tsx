import type { Metadata, Viewport } from "next";
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
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    /* iOS ignores SVG here: without the PNG, the home screen shows a screenshot. */
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.tagline,
    url: site.liveUrl,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
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
