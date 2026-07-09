import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import IletisimClient from "./iletisim-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const tr = lang === "tr";
  const title = tr ? "İletişim — Vogolab | Ankara Dijital Ajans" : "Contact — Vogolab | Digital Agency";
  const description = tr
    ? "Vogolab ile iletişime geçin: web sitesi, reklam yönetimi ve SEO projeleriniz için Ankara merkezli ekibimizle konuşalım."
    : "Get in touch with Vogolab. Let's talk about your website, advertising and SEO projects.";
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${lang}/iletisim` },
  };
}

export default async function IletisimPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <>
      <Navbar lang={lang} lightBg />
      <IletisimClient lang={lang} />
      <Footer lang={lang} />
    </>
  );
}
