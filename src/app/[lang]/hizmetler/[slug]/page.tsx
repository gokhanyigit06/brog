import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import StickyCta from "@/components/site/sticky-cta";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import BrowserMockup from "@/components/ui/browser-mockup";
import { getProjects, getProjectsForService, slugify, type Project, type ServiceItem } from "@/lib/content";
import { getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/types/blog";
import { SERVICE_DETAILS, getServiceDetail } from "./service-content";

export const revalidate = 60; // ISR: 60 sn önbellek — admin değişiklikleri en geç 1 dk içinde yansır
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

export function generateStaticParams() {
  return SERVICE_DETAILS.flatMap((s) => [
    { lang: "tr", slug: s.slug },
    { lang: "en", slug: s.slug },
  ]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const d = getServiceDetail(slug);
  if (!d) return { title: "Hizmet | Vogolab" };
  const tr = lang === "tr";
  const title = tr ? d.metaTitle_tr : d.metaTitle_en;
  const description = tr ? d.metaDesc_tr : d.metaDesc_en;
  const url = `${SITE_URL}/${lang}/hizmetler/${slug}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Vogolab", type: "website", locale: tr ? "tr_TR" : "en_US", images: [{ url: "/og-teklif.jpg", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description },
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

const eyebrowStyle: React.CSSProperties = {
  fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20,
};

const h2Style: React.CSSProperties = {
  fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.03em", color: "#0a0a0a", maxWidth: 820, margin: 0,
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;
  const d = getServiceDetail(slug);
  if (!d) notFound();
  const tr = lang === "tr";

  let projects: Project[] = [];
  let posts: BlogPost[] = [];
  try { [projects, posts] = await Promise.all([getProjects(), getAllPosts(true)]); } catch {}

  const refs = getProjectsForService({ matchTags: d.matchTags } as ServiceItem, projects).slice(0, 3);
  const relatedPosts = posts
    .filter((p) => {
      const hay = [ ...(p.tags || []), p.title?.tr || "", p.title?.en || "" ].join(" ").toLowerCase();
      return d.blogTokens.some((t) => hay.includes(t));
    })
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: tr ? d.nav_tr : d.nav_en,
        description: tr ? d.metaDesc_tr : d.metaDesc_en,
        provider: { "@type": "Organization", name: "Vogolab", url: SITE_URL },
        areaServed: [{ "@type": "City", name: "Ankara" }, { "@type": "Country", name: "Türkiye" }],
        url: `${SITE_URL}/${lang}/hizmetler/${slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: tr ? "Hizmetler" : "Services", item: `${SITE_URL}/${lang}/hizmetler` },
          { "@type": "ListItem", position: 2, name: tr ? d.nav_tr : d.nav_en, item: `${SITE_URL}/${lang}/hizmetler/${slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: d.faq.map((f) => ({
          "@type": "Question",
          name: tr ? f.q_tr : f.q_en,
          acceptedAnswer: { "@type": "Answer", text: tr ? f.a_tr : f.a_en },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar lang={lang} lightBg />
      <main style={{ background: "#fff", minHeight: "100vh" }}>

        {/* ── Hero ── */}
        <section className="section-container" style={{ paddingTop: 150, paddingBottom: 72 }}>
          <p style={{ fontSize: 13, marginBottom: 18 }}>
            <Link href={`/${lang}/hizmetler`} style={{ color: "#9ca3af", textDecoration: "none" }}>
              {tr ? "Hizmetler" : "Services"}
            </Link>
            <span style={{ color: "#d1d5db", margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>{tr ? d.nav_tr : d.nav_en}</span>
          </p>
          <h1 style={{ fontSize: "clamp(40px, 6.5vw, 92px)", fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.04em", color: "#0a0a0a", maxWidth: 1000, margin: 0 }}>
            {tr ? d.h1_tr : d.h1_en}
          </h1>
          <p style={{ fontSize: "clamp(16px, 1.5vw, 20px)", lineHeight: 1.65, color: "#4b5563", maxWidth: 640, marginTop: 26 }}>
            {tr ? d.intro_tr : d.intro_en}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}>
            <Link href={`/${lang}/teklif`} style={accentPill}>{tr ? "Ücretsiz Teklif Al ↗" : "Get a Free Quote ↗"}</Link>
            <Link href={`/${lang}/projeler`} style={{ ...accentPill, background: "transparent", color: "#0a0a0a", border: "1px solid #d1d5db" }}>
              {tr ? "İşlerimizi Gör" : "See Our Work"}
            </Link>
          </div>
        </section>

        {/* ── İdeal nasıl olmalı ── */}
        <section style={{ background: "#f6f7f9", width: "100%" }}>
          <div className="section-container" style={{ paddingTop: 88, paddingBottom: 88 }}>
            <RevealOnScroll>
              <p style={eyebrowStyle}>{tr ? "Standartlarımız" : "Our Standards"}</p>
              <h2 style={{ ...h2Style, marginBottom: 52 }}>{tr ? d.idealTitle_tr : d.idealTitle_en}</h2>
            </RevealOnScroll>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: 20 }}>
              {d.ideals.map((it, i) => (
                <RevealOnScroll key={it.t_tr} delay={i * 0.05}>
                  <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "28px 26px", height: "100%" }}>
                    <div style={{ fontSize: 26, lineHeight: 1, marginBottom: 16 }}>{it.icon}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0a0a0a", margin: 0, letterSpacing: "-0.01em" }}>{tr ? it.t_tr : it.t_en}</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#4b5563", marginTop: 10 }}>{tr ? it.d_tr : it.d_en}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── Avantajlar ── */}
        <section className="section-container" style={{ paddingTop: 96, paddingBottom: 72 }}>
          <RevealOnScroll>
            <p style={eyebrowStyle}>{tr ? "Neden Önemli" : "Why It Matters"}</p>
            <h2 style={{ ...h2Style, marginBottom: 48 }}>{tr ? d.advTitle_tr : d.advTitle_en}</h2>
          </RevealOnScroll>
          <div>
            {d.advantages.map((a, i) => (
              <RevealOnScroll key={a.t_tr} delay={i * 0.04}>
                <div className="sd-adv" style={{ display: "grid", gridTemplateColumns: "72px 320px 1fr", gap: 24, alignItems: "start", borderTop: "1px solid #e5e7eb", padding: "30px 0" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--accent)", paddingTop: 3 }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontSize: 21, fontWeight: 800, color: "#0a0a0a", margin: 0, letterSpacing: "-0.015em" }}>{tr ? a.t_tr : a.t_en}</h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#4b5563", margin: 0, maxWidth: 560 }}>{tr ? a.d_tr : a.d_en}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* ── Kimler için ── */}
        <section className="section-container" style={{ paddingTop: 24, paddingBottom: 88 }}>
          <RevealOnScroll>
            <p style={eyebrowStyle}>{tr ? "Kapsam" : "Scope"}</p>
            <h2 style={{ ...h2Style, marginBottom: 44 }}>{tr ? d.useTitle_tr : d.useTitle_en}</h2>
          </RevealOnScroll>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))", gap: 20 }}>
            {d.useCases.map((u, i) => (
              <RevealOnScroll key={u.t_tr} delay={i * 0.05}>
                <div style={{ borderLeft: "3px solid var(--accent)", background: "#f6f7f9", borderRadius: "0 14px 14px 0", padding: "24px 26px", height: "100%" }}>
                  <h3 style={{ fontSize: 17.5, fontWeight: 800, color: "#0a0a0a", margin: 0 }}>{tr ? u.t_tr : u.t_en}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#4b5563", marginTop: 8 }}>{tr ? u.d_tr : u.d_en}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* ── Süreç ── */}
        <section style={{ background: "#0d0d0d", width: "100%" }}>
          <div className="section-container" style={{ paddingTop: 88, paddingBottom: 88 }}>
            <RevealOnScroll>
              <p style={{ ...eyebrowStyle, color: "rgba(255,255,255,0.45)" }}>{tr ? "Süreç" : "Process"}</p>
              <h2 style={{ ...h2Style, color: "#fff", marginBottom: 52 }}>{tr ? d.stepsTitle_tr : d.stepsTitle_en}</h2>
            </RevealOnScroll>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 36 }}>
              {d.steps.map((s, i) => (
                <RevealOnScroll key={s.t_tr} delay={i * 0.06}>
                  <div style={{ borderTop: "2px solid var(--accent)", paddingTop: 20 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 style={{ fontSize: 19, fontWeight: 800, color: "#fff", margin: "10px 0 0" }}>{tr ? s.t_tr : s.t_en}</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(255,255,255,0.65)", marginTop: 10 }}>{tr ? s.d_tr : s.d_en}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── Referanslar ── */}
        {refs.length > 0 && (
          <section className="section-container" style={{ paddingTop: 96, paddingBottom: 48 }}>
            <RevealOnScroll>
              <p style={eyebrowStyle}>{tr ? "Referanslar" : "References"}</p>
              <h2 style={{ ...h2Style, marginBottom: 44 }}>{tr ? "Bu alanda ürettiğimiz işler." : "Work we've delivered in this field."}</h2>
            </RevealOnScroll>
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
            <Link href={`/${lang}/projeler`} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 28, fontSize: 14, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>
              {tr ? "Tüm projeleri gör ↗" : "See all projects ↗"}
            </Link>
          </section>
        )}

        {/* ── SSS ── */}
        <section className="section-container" style={{ paddingTop: 72, paddingBottom: 88 }}>
          <RevealOnScroll>
            <p style={eyebrowStyle}>{tr ? "Sık Sorulanlar" : "FAQ"}</p>
            <h2 style={{ ...h2Style, marginBottom: 40 }}>{tr ? "Aklınıza takılanlar." : "Common questions."}</h2>
          </RevealOnScroll>
          <div style={{ maxWidth: 860 }}>
            {d.faq.map((f, i) => (
              <RevealOnScroll key={f.q_tr} delay={i * 0.04}>
                <div style={{ borderTop: "1px solid #e5e7eb", padding: "26px 0" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0a0a0a", margin: 0 }}>{tr ? f.q_tr : f.q_en}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4b5563", marginTop: 10, margin: "10px 0 0" }}>{tr ? f.a_tr : f.a_en}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* ── İlgili yazılar ── */}
        {relatedPosts.length > 0 && (
          <section style={{ background: "#f6f7f9", width: "100%" }}>
            <div className="section-container" style={{ paddingTop: 80, paddingBottom: 88 }}>
              <RevealOnScroll>
                <p style={eyebrowStyle}>Blog</p>
                <h2 style={{ ...h2Style, marginBottom: 44 }}>{tr ? "Bu konuda yazdıklarımız." : "What we've written on this."}</h2>
              </RevealOnScroll>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: 32 }}>
                {relatedPosts.map((p) => {
                  const title = (tr ? p.title?.tr : p.title?.en) || p.title?.tr || "";
                  return (
                    <Link key={p.id} href={`/${lang}/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", borderRadius: 14, overflow: "hidden", background: "#e5e7eb", marginBottom: 16 }}>
                        {p.coverMedia?.url && p.coverMedia.type === "image" && (
                          <Image src={p.coverMedia.url} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                        )}
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0 }}>{title}</h3>
                      <span style={{ display: "inline-block", marginTop: 10, fontSize: 13.5, fontWeight: 600, color: "var(--accent)" }}>{tr ? "Yazıyı oku ↗" : "Read the post ↗"}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Final CTA ── */}
        <section style={{ background: "#0a0a0a", width: "100%" }}>
          <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96, textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(36px, 6vw, 84px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", margin: 0 }}>
              {tr ? "Projenizi konuşalım." : "Let's talk about your project."}
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", marginTop: 20, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
              {tr ? "24 saat içinde size özel bir yol haritası ve fiyat teklifiyle dönelim." : "We'll get back within 24 hours with a tailored roadmap and quote."}
            </p>
            <div style={{ marginTop: 34 }}>
              <Link href={`/${lang}/teklif`} style={accentPill}>{tr ? "Ücretsiz Teklif Al ↗" : "Get a Free Quote ↗"}</Link>
            </div>
          </div>
        </section>

        <style>{`
          @media (max-width: 860px) {
            .sd-adv { grid-template-columns: 1fr !important; gap: 8px !important; }
          }
        `}</style>
      </main>
      <Footer lang={lang} />
      <StickyCta lang={lang} />
    </>
  );
}
