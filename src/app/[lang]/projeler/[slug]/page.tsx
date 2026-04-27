import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import ProjectDetailClient from "./project-detail-client";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;

  return (
    <>
      <Navbar lang={lang} lightBg />
      <ProjectDetailClient slug={slug} lang={lang} />
      <Footer lang={lang} />
    </>
  );
}
