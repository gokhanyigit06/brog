"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getProjects, slugify, type Project } from "@/lib/content";
import BrowserMockup from "@/components/ui/browser-mockup";
import ServiceTags from "@/components/ui/service-tags";

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
  const [failed, setFailed] = useState(false);

  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    // Bağlantı takılırsa asla sahte proje gösterme — kısa aralıklarla yeniden dene
    async function load(attempt = 0) {
      try {
        const data = await getProjects();
        if (!cancelled) { setProjects(data); setLoading(false); setFailed(false); }
      } catch {
        if (cancelled) return;
        if (attempt < 3) setTimeout(() => load(attempt + 1), 2000);
        else { setLoading(false); setFailed(true); }
      }
    }
    load();
    return () => { cancelled = true; };
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
        ) : failed ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#6b7280", fontSize: 15 }}>
            {lang === "tr" ? "Projeler şu an yüklenemedi — lütfen sayfayı yenileyin." : "Projects couldn't load right now — please refresh the page."}
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
