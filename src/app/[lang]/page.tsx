import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import HeroSection from "@/components/sections/hero-section";
import ShowcaseSection from "@/components/sections/showcase-section";
import MarqueeSection from "@/components/sections/marquee-section";
import ProjectsSection from "@/components/sections/projects-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <main className="bg-white min-h-screen">
      <Navbar lang={lang as Locale} />
      <HeroSection lang={lang} />
      <ShowcaseSection lang={lang} />
      <MarqueeSection />
      <ProjectsSection lang={lang} />
    </main>
  );
}
