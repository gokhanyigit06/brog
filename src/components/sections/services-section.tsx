"use client";

import { useEffect, useState } from "react";
import { getServicesContent, type ServicesContent, type ServiceItem } from "@/lib/content";
import { useSiteConfig } from "@/hooks/use-site-config";

interface Props { lang: string }

export default function ServicesSection({ lang }: Props) {
  const [content, setContent] = useState<ServicesContent | null>(null);
  const config = useSiteConfig();

  useEffect(() => { getServicesContent().then(setContent); }, []);

  // Visibility check — default true until config loads
  if (config && !config.showServices) return null;

  const title = lang === "tr" ? content?.title_tr : content?.title_en;
  const items = [...(content?.items ?? [])].sort((a, b) => a.order - b.order);

  const fallbackItems: ServiceItem[] = [
    { id: "1", title_tr: "Art Direction", title_en: "Art Direction", description_tr: "Markanızın görsel hikayesini tanımlayan yaratıcı sanat yönetimi.", description_en: "Creative and cohesive art direction that defines your brand's visual story.", pills: ["Visual Concept", "Style Development", "Campaign Art", "Creative Direction", "Photography"], order: 0 },
    { id: "2", title_tr: "Brand Identity", title_en: "Brand Identity", description_tr: "Temel değerlerinizi yansıtan ayırt edici marka kimliği.", description_en: "Distinctive branding that reflects your core values and connects with your audience.", pills: ["Animation Strategy", "Storyboarding", "2D / 3D Motion", "Visual Effects", "Transitions"], order: 1 },
    { id: "3", title_tr: "Motion Direction", title_en: "Motion Direction", description_tr: "Görsellerinize hayat ve duygu katan dinamik hareket tasarımı.", description_en: "Dynamic motion design that adds life and emotion to your visuals.", pills: ["Visual Concept", "Style Development", "Campaign Art"], order: 2 },
    { id: "4", title_tr: "Web Geliştirme", title_en: "Web Development", description_tr: "Etkilemek için tasarlanmış yüksek performanslı web siteleri.", description_en: "Modern, high-performance websites built to impress.", pills: ["Responsive Design", "CMS Integration", "SEO Optimization", "Performance Tuning"], order: 3 },
  ];

  const displayItems = items.length > 0 ? items : fallbackItems;

  return (
    <section style={{ background: "#0d0d0d", width: "100%" }}>
      <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500, letterSpacing: "0.06em", marginBottom: 24 }}>
            ({content?.label ?? "04"}) Our Services
          </p>
          <h2 style={{
            fontSize: "clamp(64px, 9vw, 120px)",
            fontWeight: 900,
            lineHeight: 0.92,
            color: "#ffffff",
            letterSpacing: "-0.04em",
          }}>
            {title ?? (lang === "tr" ? "Hizmetler" : "Services")}
          </h2>
        </div>

        {/* ── Separator ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: 0 }} />

        {/* ── Service Rows ── */}
        {displayItems.map((item, idx) => {
          const ititle = lang === "tr" ? item.title_tr : item.title_en;
          const idesc  = lang === "tr" ? item.description_tr : item.description_en;
          const num    = String(idx + 1).padStart(2, "0");

          return (
            <div key={item.id}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "72px 1fr 1fr",
                gap: 32,
                alignItems: "start",
                padding: "48px 0",
              }}>
                {/* Number */}
                <span style={{ fontSize: 16, color: "#ffffff", fontWeight: 600, paddingTop: 4 }}>
                  {num}
                </span>

                {/* Title + Description */}
                <div>
                  <h3 style={{ fontSize: 25, fontWeight: 700, color: "#ffffff", marginBottom: 14, lineHeight: 1.2 }}>
                    {ititle}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.75)", maxWidth: 420 }}>
                    {idesc}
                  </p>
                </div>

                {/* Pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 4 }}>
                  {(item.pills ?? []).map((pill) => (
                    <span
                      key={pill}
                      style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        border: "1px solid rgba(255,255,255,0.25)",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#ffffff",
                        letterSpacing: "0.02em",
                        lineHeight: 1,
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Row separator */}
              {idx < displayItems.length - 1 && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
