import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-auth";

const locales = ["tr", "en"];
const defaultLocale = "tr";

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") || "";
  for (const locale of locales) {
    if (acceptLanguage.toLowerCase().includes(locale)) {
      return locale;
    }
  }
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin panel — çerez tabanlı oturum (leadler kişisel veri içerir).
  // Giriş: /admin/login → /api/admin/login imzalı httpOnly çerez bırakır.
  if (pathname.startsWith("/admin")) {
    const hasSession = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
    if (pathname === "/admin/login") {
      if (hasSession) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        url.search = "";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
    if (hasSession) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Skip api, _next, static files, AND Vogolab Orchestra customer
  // portal (locale-agnostic, single-language). If we let the locale redirect
  // catch /ads or /portal-static, the URL becomes /tr/ads which Orchestra
  // service doesn't recognize → 404.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/ads") ||
    pathname.startsWith("/portal-static") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/studio-static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to locale-prefixed path
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm)).*)",
  ],
};
