import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
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
} from "@/lib/content";

// Veri her istekte server'da taze çekilir — görseller HTML'de hazır gelir,
// admin panelinden yapılan değişiklikler anında yansır.
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Tüm section verisini server'da paralel çek — client-fetch race'i ortadan kalkar.
  const [hero, showcase, projectsContent, featured, allProjects, why, services, faq] =
    await Promise.all([
      getHeroContent(),
      getShowcaseContent(),
      getProjectsContent(),
      getFeaturedProjects(),
      getProjects(),
      getWhyContent(),
      getServicesContent(),
      getFaqContent(),
    ]);

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
      <Navbar lang={lang as Locale} />
      <HeroSection lang={lang} initialContent={hero} />
      <ShowcaseSection lang={lang} initialContent={showcase} />
      <MarqueeSection brands={brands} />
      <ProjectsSection lang={lang} initialContent={projectsContent} initialFeatured={featured} />
      <WhySection lang={lang} initialContent={why} />
      <ServicesSection lang={lang} initialContent={services} />
      <FaqSection lang={lang} initialContent={faq} />
      <Footer lang={lang} />
    </main>
  );
}
