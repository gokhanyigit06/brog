"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjectsContent, type ProjectsContent, type ProjectItem } from "@/lib/content";
import { useSiteConfig } from "@/hooks/use-site-config";

interface Props { lang: string }

function ProjectCard({ project }: { project: ProjectItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Image container */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          width: "100%",
          height: 680,
          borderRadius: 14,
          overflow: "hidden",
          cursor: project.link ? "pointer" : "default",
          background: "#e5e7eb",
        }}
      >
        {/* Image */}
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.brandName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        )}

        {/* Hover overlay — category */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <span
            style={{
              fontSize: "clamp(18px, 2vw, 26px)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transform: hovered ? "translateY(0)" : "translateY(8px)",
              transition: "transform 0.4s ease",
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            {project.category}
          </span>
        </div>
      </div>

      {/* Below card: brand + year */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#0a0a0a" }}>
          {project.brandName}
        </span>
        <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 400 }}>
          {project.year}
        </span>
      </div>
    </div>
  );
}

export default function ProjectsSection({ lang }: Props) {
  const [content, setContent] = useState<ProjectsContent | null>(null);
  const config = useSiteConfig();

  useEffect(() => {
    getProjectsContent().then(setContent);
  }, []);

  if (config && !config.showProjects) return null;

  const title = lang === "tr" ? content?.title_tr : content?.title_en;
  const desc  = lang === "tr" ? content?.description_tr : content?.description_en;

  const projects = (content?.projects ?? [])
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <section className="w-full bg-white">
      <div className="section-container py-20 lg:py-28">

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 16, letterSpacing: "0.06em" }}>
              ({content?.label ?? "02"}) PROJECTS
            </p>
            <h2 style={{
              fontSize: "clamp(52px, 7vw, 100px)",
              fontWeight: 900,
              lineHeight: 0.95,
              color: "#0a0a0a",
              letterSpacing: "-0.04em",
            }}>
              {title ?? (lang === "tr" ? "Projeler" : "Latest\nWorks")}
            </h2>
          </div>

          {/* Right: desc + link */}
          <div style={{ maxWidth: 380, textAlign: "right", paddingBottom: 8 }}>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4b5563", marginBottom: 20 }}>
              {desc ?? (lang === "tr"
                ? "Kendileri için konuşan dijital ürünler yaratıyoruz."
                : "We craft digital products that speak for themselves — simple, fast, and user-focused. Here's a look at how we turn challenges into seamless design solutions.")}
            </p>
            <Link
              href={content?.viewAllLink ?? "/projects"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #0a0a0a",
                borderRadius: 999,
                padding: "10px 22px",
                fontSize: 13,
                fontWeight: 600,
                color: "#0a0a0a",
                textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#0a0a0a"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
            >
              VIEW ALL WORKS <span style={{ fontSize: 16 }}>↗</span>
            </Link>
          </div>
        </div>

        {/* ── Project Grid ── */}
        {projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af", fontSize: 14 }}>
            Henüz proje eklenmedi — admin panelinden ekleyin
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {projects.map((project) => (
              project.link ? (
                <Link key={project.id} href={project.link} style={{ textDecoration: "none" }}>
                  <ProjectCard project={project} />
                </Link>
              ) : (
                <ProjectCard key={project.id} project={project} />
              )
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
