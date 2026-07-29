import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /demolar: müşteriye gösterilen tasarım örnekleri. Şifre kapısı
      // kapatıldığında (2026-07-29) tek koruma bu kaldı — indekslenmemeli.
      // İçerik kaynak temalara ait; arama sonuçlarında vogolab.com'un işi gibi
      // görünmesi hem yanıltıcı olur hem telif açısından sorunlu.
      disallow: ["/admin", "/studio", "/studio-static", "/ads", "/portal-static", "/api", "/demolar"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
