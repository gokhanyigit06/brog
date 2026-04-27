"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getProjects, slugify, type Project } from "@/lib/content";

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
   Single project card with expanding bottom bar
───────────────────────────────────────────────────── */
function ProjectCard({ project, lang }: { project: Project; lang: string }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (hovered) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }, [hovered]);

  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        height: 800,
        borderRadius: 16,
        overflow: "hidden",
        cursor: project.link ? "pointer" : "default",
        background: "#111",
      }}
    >
      {/* ── Cover media ── */}
      {project.videoUrl ? (
        <video
          ref={videoRef}
          src={project.videoUrl}
          muted
          loop
          playsInline
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      ) : project.imageUrl ? (
        <img
          src={project.imageUrl}
          alt={project.brandName}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "#1a1a1a" }} />
      )}

      {/* ── Bottom info bar (expands on hover) ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(5,5,5,0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          height: hovered ? 118 : 72,
          transition: "height 0.45s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 32px",
          gap: 0,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 6,
          }}
        >
          {project.category}
        </span>
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            display: "block",
          }}
        >
          {project.brandName || project.title}
        </span>
        {/* Year — slides in when bar expands */}
        <span
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: "rgba(255,255,255,0.45)",
            display: "block",
            marginTop: 8,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s",
          }}
        >
          {project.year}
        </span>
      </div>

      {/* ── Arrow indicator (top-right) ── */}
      {project.link && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(0.8)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 13L13 3M13 3H6M13 3V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );

  const slug = project.slug || slugify(project.brandName || project.title || "");
  return (
    <Link href={`/${lang}/projeler/${slug}`} style={{ display: "block", textDecoration: "none" }}>
      {card}
    </Link>
  ) : (
    <div>{card}</div>
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

  return (
    <main style={{ background: "#ffffff", minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div style={{ paddingTop: 140, paddingBottom: 64, textAlign: "center" }}>
        <p style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#9ca3af",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 20,
        }}>
          {lang === "tr" ? "Tüm Çalışmalar" : "Explore All Creations"}
        </p>
        <h1 style={{
          fontSize: "clamp(56px, 9vw, 120px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 0.9,
          color: "#0a0a0a",
        }}>
          {lang === "tr" ? "Seçilmiş\nÇalışmalar" : "Selected\nWorks"}
        </h1>
      </div>

      {/* ── Project list ── */}
      <div className="section-container" style={{ paddingBottom: 120 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "2px solid #e5e7eb",
              borderTopColor: "#0a0a0a",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sorted.map((project) => (
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
