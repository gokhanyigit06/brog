import type { Metadata } from "next";
import { type Locale } from "@/i18n";
import { altLanguages, SITE_URL } from "@/lib/seo";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import StickyCta from "@/components/site/sticky-cta";
import HeroSection from "@/components/sections/hero-section";
import ShowcaseSection from "@/components/sections/showcase-section";
import MarqueeSection from "@/components/sections/marquee-section";
import ProjectsSection from "@/components/sections/projects-section";
import WhySection from "@/components/sections/why-section";
import ServicesSection from "@/components/sections/services-section";
import FaqSection from "@/components/sections/faq-section";
import {
  getHeroContent,
  getShowcaseContent,
  getProjectsContent,
  getFeaturedProjects,
  getProjects,
  getWhyContent,
  getServicesContent,
  getFaqContent,
  getSiteSettings,
} from "@/lib/content";

// Veri her istekte server'da taze çekilir — görseller HTML'de hazır gelir,
// admin panelinden yapılan değişiklikler anında yansır.
export const revalidate = 60; // ISR: 60 sn önbellek — admin değişiklikleri en geç 1 dk içinde yansır

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const tr = lang !== "en";
  const title = tr
    ? "Vogolab — Ankara Web Tasarım, Reklam & SEO Ajansı"
    : "Vogolab — Web Design, Ads & SEO Agency in Ankara";
  const description = tr
    ? "Ankara merkezli dijital ajans Vogolab: markaya özel web siteleri, Meta & Google reklam yönetimi ve uçtan uca SEO — tek ekipten, sonuç odaklı. Ankara ve çevre illerdeki işletmeler için ücretsiz teklif."
    : "Ankara-based digital agency Vogolab: custom websites, Meta & Google ad management and end-to-end SEO — one team, results-focused. Free proposal for businesses in Ankara and beyond.";
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      "ankara dijital ajans", "ankara web tasarım", "ankara web sitesi", "ankara reklam ajansı",
      "ankara seo ajansı", "google ads yönetimi ankara", "meta reklam yönetimi ankara", "vogolab",
    ],
    alternates: altLanguages(lang, ""),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}`,
      siteName: "Vogolab",
      type: "website",
      locale: tr ? "tr_TR" : "en_US",
      images: [{ url: "/og-teklif.jpg", width: 1200, height: 630, alt: "Vogolab — Web, Reklam ve SEO Ajansı" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-teklif.jpg"] },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const tr = lang !== "en";

  // Tüm section verisini server'da paralel çek — client-fetch race'i ortadan kalkar.
  const [hero, showcase, projectsContent, featured, allProjects, why, services, faq, settings] =
    await Promise.all([
      getHeroContent(),
      getShowcaseContent(),
      getProjectsContent(),
      getFeaturedProjects(),
      getProjects(),
      getWhyContent(),
      getServicesContent(),
      getFaqContent(),
      getSiteSettings(),
    ]);

  // JSON-LD: Organization/ProfessionalService + WebSite + FAQPage (görünen FAQ ile senkron)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: "Vogolab",
        url: SITE_URL,
        logo: `${SITE_URL}/vogolab-vg-mark.svg`,
        image: `${SITE_URL}/og-teklif.jpg`,
        description: tr
          ? "Ankara merkezli web tasarım, dijital reklam ve SEO ajansı."
          : "Ankara-based web design, digital advertising and SEO agency.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ankara",
          addressRegion: "Ankara",
          addressCountry: "TR",
        },
        areaServed: [
          "Ankara", "Kırıkkale", "Çankırı", "Bolu", "Eskişehir",
          "Konya", "Kırşehir", "Aksaray", "Çorum", "Yozgat",
        ].map((name) => ({ "@type": "City", name })),
        knowsAbout: [
          "Web Tasarım", "Web Geliştirme", "SEO", "Yerel SEO", "Google Ads",
          "Meta Ads", "Dijital Pazarlama", "Marka Kimliği", "E-ticaret",
        ],
        sameAs: [settings.social_instagram, settings.social_linkedin, settings.social_x].filter(Boolean),
        contactPoint: {
          "@type": "ContactPoint",
          telephone: settings.phone,
          contactType: "sales",
          email: settings.email,
          areaServed: "TR",
          availableLanguage: ["Turkish", "English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Vogolab",
        inLanguage: tr ? "tr-TR" : "en-US",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: (faq.items || []).map((it) => ({
          "@type": "Question",
          name: tr ? it.question_tr : it.question_en,
          acceptedAnswer: { "@type": "Answer", text: tr ? it.answer_tr : it.answer_en },
        })),
      },
    ],
  };

  // Akan marquee için çalışılan markaların kısa isimleri
  // (en-dash sonrasını at, " Shop" ekini kaldır, tekrarları temizle)
  const seenBrands = new Set<string>();
  const brands = allProjects
    .map((p) => (p.brandName || p.title || "").split(/[–—]/)[0].trim())
    .map((s) => s.replace(/\s+shop$/i, "").trim())
    .filter(Boolean)
    .filter((s) => {
      const k = s.toLowerCase();
      if (seenBrands.has(k)) return false;
      seenBrands.add(k);
      return true;
    });

  return (
    <main className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar lang={lang as Locale} />
      <HeroSection lang={lang} initialContent={hero} />
      <ShowcaseSection lang={lang} initialContent={showcase} />
      <MarqueeSection brands={brands} />
      <ProjectsSection lang={lang} initialContent={projectsContent} initialFeatured={featured} />
      <WhySection lang={lang} initialContent={why} />
      <ServicesSection lang={lang} initialContent={services} />
      <FaqSection lang={lang} initialContent={faq} />
      <Footer lang={lang} />
      <StickyCta lang={lang as Locale} />
    </main>
  );
}
