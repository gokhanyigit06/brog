import type { Metadata } from "next";
import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import LogoMarquee from "@/components/sections/logo-marquee";
import FaqSection from "@/components/sections/faq-section";
import {
  getFeaturedProjects,
  getProjects,
  getFaqContent,
  getSiteSettings,
  getClientLogos,
  getTeklifShowcase,
} from "@/lib/content";

import TeklifHero from "./teklif-hero";
import TeklifShowcase from "./teklif-showcase";
import ValuePropSection from "./value-prop-section";
import ProcessSection from "./process-section";
import WhyUsSection from "./why-us-section";
import ResultsSection from "./results-section";
import LeadFormSection from "./lead-form-section";
import StickyCtaBar from "./sticky-cta-bar";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = "Web Sitesi, Reklam ve SEO Ajansı | Vogolab";
  const description =
    "Yüksek kaliteli özel web sitesi, sonuç odaklı Meta & Google reklam yönetimi ve uçtan uca SEO — tek ekipten. Markanızı büyütmek için ücretsiz teklif alın.";
  const url = `${SITE_URL}/${lang}/teklif`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      "dijital ajans", "web tasarım ajansı", "reklam ajansı", "seo ajansı",
      "google ads yönetimi", "meta reklam yönetimi", "web sitesi yaptırma", "vogolab",
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Vogolab",
      type: "website",
      locale: "tr_TR",
      images: [{ url: "/og-teklif.jpg", width: 1200, height: 630, alt: "Vogolab — Web, Reklam ve SEO Ajansı" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-teklif.jpg"] },
  };
}

export default async function TeklifPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;

  const [featured, allProjects, faq, settings, clientLogos, showcase] = await Promise.all([
    getFeaturedProjects(),
    getProjects(),
    getFaqContent(),
    getSiteSettings(),
    getClientLogos(),
    getTeklifShowcase(),
  ]);

  // Marka marquee'si için kısa marka isimleri (ana sayfadaki mantık)
  const seen = new Set<string>();
  const brands = allProjects
    .map((p) => (p.brandName || p.title || "").split(/[–—]/)[0].trim())
    .map((s) => s.replace(/\s+shop$/i, "").trim())
    .filter(Boolean)
    .filter((s) => { const k = s.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });

  // JSON-LD: Organization + Service + FAQPage (görünen içerikle senkron)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Vogolab",
        url: SITE_URL,
        logo: `${SITE_URL}/vogolab-vg-mark.svg`,
        description: "Web tasarım, dijital reklam ve SEO ajansı.",
        areaServed: "TR",
        sameAs: [settings.social_instagram, settings.social_linkedin, settings.social_x].filter(Boolean),
        contactPoint: {
          "@type": "ContactPoint",
          telephone: settings.phone,
          contactType: "sales",
          email: settings.email,
          areaServed: "TR",
          availableLanguage: ["Turkish"],
        },
      },
      {
        "@type": "Service",
        name: "Web Tasarım, Dijital Reklam ve SEO",
        serviceType: ["Web Tasarım", "Dijital Reklam Yönetimi", "SEO"],
        areaServed: { "@type": "Country", name: "Türkiye" },
        provider: { "@id": `${SITE_URL}/#organization` },
        url: `${SITE_URL}/${lang}/teklif`,
      },
      {
        "@type": "FAQPage",
        mainEntity: (faq.items || []).map((it) => ({
          "@type": "Question",
          name: it.question_tr,
          acceptedAnswer: { "@type": "Answer", text: it.answer_tr },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar lang={lang} />
      <main className="bg-white" style={{ paddingBottom: 0 }}>
        <TeklifHero settings={settings} />
        <LogoMarquee initialLogos={clientLogos.logos} fallbackBrands={brands} />
        <ValuePropSection />
        <TeklifShowcase lang={lang} content={showcase} projects={allProjects} featured={featured} />
        <ProcessSection />
        <WhyUsSection />
        <ResultsSection />
        <FaqSection lang={lang} initialContent={faq} />
        <LeadFormSection settings={settings} />
      </main>
      <Footer lang={lang} />
      <StickyCtaBar settings={settings} />
    </>
  );
}
