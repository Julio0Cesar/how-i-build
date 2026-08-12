import type { Metadata } from "next";
import { isLocale, locales, localeHref } from "@/i18n/config";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: localeHref(locale, "/"),
      languages: {
        ...Object.fromEntries(
          locales.map((entry) => [entry, localeHref(entry, "/")]),
        ),
        "x-default": "/",
      },
    },
  };
}

export default function Home() {
  return null;
}
