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

// ── Demo vitrini kapısı ──────────────────────────────────────────────────────
// /demolar müşteriye gösterilen tasarım örnekleridir; herkese açık DEĞİLDİR.
// Kapı burada, yani SUNUCUDA: adresi bilen bile şifresiz tek bir dosya alamaz.
// (İstemci tarafı bir şifre ekranı perde olurdu — dosya adresi doğrudan çekilir.)
const DEMO_KULLANICI = () => process.env.DEMO_KULLANICI || "vogolab";

function esitMi(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let fark = 0;
  for (let i = 0; i < a.length; i++) fark |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return fark === 0;
}

function demoKapisi(request: NextRequest): NextResponse | null {
  const sifre = process.env.DEMO_SIFRE;
  // Şifre tanımlı değilse AÇMA. Env düşerse vitrin herkese açılmasın.
  if (!sifre) {
    return new NextResponse("Demo vitrini yapılandırılmadı (DEMO_SIFRE yok).", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }
  const baslik = request.headers.get("authorization") || "";
  if (baslik.startsWith("Basic ")) {
    try {
      const cozulmus = atob(baslik.slice(6));
      const ayrac = cozulmus.indexOf(":");
      if (ayrac > 0) {
        const kullanici = cozulmus.slice(0, ayrac);
        const gelenSifre = cozulmus.slice(ayrac + 1);
        if (esitMi(kullanici, DEMO_KULLANICI()) && esitMi(gelenSifre, sifre)) return null;
      }
    } catch {
      // bozuk base64 → aşağıdaki 401
    }
  }
  return new NextResponse("Bu sayfa için giriş gerekiyor.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="VOGOLAB - Tasarim Ornekleri"',
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex, nofollow, noarchive",
      "cache-control": "no-store",
    },
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Demo vitrini — her şeyden ÖNCE. Aşağıdaki "uzantılı yolu atla" kuralına
  // düşerse görseller kapının dışında kalırdı.
  if (pathname === "/demolar" || pathname.startsWith("/demolar/")) {
    const kapi = demoKapisi(request);
    if (kapi) return kapi;
    if (pathname === "/demolar" || pathname === "/demolar/") {
      const url = request.nextUrl.clone();
      url.pathname = "/demolar/index.html";
      return NextResponse.rewrite(url);
    }
    const cevap = NextResponse.next();
    cevap.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
    return cevap;
  }

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
    // /demolar AYRICA yazılmalı: yukarıdaki desen görsel uzantılarını dışarıda
    // bırakıyor, yani demo görselleri kapının dışında kalır ve şifresiz çekilirdi.
    "/demolar",
    "/demolar/:path*",
  ],
};
