"use client";

import { useEffect, useState } from "react";
import { getWhyContent, type WhyContent } from "@/lib/content";
import { useSiteConfig } from "@/hooks/use-site-config";

interface Props { lang: string }

export default function WhySection({ lang }: Props) {
  const [content, setContent] = useState<WhyContent | null>(null);
  const config = useSiteConfig();

  useEffect(() => { getWhyContent().then(setContent); }, []);

  if (config && !config.showWhy) return null;

  const title    = lang === "tr" ? content?.title_tr    : content?.title_en;
  const features = [...(content?.features ?? [])].sort((a, b) => a.order - b.order);

  return (
    <section className="w-full bg-white">
      <div className="section-container py-20 lg:py-28">

        {/* ── TOP ROW: label + title (left) | media box (right) ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 64 }}>
          <div style={{ flex: 1 }}>
            {/* Label */}
            <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 20, letterSpacing: "0.06em" }}>
              ({content?.label ?? "03"}) Why Choose Brog
            </p>

            {/* Massive title */}
            <h2 style={{
              fontSize: "clamp(56px, 8vw, 108px)",
              fontWeight: 900,
              lineHeight: 0.95,
              color: "#0a0a0a",
              letterSpacing: "-0.04em",
            }}>
              {title ?? (lang === "tr" ? "Neden Biz?" : "Why Brog?")}
            </h2>
          </div>

          {/* Media box: 250×170 */}
          {content?.mediaUrl ? (
            <div style={{ width: 250, height: 170, borderRadius: 10, overflow: "hidden", flexShrink: 0, marginLeft: 40, marginTop: 8, background: "#e5e7eb" }}>
              {content.mediaType === "video" ? (
                <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                  <source src={content.mediaUrl} />
                </video>
              ) : (
                <img src={content.mediaUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )}
            </div>
          ) : (
            /* Placeholder */
            <div style={{ width: 250, height: 170, borderRadius: 10, background: "#f3f4f6", flexShrink: 0, marginLeft: 40, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Medya ekleyin</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #e5e7eb", marginBottom: 56 }} />

        {/* ── FEATURES GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
          {(features.length > 0 ? features : [
            { id: "1", icon: "✦", title_tr: "Strateji &\nAraştırma", title_en: "Strategy &\nResearch", description_tr: "Özelleştirilmiş stratejiler geliştirip derinlemesine araştırmalar yaparak kritik içgörüleri ortaya çıkarıyoruz.", description_en: "We begin by shaping tailored strategies and performing in-depth research to reveal critical insights.", order: 0 },
            { id: "2", icon: "◎", title_tr: "Tasarım &\nPrototip", title_en: "Design &\nPrototype", description_tr: "Fikirleri ilgi çekici tasarımlara ve işlevsel prototiplere dönüştürerek vizyonunuzu hayata geçiriyoruz.", description_en: "We transform ideas into engaging designs and functional prototypes that bring your vision to life.", order: 1 },
            { id: "3", icon: "▦", title_tr: "Geliştir, Test Et &\nOptimize Et", title_en: "Build, Test &\nOptimize", description_tr: "Güvenilir çözümler üretir, kapsamlı testler yapar ve en iyi performans için ince ayar yapıyoruz.", description_en: "We craft reliable solutions, perform thorough testing, and fine-tune for top performance.", order: 2 },
            { id: "4", icon: "↗", title_tr: "Lansman &\nDestek", title_en: "Launch &\nSupport", description_tr: "Hassasiyetle lansman yapıyor ve ürününüzün büyümesine yardımcı olmak için sürekli destek sağlıyoruz.", description_en: "We launch with precision and provide ongoing support to help your product grow.", order: 3 },
          ]).map((f) => {
            const ftitle = lang === "tr" ? f.title_tr : f.title_en;
            const fdesc  = lang === "tr" ? f.description_tr : f.description_en;
            return (
              <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Icon */}
                <div style={{ fontSize: 22, color: "#0a0a0a", lineHeight: 1, fontWeight: 400 }}>
                  {f.icon}
                </div>
                {/* Title — bold, preserves newlines */}
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0a0a0a", lineHeight: 1.3, whiteSpace: "pre-line", margin: 0 }}>
                  {ftitle}
                </h3>
                {/* Description */}
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#4b5563", margin: 0 }}>
                  {fdesc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
