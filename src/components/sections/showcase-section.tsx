"use client";

import { useEffect, useState, useRef } from "react";
import { getShowcaseContent, type ShowcaseContent, type ShowcaseMediaItem } from "@/lib/content";
import { useSiteConfig } from "@/hooks/use-site-config";

interface Props { lang: string }

function MediaSlide({ item, active }: { item: ShowcaseMediaItem; active: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: active ? 1 : 0,
        transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      {item.type === "video" ? (
        <video
          key={item.url}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        >
          <source src={item.url} />
        </video>
      ) : (
        <img
          src={item.url}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
    </div>
  );
}

export default function ShowcaseSection({ lang }: Props) {
  const [content, setContent] = useState<ShowcaseContent | null>(null);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = useSiteConfig();

  useEffect(() => {
    getShowcaseContent().then(setContent);
  }, []);

  const items: ShowcaseMediaItem[] = (content?.mediaItems ?? [])
    .slice()
    .sort((a, b) => a.order - b.order);

  // Per-item duration: uses item.duration (seconds), falls back to 3s
  useEffect(() => {
    if (items.length <= 1) return;
    const ms = (items[current]?.duration ?? 3) * 1000;
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, ms);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, items.length]);

  if (config && !config.showShowcase) return null;

  const title    = lang === "tr" ? content?.title_tr    : content?.title_en;
  const desc     = lang === "tr" ? content?.description_tr : content?.description_en;
  const stat1lbl = lang === "tr" ? content?.stat1_label_tr : content?.stat1_label_en;
  const stat2lbl = lang === "tr" ? content?.stat2_label_tr : content?.stat2_label_en;
  const stat3lbl = lang === "tr" ? content?.stat3_label_tr : content?.stat3_label_en;

  return (
    <section className="w-full bg-white">
      <div className="section-container py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

          {/* ── LEFT: rotating media ── */}
          <div className="flex-shrink-0">
            <div
              style={{
                position: "relative",
                width: 450,
                height: 600,
                borderRadius: 12,
                overflow: "hidden",
                background: "#e5e7eb",
              }}
            >
              {items.length === 0 ? (
                /* Placeholder when no media added */
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14 }}>
                  Medya eklenmedi
                </div>
              ) : (
                items.map((item, i) => (
                  <MediaSlide key={item.id} item={item} active={i === current} />
                ))
              )}

              {/* Progress dots */}
              {items.length > 1 && (
                <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 10 }}>
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      style={{
                        width: i === current ? 20 : 6,
                        height: 6,
                        borderRadius: 3,
                        background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.35s ease",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: text content ── */}
          <div className="flex-1 flex flex-col justify-between" style={{ minHeight: 600 }}>

            <div>
              {/* Label */}
              <p style={{ fontSize: 13, letterSpacing: "0.06em", color: "#6b7280", fontWeight: 500, marginBottom: 28 }}>
                ({content?.label ?? "01"}) {lang === "tr" ? "Taahhüdümüz" : "Our Commitment"}
              </p>

              {/* Title — massive */}
              <h2 style={{
                fontSize: "clamp(42px, 5.5vw, 76px)",
                fontWeight: 900,
                lineHeight: 1.05,
                color: "#0a0a0a",
                letterSpacing: "-0.03em",
                marginBottom: 32,
              }}>
                {title ?? (lang === "tr"
                  ? "Her projede tutarlı kalite, yenilikçi tasarım"
                  : "Consistent quality in every project, blending innovative Design")}
              </h2>

              {/* Description */}
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "#374151", maxWidth: 560 }}>
                {desc ?? (lang === "tr"
                  ? "Tasarımın amaca buluştuğu dijital deneyimler yaratıyoruz — yenilik ile netliği harmanlıyoruz. Her etkileşim kusursuz, sezgisel ve anlamlı hissettirmek için tasarlanır."
                  : "We create digital experiences where design meets purpose — blending innovation with clarity. Every interaction is crafted to feel seamless, intuitive, and meaningful.")}
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 56, flexWrap: "wrap", paddingTop: 48, borderTop: "1px solid #e5e7eb", marginTop: 48 }}>
              {[
                { value: content?.stat1_value ?? "190",  label: stat1lbl ?? "Client Revenue" },
                { value: content?.stat2_value ?? "92",   label: stat2lbl ?? "Client Retention" },
                { value: content?.stat3_value ?? "32%",  label: stat3lbl ?? "Individuals Rate" },
              ].map(({ value, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    fontSize: "clamp(48px, 5vw, 68px)",
                    fontWeight: 900,
                    color: "#0a0a0a",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}>
                    {value}
                  </span>
                  <span style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.4, maxWidth: 72, fontWeight: 500 }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
