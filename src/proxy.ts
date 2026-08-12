import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config";

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  for (const entry of header.split(",")) {
    const tag = entry.trim().split(";")[0]?.toLowerCase().slice(0, 2);
    if (tag && isLocale(tag)) return tag;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const defaultPrefix = `/${defaultLocale}`;

  // The default locale is never spelled out in the URL. Without this, the same
  // page would answer at /projects and /en/projects.
  if (pathname === defaultPrefix || pathname.startsWith(`${defaultPrefix}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultPrefix.length) || "/";
    return NextResponse.redirect(url, 308);
  }

  const alreadyPrefixed = locales.some(
    (locale) =>
      locale !== defaultLocale &&
      (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)),
  );
  if (alreadyPrefixed) return NextResponse.next();

  // Only the bare root follows the reader's preference. Deeper URLs are honored
  // as written, so a link someone shared opens in the language it was shared in.
  if (pathname === "/") {
    const preferred = preferredLocale(request);
    if (preferred !== defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${preferred}`;
      return NextResponse.redirect(url);
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `${defaultPrefix}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
