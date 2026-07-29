import "server-only";
import { adminBucket } from "@/lib/firebase-admin";
import { demoYetkili, demoReddet, DEMO_BASLIKLARI } from "@/lib/demo-kapisi";

// Demo vitrini dosya sunucusu.
//
// Dosyalar Firebase Storage'da `demolar/` altında durur, DEPODA DEĞİL: bir demo
// ~35 MB ve depo 6,5 MB. Repoya konsaydı her demo geçmişe kalıcı olarak eklenirdi.
//
// Storage'da `demolar/` istemciye TAMAMEN kapalı (storage.rules). Buradan
// Admin SDK ile okunur — Admin SDK kuralları bypass eder. Yani dosyaya ulaşmanın
// tek yolu bu rota, tek yolu da şifre.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TURLER: Record<string, string> = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  ico: "image/x-icon",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  mp4: "video/mp4",
  webm: "video/webm",
};

function icerikTuru(yol: string): string {
  const uz = yol.split(".").pop()?.toLowerCase() ?? "";
  return TURLER[uz] ?? "application/octet-stream";
}

export async function GET(
  istek: Request,
  ctx: { params: Promise<{ yol?: string[] }> }
) {
  if (!demoYetkili(istek.headers.get("authorization"))) return demoReddet();

  const { yol = [] } = await ctx.params;

  // Yol kaçışı koruması: ".." ya da boş segment kabul edilmez.
  if (yol.some((p) => p === ".." || p === "." || p === "" || p.includes("\\"))) {
    return new Response("Geçersiz yol.", { status: 400 });
  }

  // /demolar → vitrin sayfası
  const istenen = yol.length === 0 ? "index.html" : yol.join("/");

  // Klasör adresleri de açılmalı: /demolar/stack-n-snack → .../index.html
  // (2026-07-29: galeriden tıklayınca sorun yoktu ama uzantısız adres —
  //  yani müşteriye paylaşılan doğal adres — "bulunamadı" veriyordu.)
  const adaylar = istenen.includes(".")
    ? [istenen]
    : [istenen, `${istenen}/index.html`, `${istenen}.html`];

  let veri: Buffer;
  let bagil = istenen;
  try {
    const kova = adminBucket();
    let bulunan: string | null = null;
    for (const aday of adaylar) {
      const [varMi] = await kova.file(`demolar/${aday}`).exists();
      if (varMi) { bulunan = aday; break; }
    }
    if (!bulunan) {
      return new Response("Bu örnek bulunamadı.", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8", ...DEMO_BASLIKLARI },
      });
    }
    bagil = bulunan;
    [veri] = await kova.file(`demolar/${bulunan}`).download();
  } catch (hata) {
    console.error("[demolar] okunamadı:", istenen, hata);
    return new Response("Demo dosyası okunamadı.", {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // _v/ altındaki varlıkların adında içerik özeti var (aynı ad = aynı içerik),
  // bu yüzden uzun süre önbelleklenebilir. HTML her seferinde tazelenir.
  // "private": kapının arkasındaki içerik ara önbelleklerde paylaşılmasın.
  const onbellek = bagil.includes("/_v/")
    ? "private, max-age=31536000, immutable"
    : "private, no-store";

  return new Response(new Uint8Array(veri), {
    status: 200,
    headers: {
      "content-type": icerikTuru(bagil),
      "content-length": String(veri.length),
      "cache-control": onbellek,
      ...DEMO_BASLIKLARI,
    },
  });
}
