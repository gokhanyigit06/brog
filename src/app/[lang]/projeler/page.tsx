import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import StickyCta from "@/components/site/sticky-cta";
import ProjelerClient from "./projeler-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const tr = lang === "tr";
  const title = tr ? "Projeler & Referanslar — Vogolab | Ankara Web Tasarım" : "Projects & References — Vogolab";
  const description = tr
    ? "Vogolab'ın gerçek işleri: e-ticaretten kurumsala web siteleri, reklam ve SEO projeleri. Ankara ve çevresindeki markalarla ürettiğimiz çalışmaları inceleyin."
    : "Real work by Vogolab: websites, advertising and SEO projects from e-commerce to corporate.";
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${lang}/projeler` },
  };
}

export default async function ProjelerPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <>
      <Navbar lang={lang} lightBg />
      <ProjelerClient lang={lang} />
      <Footer lang={lang} />
      <StickyCta lang={lang} />
    </>
  );
}
