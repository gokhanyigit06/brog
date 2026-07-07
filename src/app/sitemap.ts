import type { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { getProjects, slugify } from "@/lib/content";
import { getAllPosts } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

const STATIC_ROUTES = ["", "teklif", "projeler", "hizmetler", "hakkimizda", "iletisim", "blog"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    for (const route of STATIC_ROUTES) {
      const path = route ? `/${lang}/${route}` : `/${lang}`;
      entries.push({
        url: `${SITE_URL}${path}`,
        changeFrequency: route === "teklif" || route === "" ? "weekly" : "monthly",
        priority: route === "teklif" ? 1 : route === "" ? 0.9 : 0.6,
      });
    }
  }

  // Dinamik proje detay sayfaları
  try {
    const projects = await getProjects();
    for (const lang of locales) {
      for (const p of projects) {
        const slug = (p.slug && !p.slug.includes(".") && !p.slug.startsWith("http"))
          ? p.slug
          : slugify(p.brandName || p.title || "");
        if (!slug) continue;
        entries.push({
          url: `${SITE_URL}/${lang}/projeler/${slug}`,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // Firestore erişilemezse statik rotalarla devam et
  }

  // Yayındaki blog yazıları
  try {
    const posts = await getAllPosts(true);
    for (const lang of locales) {
      for (const p of posts) {
        if (!p.slug) continue;
        entries.push({
          url: `${SITE_URL}/${lang}/blog/${p.slug}`,
          lastModified: p.updatedAt || p.publishedAt || undefined,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // blog erişilemezse geç
  }

  return entries;
}
