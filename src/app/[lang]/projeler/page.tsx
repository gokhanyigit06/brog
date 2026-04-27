import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import ProjelerClient from "./projeler-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: lang === "tr" ? "Projeler — BROG Studio" : "Projects — BROG Studio",
    description: lang === "tr"
      ? "BROG Studio'nun seçilmiş çalışmaları ve proje portföyü."
      : "Selected works and project portfolio by BROG Studio.",
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
    </>
  );
}
