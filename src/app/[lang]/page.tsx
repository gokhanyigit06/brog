import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import HeroSection from "@/components/sections/hero-section";

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
    </main>
  );
}
