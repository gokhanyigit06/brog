import type { Metadata } from "next";
import Link from "next/link";
import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import StickyCta from "@/components/site/sticky-cta";
import ClientLogosGrid from "@/components/sections/client-logos-grid";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import BrowserMockup from "@/components/ui/browser-mockup";
import {
  getServicesContent, getProjects, getClientLogos, getProjectsForService, slugify,
  type Project, type ServiceItem,
} from "@/lib/content";
import { serviceSlugForTitle } from "./[slug]/service-content";

export const revalidate = 60; // ISR: 60 sn önbellek — admin değişiklikleri en geç 1 dk içinde yansır
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const tr = lang === "tr";
  const title = tr
    ? "Hizmetlerimiz — Ankara Web Tasarım, Reklam & SEO | Vogolab"
    : "Our Services — Web Design, Advertising & SEO | Vogolab";
  const description = tr
    ? "Ankara ve çevre iller için web sitesi tasarımı, Meta & Google reklam yönetimi ve uçtan uca SEO — her hizmette gerçek referans projelerimizle. Markanızı büyütmek için tek ekip."
    : "Web design, Meta & Google ads management and end-to-end SEO — with real reference projects under every service. One team to grow your brand.";
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${lang}/hizmetler` },
    openGraph: { title, description, url: `${SITE_URL}/${lang}/hizmetler`, siteName: "Vogolab", type: "website", locale: tr ? "tr_TR" : "en_US", images: [{ url: "/og-teklif.jpg", width: 1200, height: 630 }] },
  };
}

function resolveSlug(p: Project): string {
  const raw = p.slug;
  return (raw && !raw.includes(".") && !raw.startsWith("http")) ? raw : slugify(p.brandName || p.title || "");
}

const accentPill: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent)", color: "var(--accent-ink)",
  border: "none", borderRadius: 999, padding: "15px 30px", fontSize: 15, fontWeight: 700, textDecoration: "none",
};

export default async function HizmetlerPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const [services, projects, logos] = await Promise.all([getServicesContent(), getProjects(), getClientLogos()]);
  const tr = lang === "tr";
  const items = [...(services.items || [])].sort((a, b) => a.order - b.order);

  const sTitle = (it: ServiceItem) => (tr ? it.title_tr : it.title_en) || it.title_tr;
  const sDesc = (it: ServiceItem) => (tr ? it.description_tr : it.description_en) || it.description_tr;
  const sPills = (it: ServiceItem) => ((tr ? it.pills_tr : it.pills_en) ?? it.pills ?? []);

  return (
    <>
      <Navbar lang={lang} lightBg />
      <main style={{ background: "#fff", minHeight: "100vh" }}>

        {/* Hero */}
        <section className="section-container" style={{ paddingTop: 150, paddingBottom: 72 }}>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 22 }}>{tr ? "Hizmetlerimiz" : "Our Services"}</p>
          <h1 style={{ fontSize: "clamp(44px, 7vw, 104px)", fontWeight: 900, lineHeight: 0.96, letterSpacing: "-0.04em", color: "#0a0a0a", maxWidth: 1000, margin: 0 }}>
            {tr ? "Web, reklam ve SEO'yu tek ekipten yönetin." : "Web, ads and SEO — managed by one team."}
          </h1>
          <p style={{ fontSize: "clamp(16px, 1.5vw, 20px)", lineHeight: 1.6, color: "#4b5563", maxWidth: 620, marginTop: 26 }}>
            {tr
              ? "Ankara merkezli ekibimizle kaliteli web siteleri kurar, Meta & Google reklamlarını yönetir, uçtan uca SEO yaparız. Her hizmetin altında o alanda yaptığımız gerçek işleri görebilirsiniz."
              : "We build high-quality websites, manage Meta & Google campaigns and run end-to-end SEO. Under each service you can see real work we've delivered in that field."}
          </p>
          <div style={{ marginTop: 36 }}>
            <Link href={`/${lang}/teklif`} style={accentPill}>{tr ? "Ücretsiz Teklif Al ↗" : "Get a Free Quote ↗"}</Link>
          </div>
        </section>

        {/* Hizmet blokları + referanslar */}
        <section className="section-container" style={{ paddingBottom: 40 }}>
          {items.map((it, idx) => {
            const refs = getProjectsForService(it, projects).slice(0, 3);
            const num = String(idx + 1).padStart(2, "0");
            const detailSlug = serviceSlugForTitle(it.title_tr || it.title_en);
            return (
              <RevealOnScroll key={it.id}>
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 56, paddingBottom: 64 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 28, alignItems: "start" }} className="svc-grid">
                    <span style={{ fontSize: 16, fontWeight: 600, color: "var(--accent)", paddingTop: 8 }}>{num}</span>
                    <div>
                      {detailSlug ? (
                        <Link href={`/${lang}/hizmetler/${detailSlug}`} style={{ textDecoration: "none" }}>
                          <h2 style={{ fontSize: "clamp(30px, 4.5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0a0a0a", margin: 0 }}>{sTitle(it)}</h2>
                        </Link>
                      ) : (
                        <h2 style={{ fontSize: "clamp(30px, 4.5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0a0a0a", margin: 0 }}>{sTitle(it)}</h2>
                      )}
                      <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4b5563", maxWidth: 620, marginTop: 16 }}>{sDesc(it)}</p>
                      {detailSlug && (
                        <Link href={`/${lang}/hizmetler/${detailSlug}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 14.5, fontWeight: 700, color: "var(--accent)", textDecoration: "none" }}>
                          {tr ? "Detaylı incele ↗" : "Learn more ↗"}
                        </Link>
                      )}
                      {sPills(it).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                          {sPills(it).map((p) => (
                            <span key={p} style={{ display: "inline-block", padding: "6px 13px", background: "#0a0a0a", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{p}</span>
                          ))}
                        </div>
                      )}

                      {refs.length > 0 && (
                        <div style={{ marginTop: 40 }}>
                          <p style={{ fontSize: 12.5, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>{tr ? "Bu alandaki işlerimiz" : "Our work in this field"}</p>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 28 }}>
                            {refs.map((p) => (
                              <Link key={p.id} href={`/${lang}/projeler/${resolveSlug(p)}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                                <BrowserMockup imageUrl={p.imageUrl || p.listingImageUrl} videoUrl={p.videoUrl} link={p.link} alt={p.brandName} sizes="(max-width: 768px) 100vw, 33vw" ratio="16 / 10" />
                                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                                  <span style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a" }}>{p.brandName || p.title}</span>
                                  <span style={{ fontSize: 13, color: "#9ca3af" }}>{p.year}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <Link href={`/${lang}/projeler`} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 24, fontSize: 14, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>{tr ? "Tüm projeleri gör ↗" : "See all projects ↗"}</Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </section>

        <ClientLogosGrid initialLogos={logos.logos} label={tr ? "Referanslar" : "References"} title={tr ? "Çalıştığımız Markalar" : "Brands We Work With"} />

        {/* Final CTA */}
        <section style={{ background: "#0a0a0a", width: "100%" }}>
          <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96, textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(36px, 6vw, 84px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", margin: 0 }}>{tr ? "Projenizi konuşalım." : "Let's talk about your project."}</h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", marginTop: 20, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>{tr ? "24 saat içinde size özel bir yol haritası ve fiyat teklifiyle dönelim." : "We'll get back within 24 hours with a tailored roadmap and quote."}</p>
            <div style={{ marginTop: 34 }}>
              <Link href={`/${lang}/teklif`} style={accentPill}>{tr ? "Ücretsiz Teklif Al ↗" : "Get a Free Quote ↗"}</Link>
            </div>
          </div>
        </section>

        <style>{`@media (max-width: 640px){ .svc-grid{ grid-template-columns: 1fr !important; gap: 12px !important; } }`}</style>
      </main>
      <Footer lang={lang} />
      <StickyCta lang={lang} />
    </>
  );
}
