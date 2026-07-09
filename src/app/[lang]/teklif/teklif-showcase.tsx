"use client";

import Link from "next/link";
import { slugify, type Project, type TeklifShowcaseContent } from "@/lib/content";
import BrowserMockup from "@/components/ui/browser-mockup";
import ServiceTags from "@/components/ui/service-tags";

interface Props {
  lang: string;
  content: TeklifShowcaseContent;
  projects: Project[];   // tüm projeler (id ile çözümlemek için)
  featured: Project[];   // vitrin boşsa yedek
}

interface Row {
  project: Project;
  cover: string;
  video?: string;
}

function resolveSlug(p: Project): string {
  const raw = p.slug;
  return (raw && !raw.includes(".") && !raw.startsWith("http")) ? raw : slugify(p.brandName || p.title || "");
}

/* Ana sayfadaki proje kartıyla aynı görünüm (2 sütun grid kartı) */
function ShowcaseCard({ row, lang }: { row: Row; lang: string }) {
  const { project, cover, video } = row;

  return (
    <Link href={`/${lang}/projeler/${resolveSlug(project)}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <BrowserMockup
          imageUrl={cover}
          videoUrl={video}
          link={project.link}
          alt={`${project.brandName} — ${project.category}`}
          sizes="(max-width: 768px) 100vw, 50vw"
          ratio="16 / 10"
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, padding: "0 2px" }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.01em" }}>
            {project.brandName || project.title}
          </span>
          <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 400, flexShrink: 0 }}>
            {project.year}
          </span>
        </div>
        <ServiceTags tags={project.tags} category={project.category} />
      </div>
    </Link>
  );
}

export default function TeklifShowcase({ lang, content, projects, featured }: Props) {
  const items = [...(content.items || [])].sort((a, b) => a.order - b.order);

  let rows: Row[];
  if (items.length > 0) {
    rows = items
      .map((it) => {
        const p = projects.find((pp) => pp.id === it.projectId);
        if (!p) return null;
        return { project: p, cover: it.coverUrl || p.imageUrl || p.listingImageUrl || "", video: p.videoUrl } as Row;
      })
      .filter(Boolean) as Row[];
  } else {
    rows = featured.slice(0, 6).map((p) => ({ project: p, cover: p.imageUrl || p.listingImageUrl || "", video: p.videoUrl }));
  }

  if (rows.length === 0) return null;

  return (
    <section style={{ background: "#fff", width: "100%" }}>
      <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96 }}>
        {/* Başlık */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 56, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
              {content.label || "Referanslar"}
            </p>
            <h2 style={{ fontSize: "clamp(40px, 6vw, 84px)", fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.04em", color: "#0a0a0a", margin: 0 }}>
              {content.title_tr || "Seçili işlerimiz"}
            </h2>
          </div>
          <Link
            href={`/${lang}/projeler`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1.5px solid #0a0a0a", borderRadius: 999, padding: "12px 26px", fontSize: 13, fontWeight: 600, color: "#0a0a0a", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}
          >
            Tümünü Gör <span style={{ fontSize: 15 }}>↗</span>
          </Link>
        </div>

        {/* Ana sayfadaki gibi 2 sütunlu grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 440px), 1fr))", columnGap: 40, rowGap: 56 }}>
          {rows.map((row) => (
            <ShowcaseCard key={row.project.id} row={row} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
