import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { altLanguages } from "@/lib/seo";
import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import StickyCta from "@/components/site/sticky-cta";
import ProjectDetailClient from "./project-detail-client";
import { getProjectBySlug, getProjects } from "@/lib/content";

export const revalidate = 60; // ISR: 60 sn önbellek — admin değişiklikleri en geç 1 dk içinde yansır
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  try {
    const p = await getProjectBySlug(slug);
    if (!p) return { title: "Proje | Vogolab" };
    const name = (p.brandName || p.title || "").split(/[–—]/)[0].trim();
    const title = `${name} — ${p.category || "Proje"} | Vogolab Referansları`;
    const rawDesc = (lang === "tr" ? p.description_tr : p.description_en) || p.description_tr || "";
    const fallbackDesc = lang === "tr"
      ? `${name} için ${p.category || "dijital"} çalışmamız. Vogolab'ın Ankara merkezli ekibiyle ürettiği gerçek işleri inceleyin.`
      : `Our ${p.category || "digital"} work for ${name}. Explore real projects by Vogolab.`;
    const description = (rawDesc.replace(/\s+/g, " ").trim() || fallbackDesc).slice(0, 158);
    const url = `${SITE_URL}/${lang}/projeler/${slug}`;
    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      alternates: altLanguages(lang, `/projeler/${slug}`),
      openGraph: {
        title, description, url, siteName: "Vogolab", type: "article", locale: "tr_TR",
        images: p.imageUrl ? [{ url: p.imageUrl, alt: name }] : [{ url: "/og-teklif.jpg", width: 1200, height: 630 }],
      },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return { title: "Proje | Vogolab" };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;

  // Veriyi server'da çek → h1 ve içerik SSR HTML'inde hazır gelir (crawler & <noscript>
  // görür). Client artık useEffect ile fetch etmiyor, bu veriyi başlangıç durumu alıyor.
  const project = await getProjectBySlug(slug);
  // Proje yoksa gerçek 404 (soft-200 yerine) → markalı [lang]/not-found render olur.
  if (!project) notFound();
  const others = (await getProjects())
    .filter((x) => x.id !== project.id && x.id !== slug)
    .slice(0, 2);

  return (
    <>
      <Navbar lang={lang} lightBg />
      <ProjectDetailClient
        slug={slug}
        lang={lang}
        initialProject={project}
        initialOthers={others}
      />
      <Footer lang={lang} />
      <StickyCta lang={lang} />
    </>
  );
}
