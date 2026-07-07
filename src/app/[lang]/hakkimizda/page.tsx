import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import StickyCta from "@/components/site/sticky-cta";
import ClientLogosGrid from "@/components/sections/client-logos-grid";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { getAboutContent, getShowcaseContent, getClientLogos } from "@/lib/content";

export const dynamic = "force-dynamic";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = "Hakkımızda — Vogolab | Dijital Büyüme Ajansı";
  const description = "Ankara merkezli dijital büyüme ajansı Vogolab: kaliteli web siteleri kurar, Meta & Google reklamlarını yönetir, uçtan uca SEO yaparız. Bizi yakından tanıyın.";
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${lang}/hakkimizda` },
    openGraph: { title, description, url: `${SITE_URL}/${lang}/hakkimizda`, siteName: "Vogolab", type: "website", locale: "tr_TR", images: [{ url: "/og-teklif.jpg", width: 1200, height: 630 }] },
  };
}

const accentPill: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent)", color: "var(--accent-ink)",
  border: "none", borderRadius: 999, padding: "15px 30px", fontSize: 15, fontWeight: 700, textDecoration: "none",
};

const DEFAULT_BIO_TR =
  "Vogolab, markaların dijitalde büyümesi için kurulmuş Ankara merkezli bir dijital ajanstır. Hazır şablonlarla değil, her markaya özel kodlanmış web siteleriyle çalışırız; Meta ve Google reklamlarını sonuç odaklı yönetir, teknik altyapıdan içeriğe uçtan uca SEO yaparız.\n\nBizi farklı kılan şey, üç disiplini tek çatı altında toplamamız: siteyi kuran ekip ile reklamı yöneten ve SEO'yu yürüten ekip aynı masada oturur. Böylece strateji kopmaz, sonuç hızlanır.\n\nE-ticaretten kurumsala, restoran teknolojilerinden sağlığa kadar birçok sektörde işler ürettik. Her projede aynı soruyu sorarız: bu iş, müşterimize ölçülebilir ne kazandıracak?";

const VALUES_TR = [
  { icon: "✦", title: "Tek ekip, tek hedef", desc: "Tasarım, yazılım, reklam ve SEO aynı masada — strateji hiçbir aşamada kopmaz." },
  { icon: "◎", title: "Ölçülebilir sonuç", desc: "Beğeni değil rakam konuşur: trafik, dönüşüm, ROAS ve satış." },
  { icon: "▦", title: "Özel üretim", desc: "Hazır tema değil, markanıza özel kodlanan hızlı ve esnek altyapılar." },
  { icon: "↗", title: "Uzun vadeli ortaklık", desc: "Lansmanla bitmez — büyüme sürdükçe yanınızda kalırız." },
];

export default async function HakkimizdaPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const [about, showcase, logos] = await Promise.all([getAboutContent(), getShowcaseContent(), getClientLogos()]);
  const tr = lang === "tr";

  const title = ((tr ? about.title_tr : about.title_en) || about.title_tr || "Hakkımızda").trim();
  const bio = ((tr ? about.bio_tr : about.bio_en) || about.bio_tr || DEFAULT_BIO_TR).trim();

  const stats = [
    { value: showcase.stat1_value || "120+", label: (tr ? showcase.stat1_label_tr : showcase.stat1_label_en) || "Tamamlanan Proje" },
    { value: showcase.stat2_value || "%98", label: (tr ? showcase.stat2_label_tr : showcase.stat2_label_en) || "Müşteri Memnuniyeti" },
    { value: showcase.stat3_value || "5+", label: (tr ? showcase.stat3_label_tr : showcase.stat3_label_en) || "Yıllık Deneyim" },
  ];

  return (
    <>
      <Navbar lang={lang} lightBg />
      <main style={{ background: "#fff", minHeight: "100vh" }}>

        {/* ── Hero ── */}
        <section className="section-container" style={{ paddingTop: 150, paddingBottom: 64 }}>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 22 }}>
            {tr ? "Biz Kimiz" : "Who We Are"}
          </p>
          <h1 style={{ fontSize: "clamp(44px, 7vw, 104px)", fontWeight: 900, lineHeight: 0.96, letterSpacing: "-0.04em", color: "#0a0a0a", maxWidth: 1000, margin: 0 }}>
            {title === "Hakkımızda" ? "Markaları dijitalde büyüten ekip." : title}
          </h1>
        </section>

        {/* ── Bio + görsel ── */}
        <section className="section-container" style={{ paddingBottom: 88 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="about-grid">
            <RevealOnScroll>
              <div style={{ fontSize: 17, lineHeight: 1.85, color: "#374151", whiteSpace: "pre-line" }}>{bio}</div>
              <div style={{ marginTop: 36 }}>
                <Link href={`/${lang}/teklif`} style={accentPill}>Ücretsiz Teklif Al ↗</Link>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", borderRadius: 18, overflow: "hidden", background: "#0d0d0d" }}>
                {about.image ? (
                  <Image src={about.image} alt="Vogolab ekibi" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/vogolab-vg-mark-white.svg" alt="Vogolab" style={{ width: "38%", opacity: 0.12 }} />
                  </div>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── İstatistikler ── */}
        <section style={{ background: "#0d0d0d", width: "100%" }}>
          <div className="section-container" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
              {stats.map((s) => (
                <div key={s.label} style={{ borderTop: "2px solid var(--accent)", paddingTop: 22 }}>
                  <div style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em" }}>{s.value}</div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Değerler ── */}
        <section className="section-container" style={{ paddingTop: 96, paddingBottom: 64 }}>
          <RevealOnScroll>
            <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
              {tr ? "Nasıl Çalışırız" : "How We Work"}
            </p>
            <h2 style={{ fontSize: "clamp(36px, 5.5vw, 76px)", fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.04em", color: "#0a0a0a", maxWidth: 860, marginBottom: 56 }}>
              Bizi farklı kılan dört şey.
            </h2>
          </RevealOnScroll>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40 }}>
            {VALUES_TR.map((v, i) => (
              <RevealOnScroll key={v.title} delay={i * 0.06}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 24, color: "var(--accent)", lineHeight: 1 }}>{v.icon}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: "#0a0a0a", lineHeight: 1.3, margin: 0 }}>{v.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#4b5563", margin: 0 }}>{v.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        <ClientLogosGrid initialLogos={logos.logos} />

        {/* ── Final CTA ── */}
        <section style={{ background: "#0a0a0a", width: "100%" }}>
          <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96, textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(36px, 6vw, 84px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", margin: 0 }}>
              {tr ? "Birlikte büyüyelim." : "Let's grow together."}
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", marginTop: 20, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
              Projenizi anlatın; 24 saat içinde yol haritası ve teklifle dönelim.
            </p>
            <div style={{ marginTop: 34 }}>
              <Link href={`/${lang}/teklif`} style={accentPill}>Ücretsiz Teklif Al ↗</Link>
            </div>
          </div>
        </section>

        <style>{`@media (max-width: 860px){ .about-grid{ grid-template-columns: 1fr !important; } }`}</style>
      </main>
      <Footer lang={lang} />
      <StickyCta lang={lang} />
    </>
  );
}
