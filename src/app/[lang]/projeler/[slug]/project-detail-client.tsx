"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjectBySlug, getProjects, slugify, type Project, type ProjectBlock } from "@/lib/content";

/* ────────────────────────────────────────────────────────
   Media renderer (image or video)
──────────────────────────────────────────────────────── */
function Media({ url, alt = "" }: { url: string; alt?: string }) {
  if (!url) return <div style={{ width: "100%", height: "100%", background: "#e5e7eb" }} />;
  const isVideo = /\.(mp4|webm|mov)$/i.test(url);
  return isVideo ? (
    <video src={url} autoPlay muted loop playsInline
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  ) : (
    <img src={url} alt={alt}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  );
}

/* ────────────────────────────────────────────────────────
   Content block renderer
──────────────────────────────────────────────────────── */
function Block({ block, lang }: { block: ProjectBlock; lang: string }) {
  switch (block.type) {

    /* ── 16:9 image ── */
    case "image_16_9":
      return (
        <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", background: "#e5e7eb" }}>
          <Media url={block.url} />
        </div>
      );

    /* ── Text block (left label / right body) ── */
    case "text_block": {
      const title = lang === "tr" ? block.title_tr : block.title_en;
      const body  = lang === "tr" ? block.body_tr  : block.body_en;
      // Only render if there's something to show
      if (!title && !body && !block.label) return null;
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 64, padding: "80px 0", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ paddingTop: 4 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {block.label}
            </p>
          </div>
          <div>
            {title && (
              <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: "#0a0a0a", marginBottom: 28, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                {title}
              </h2>
            )}
            <div style={{ color: "#374151", fontSize: 16, lineHeight: 1.85 }}>
              {body?.split("\n\n").map((p, i) => (
                <p key={i} style={{ marginBottom: 18 }}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      );
    }

    /* ── Gallery: 1 big + 2 small ── */
    case "gallery": {
      const bigEl = (
        <div style={{ borderRadius: 16, overflow: "hidden", background: "#e5e7eb", height: "100%" }}>
          <Media url={block.big} />
        </div>
      );
      const smallStack = (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
          <div style={{ flex: 1, borderRadius: 16, overflow: "hidden", background: "#e5e7eb" }}>
            <Media url={block.small1} />
          </div>
          <div style={{ flex: 1, borderRadius: 16, overflow: "hidden", background: "#e5e7eb" }}>
            <Media url={block.small2} />
          </div>
        </div>
      );
      return (
        <div style={{ display: "grid", gridTemplateColumns: block.layout === "left_big" ? "2fr 1fr" : "1fr 2fr", gap: 12, height: 580 }}>
          {block.layout === "left_big" ? <>{bigEl}{smallStack}</> : <>{smallStack}{bigEl}</>}
        </div>
      );
    }

    /* ── Single image with custom ratio ── */
    case "single_image": {
      const [w, h] = (block.ratio || "16:9").split(":").map(Number);
      const ratio = w && h ? `${w}/${h}` : "16/9";
      return (
        <div style={{ width: "100%", aspectRatio: ratio, borderRadius: 16, overflow: "hidden", background: "#e5e7eb" }}>
          <Media url={block.url} />
        </div>
      );
    }

    default:
      return null;
  }
}

/* ────────────────────────────────────────────────────────
   Metadata row
──────────────────────────────────────────────────────── */
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ borderTop: "1px solid #e5e7eb", padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, color: "#9ca3af" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#0a0a0a" }}>{value}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Mini project card (More Works)
──────────────────────────────────────────────────────── */
function MiniCard({ project, lang }: { project: Project; lang: string }) {
  const [hovered, setHovered] = useState(false);
  const slug = project.slug || slugify(project.brandName || project.title || "");
  return (
    <Link href={`/${lang}/projeler/${slug}`} style={{ display: "block", textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: "relative", width: "100%", height: 480, borderRadius: 16, overflow: "hidden", background: "#111" }}
      >
        {project.imageUrl && (
          <img src={project.imageUrl} alt={project.brandName}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.7s cubic-bezier(.4,0,.2,1)" }} />
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "rgba(5,5,5,0.88)", padding: "20px 24px",
        }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{project.category}</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>{project.brandName || project.title}</p>
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────
   Main page component
──────────────────────────────────────────────────────── */
interface Props { slug: string; lang: string }

export default function ProjectDetailClient({ slug, lang }: Props) {
  const [project, setProject] = useState<Project | null>(null);
  const [others, setOthers]   = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjectBySlug(slug), getProjects()]).then(([p, all]) => {
      setProject(p);
      setOthers(all.filter((x) => x.id !== p?.id && x.id !== slug).slice(0, 2));
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <main style={{ background: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #e5e7eb", borderTopColor: "#0a0a0a", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );

  if (!project) return (
    <main style={{ background: "#fff", minHeight: "100vh", paddingTop: 140, textAlign: "center" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0a0a0a" }}>Proje bulunamadı</h1>
      <Link href={`/${lang}/projeler`} style={{ color: "#6b7280", fontSize: 14, marginTop: 16, display: "block" }}>← Tüm Projeler</Link>
    </main>
  );

  const desc     = lang === "tr" ? project.description_tr : project.description_en;
  const industry = lang === "tr" ? project.industry_tr    : project.industry_en;

  return (
    <main style={{ background: "#ffffff", minHeight: "100vh", paddingTop: 110 }}>

      {/* ═══════════════════════════════════════
          HEADER — title + meta
      ═══════════════════════════════════════ */}
      <div className="section-container" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 4fr", gap: 80, alignItems: "start" }}>

          {/* Left — title + link only */}
          <div>
            <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0a0a0a", lineHeight: 1, marginBottom: 28 }}>
              {project.brandName || project.title}
            </h1>
            {project.link && (
              <a
                href={project.link} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1.5px solid #0a0a0a", borderRadius: 999, padding: "10px 22px", fontSize: 14, fontWeight: 600, color: "#0a0a0a", textDecoration: "none", transition: "background 0.2s, color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#0a0a0a"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
              >
                {lang === "tr" ? "Canlı Site" : "Live Website"}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
          </div>

          {/* Right — description on top, then metadata rows */}
          <div style={{ paddingTop: 8 }}>
            {desc && (
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "#374151", marginBottom: 28 }}>{desc}</p>
            )}
            {project.year     && <MetaRow label={lang === "tr" ? "Yıl"           : "Year"}          value={project.year} />}
            {industry         && <MetaRow label={lang === "tr" ? "Sektör"        : "Industry"}       value={industry} />}
            {project.category && <MetaRow label={lang === "tr" ? "Çalışma Alanı" : "Space of work"} value={project.category} />}
            {project.timeline && <MetaRow label={lang === "tr" ? "Süre"          : "Timeline"}       value={project.timeline} />}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CONTENT BLOCKS
      ═══════════════════════════════════════ */}
      {(project.blocks ?? []).length > 0 && (
        <div className="section-container" style={{ paddingBottom: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {(project.blocks ?? []).map((block, i) => (
            <Block key={i} block={block} lang={lang} />
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════
          MORE WORKS
      ═══════════════════════════════════════ */}
      {others.length > 0 && (
        <div className="section-container" style={{ paddingTop: 100, paddingBottom: 100 }}>
          <h2 style={{ fontSize: "clamp(36px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0a0a0a", marginBottom: 32 }}>
            {lang === "tr" ? "Diğer Çalışmalar" : "More works"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {others.map(p => <MiniCard key={p.id} project={p} lang={lang} />)}
          </div>
        </div>
      )}

    </main>
  );
}
