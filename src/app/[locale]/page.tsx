import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
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
  // Temporary mount so the toggle can be exercised. #7 moves it into the header.
  return (
    <main className="p-8">
      <ThemeToggle labels={{ toDark: "Dark", toLight: "Light" }} />
    </main>
  );
}
