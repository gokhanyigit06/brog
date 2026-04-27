import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import IletisimClient from "./iletisim-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: lang === "tr" ? "İletişim — BROG Studio" : "Contact — BROG Studio",
    description: lang === "tr"
      ? "BROG Studio ile iletişime geçin. Projeniz için birlikte çalışalım."
      : "Get in touch with BROG Studio. Let's work together on your project.",
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
