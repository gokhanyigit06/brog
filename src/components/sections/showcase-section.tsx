"use client";

import { useEffect, useState, useRef } from "react";
import { getShowcaseContent, type ShowcaseContent, type ShowcaseMediaItem } from "@/lib/content";

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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getShowcaseContent().then(setContent);
  }, []);

  const items: ShowcaseMediaItem[] = (content?.mediaItems ?? [])
    .slice()
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (items.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [items.length]);

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
          <div className="flex-1 flex flex-col justify-center">
            {/* Label */}
            <p style={{ fontSize: 13, letterSpacing: "0.08em", color: "#6b7280", fontWeight: 500, marginBottom: 20, textTransform: "uppercase" }}>
              {content?.label ?? "01 — Our Commitment"}
            </p>

            {/* Title */}
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 800, lineHeight: 1.1, color: "#0a0a0a", marginBottom: 24, letterSpacing: "-0.02em" }}>
              {title ?? (lang === "tr" ? "Her projede tutarlı kalite, yenilikçi tasarım" : "Consistent quality in every project, innovative Design")}
            </h2>

            {/* Description */}
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4b5563", marginBottom: 48, maxWidth: 520 }}>
              {desc ?? (lang === "tr" ? "Tasarımın amaca buluştuğu dijital deneyimler yaratıyoruz." : "We create digital experiences where design meets purpose.")}
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[
                { value: content?.stat1_value ?? "120+", label: stat1lbl ?? "Projects" },
                { value: content?.stat2_value ?? "98%",  label: stat2lbl ?? "Retention" },
                { value: content?.stat3_value ?? "5+",   label: stat3lbl ?? "Years" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, color: "#0a0a0a", lineHeight: 1, letterSpacing: "-0.02em" }}>
                    {value}
                  </p>
                  <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6, fontWeight: 500 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
