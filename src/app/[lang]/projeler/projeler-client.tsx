"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getProjects, slugify, type Project } from "@/lib/content";
import BrowserMockup from "@/components/ui/browser-mockup";
import ServiceTags from "@/components/ui/service-tags";

/* ─────────────────────────────────────────────────────
   Seed projects — shown when Firestore collection empty
───────────────────────────────────────────────────── */
const SEED: Project[] = [
  { id: "s1", title: "Urban Glow", brandName: "Urban Glow", description_tr: "Modern bir moda markası için bütünleşik kimlik çalışması.", description_en: "Integrated identity work for a modern fashion brand.", imageUrl: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?w=1400&q=80", year: "2025", category: "Brand Identity", tags: ["Branding", "Fashion"], link: "", order: 0, featured: true },
  { id: "s2", title: "Noir Studio", brandName: "Noir Studio", description_tr: "Lüks iç mimarlık stüdyosu için dijital deneyim.", description_en: "Digital experience for a luxury interior architecture studio.", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80", year: "2024", category: "Web Design", tags: ["Web", "Luxury"], link: "", order: 1, featured: false },
  { id: "s3", title: "Soleil", brandName: "Soleil", description_tr: "Güneş enerjisi şirketi için temiz ve minimalist marka kimliği.", description_en: "Clean and minimalist brand identity for a solar energy company.", imageUrl: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1400&q=80", year: "2024", category: "Art Direction", tags: ["Sustainability", "Branding"], link: "", order: 2, featured: true },
  { id: "s4", title: "Mira Collective", brandName: "Mira Collective", description_tr: "Yaratıcı kolektif için kampanya yönetimi ve görsel dil.", description_en: "Campaign management and visual language for a creative collective.", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80", year: "2024", category: "Campaign Art", tags: ["Campaign", "Photography"], link: "", order: 3, featured: false },
  { id: "s5", title: "Atelier Nord", brandName: "Atelier Nord", description_tr: "İskandinav tasarım stüdyosu için kurumsal kimlik.", description_en: "Corporate identity for a Scandinavian design studio.", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=80", year: "2023", category: "Brand Identity", tags: ["Identity", "Minimalism"], link: "", order: 4, featured: false },
  { id: "s6", title: "Pulse Motion", brandName: "Pulse Motion", description_tr: "Spor ekipmanları markası için dinamik hareket tasarımı.", description_en: "Dynamic motion design for a sports equipment brand.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80", year: "2023", category: "Motion Direction", tags: ["Motion", "Sports"], link: "", order: 5, featured: true },
  { id: "s7", title: "Verdant", brandName: "Verdant", description_tr: "Organik gıda markası için sürdürülebilir ambalaj tasarımı.", description_en: "Sustainable packaging design for an organic food brand.", imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=80", year: "2023", category: "Packaging", tags: ["Packaging", "Organic"], link: "", order: 6, featured: false },
  { id: "s8", title: "Obsidian", brandName: "Obsidian", description_tr: "Fintech girişimi için kullanıcı deneyimi ve arayüz tasarımı.", description_en: "UX and interface design for a fintech startup.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80", year: "2022", category: "UI / UX", tags: ["Fintech", "UX"], link: "", order: 7, featured: false },
  { id: "s9", title: "Echo Spaces", brandName: "Echo Spaces", description_tr: "Mimari fotoğrafçılık için kurumsal portfolyo sitesi.", description_en: "Corporate portfolio site for architectural photography.", imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1400&q=80", year: "2022", category: "Web Design", tags: ["Architecture", "Portfolio"], link: "", order: 8, featured: false },
  { id: "s10", title: "Luminary", brandName: "Luminary", description_tr: "Premium mum markası için bütünleşik marka deneyimi.", description_en: "Integrated brand experience for a premium candle brand.", imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1400&q=80", year: "2022", category: "Brand Experience", tags: ["Luxury", "Lifestyle"], link: "", order: 9, featured: false },
];

/* ─────────────────────────────────────────────────────
   Proje kartı — tarayıcı mockup'ı + marka/kategori + hizmet etiketleri
───────────────────────────────────────────────────── */
function ProjectCard({ project, lang }: { project: Project; lang: string }) {
  const category = lang === "tr" ? (project.industry_tr || project.category) : (project.industry_en || project.category);
  const rawSlug = project.slug;
  const slug = (rawSlug && !rawSlug.includes(".") && !rawSlug.startsWith("http"))
    ? rawSlug
    : slugify(project.brandName || project.title || "");

  return (
    <Link href={`/${lang}/projeler/${slug}`} style={{ display: "block", textDecoration: "none" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <BrowserMockup
          imageUrl={project.listingImageUrl || project.imageUrl}
          videoUrl={project.listingVideoUrl}
          link={project.link}
          alt={`${project.brandName} — ${project.category} projesi`}
          sizes="(max-width: 768px) 100vw, 50vw"
          ratio="16 / 10"
        />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, minWidth: 0 }}>
            <span style={{ fontSize: "clamp(22px, 2.4vw, 32px)", fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.02em" }}>
              {project.brandName || project.title}
            </span>
            {category && <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>· {category}</span>}
          </div>
          <span style={{ fontSize: 15, color: "#9ca3af", fontWeight: 500, flexShrink: 0 }}>{project.year}</span>
        </div>
        <ServiceTags tags={project.tags} category={project.category} />
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────
   Scroll-reveal wrapper — fades in when entering viewport
───────────────────────────────────────────────────── */
function RevealOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 } // trigger when just 8% of card is in view
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
        willChange: "opacity",
      }}
    >
      {children}
    </div>
  );
}

interface Props { lang: string }

export default function ProjelerClient({ lang }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data.length > 0 ? data : SEED);
        setLoading(false);
      })
      .catch(() => {
        setProjects(SEED);
        setLoading(false);
      });
  }, []);

  const sorted = [...projects].sort((a, b) => a.order - b.order);

  // Kategori filtreleri — projelerin category alanından türetilir
  const categories = Array.from(new Set(sorted.map((p) => p.category).filter(Boolean)));
  const filtered = active === "all" ? sorted : sorted.filter((p) => p.category === active);

  return (
    <main style={{ background: "#ffffff", minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div style={{ paddingTop: 140, paddingBottom: 48, textAlign: "center" }}>
        <p style={{
          fontSize: 13, fontWeight: 500, color: "#9ca3af",
          letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20,
        }}>
          {lang === "tr" ? "Tüm Çalışmalar" : "Explore All Creations"}
        </p>
        <h1 style={{
          fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 900,
          letterSpacing: "-0.04em", lineHeight: 0.9, color: "#0a0a0a",
        }}>
          {lang === "tr" ? "Seçilmiş\nÇalışmalar" : "Selected\nWorks"}
        </h1>
      </div>

      <div className="section-container" style={{ paddingBottom: 120 }}>
        {/* ── Kategori filtre çubuğu ── */}
        {!loading && categories.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 56 }}>
            {[{ key: "all", label: lang === "tr" ? "Tüm Projeler" : "All Projects" }, ...categories.map((c) => ({ key: c, label: c }))].map((f) => {
              const on = active === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  style={{
                    borderRadius: 999, padding: "9px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                    letterSpacing: "0.01em", transition: "all 0.2s ease",
                    ...(on
                      ? { background: "var(--accent)", color: "var(--accent-ink)", border: "1px solid var(--accent)" }
                      : { background: "transparent", color: "#374151", border: "1px solid #d1d5db" }),
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #e5e7eb", borderTopColor: "#0a0a0a", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 440px), 1fr))", columnGap: 40, rowGap: 64 }}>
            {filtered.map((project) => (
              <RevealOnScroll key={project.id}>
                <ProjectCard project={project} lang={lang} />
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
