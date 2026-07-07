"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFeaturedProjects, getProjectsContent, slugify, type Project, type ProjectsContent } from "@/lib/content";
import { useSiteConfig } from "@/hooks/use-site-config";
import BrowserMockup from "@/components/ui/browser-mockup";
import ServiceTags from "@/components/ui/service-tags";

interface Props { lang: string; initialContent?: ProjectsContent | null; initialFeatured?: Project[] }

function ProjectCard({ project }: { project: Project }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BrowserMockup
        imageUrl={project.imageUrl}
        videoUrl={project.videoUrl}
        link={project.link}
        alt={`${project.brandName} — ${project.category} projesi`}
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
  );
}

export default function ProjectsSection({ lang, initialContent, initialFeatured }: Props) {
  const [content, setContent] = useState<ProjectsContent | null>(initialContent ?? null);
  const [featured, setFeatured] = useState<Project[]>(initialFeatured ?? []);
  const config = useSiteConfig();

  useEffect(() => {
    if (initialContent && initialFeatured) return;
    getProjectsContent().then(setContent).catch(() => {});
    getFeaturedProjects().then(setFeatured).catch(() => {});
  }, [initialContent, initialFeatured]);

  if (config && !config.showProjects) return null;

  const STALE_TITLES = ["Seçilmiş Çalışmalar", "Selected Works", "Latest Works", "Latest\nWorks"];
  const rawTitle = lang === "tr" ? content?.title_tr : content?.title_en;
  const title    = rawTitle && !STALE_TITLES.includes(rawTitle) ? rawTitle : null;
  const desc  = lang === "tr" ? content?.description_tr : content?.description_en;

  return (
    <section className="w-full bg-white">
      <div className="section-container py-20 lg:py-28">

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 16, letterSpacing: "0.06em" }}>
              ({content?.label ?? "02"}) {lang === "tr" ? "PROJELER" : "PROJECTS"}
            </p>
            <h2 style={{
              fontSize: "clamp(52px, 7vw, 100px)",
              fontWeight: 900,
              lineHeight: 0.95,
              color: "#0a0a0a",
              letterSpacing: "-0.04em",
            }}>
              {title ?? (lang === "tr" ? "Projeler" : "Projects")}
            </h2>
          </div>

          {/* Right: desc + link */}
          <div style={{ maxWidth: 380, textAlign: "right", paddingBottom: 8 }}>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4b5563", marginBottom: 20 }}>
              {desc ?? (lang === "tr"
                ? "Kendileri için konuşan dijital ürünler yaratıyoruz."
                : "We craft digital products that speak for themselves — simple, fast, and user-focused.")}
            </p>
            <Link
              href={content?.viewAllLink ?? `/${lang}/projeler`}
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
              {lang === "tr" ? "TÜMÜNÜ GÖR" : "VIEW ALL WORKS"} <span style={{ fontSize: 16 }}>↗</span>
            </Link>
          </div>
        </div>

        {/* ── Featured Project Grid ── */}
        {featured.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af", fontSize: 14 }}>
            {lang === "tr"
              ? "Henüz öne çıkan proje yok — admin/projeler'den öne çıkar işaretleyin"
              : "No featured projects yet — mark projects as featured in admin/projeler"}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 440px), 1fr))", columnGap: 40, rowGap: 56 }}>
            {featured.map((project) => {
              const rawSlug = (project as any).slug;
              const slug = (rawSlug && !rawSlug.includes(".") && !rawSlug.startsWith("http"))
                ? rawSlug
                : slugify(project.brandName || project.title || "");
              return (
                <Link key={project.id} href={`/${lang}/projeler/${slug}`} style={{ textDecoration: "none" }}>
                  <ProjectCard project={project} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
