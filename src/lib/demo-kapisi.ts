// Demo vitrini şifre kapısı — hem proxy (Edge) hem route handler (Node) kullanır.
// Yalnız her iki ortamda da bulunan API'ler: atob + TextEncoder yok, düz karşılaştırma.
//
// Kapı NEDEN iki yerde: proxy zaten /demolar/* isteklerini kesiyor, ama matcher
// ileride değişirse route çıplak kalmasın. Aynı kontrol iki katmanda.

export const DEMO_KULLANICI = () => process.env.DEMO_KULLANICI || "vogolab";

function esitMi(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let fark = 0;
  for (let i = 0; i < a.length; i++) fark |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return fark === 0;
}

/**
 * Şifre kapısı açık mı?
 *
 * 2026-07-29'da Gökhan kapıyı KAPATTI ("şimdilik kaldıralım, siteye kimse
 * girmiyor"). Kod silinmedi — geri açmak tek env değişkeni:
 *     Coolify → brog → DEMO_SIFRE_ZORUNLU = 1
 * (Şifrenin kendisi zaten DEMO_SIFRE'de duruyor.)
 *
 * Kapı KAPALIYKEN /demolar herkese açıktır. Tek koruma `noindex` başlıkları ve
 * robots.txt — yani arama motoruna düşmez ama adresi bilen görür.
 */
export function demoKapisiZorunlu(): boolean {
  return process.env.DEMO_SIFRE_ZORUNLU === "1";
}

/** Şifre tanımlı mı? Değilse vitrin AÇILMAZ (env düşerse herkese açılmasın). */
export function demoYapilandirildi(): boolean {
  return Boolean(process.env.DEMO_SIFRE);
}

export function demoYetkili(authorization: string | null | undefined): boolean {
  if (!demoKapisiZorunlu()) return true; // kapı bilerek kapatılmış
  const sifre = process.env.DEMO_SIFRE;
  if (!sifre) return false;
  const baslik = authorization || "";
  if (!baslik.startsWith("Basic ")) return false;
  try {
    const cozulmus = atob(baslik.slice(6));
    const ayrac = cozulmus.indexOf(":");
    if (ayrac <= 0) return false;
    return (
      esitMi(cozulmus.slice(0, ayrac), DEMO_KULLANICI()) &&
      esitMi(cozulmus.slice(ayrac + 1), sifre)
    );
  } catch {
    return false;
  }
}

export const DEMO_BASLIKLARI = {
  "x-robots-tag": "noindex, nofollow, noarchive",
} as const;

export function demoReddet(): Response {
  if (!demoYapilandirildi()) {
    return new Response("Demo vitrini yapılandırılmadı (DEMO_SIFRE yok).", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }
  return new Response("Bu sayfa için giriş gerekiyor.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="VOGOLAB - Tasarim Ornekleri"',
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      ...DEMO_BASLIKLARI,
    },
  });
}
