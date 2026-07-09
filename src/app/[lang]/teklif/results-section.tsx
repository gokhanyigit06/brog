"use client";

import { scrollToForm } from "./cta-utils";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";

const STATS = [
  { value: "x2", label: "3 ayda ortalama\norganik trafik artışı" },
  { value: "4.5", label: "Ortalama reklam\nROAS'ı" },
  { value: "%40", label: "Sitede ortalama\ndönüşüm artışı" },
];

const TESTIMONIAL = {
  quote:
    "Web sitemizi, reklamlarımızı ve SEO'muzu tek bir ekibe emanet etmek işimizi inanılmaz kolaylaştırdı. Hem tasarım hem de gelen talep sayısı beklentimizin çok üzerinde.",
  name: "Fulya Kale",
  brand: "Neo Maison & Neo Antique",
};

export default function ResultsSection() {
  return (
    <section style={{ background: "#fff", width: "100%" }}>
      <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <RevealOnScroll>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
            Sonuçlar
          </p>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 84px)", fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.04em", color: "#0a0a0a", maxWidth: 900, marginBottom: 56 }}>
            Rakamlarla konuşuyoruz.
          </h2>
        </RevealOnScroll>

        {/* Stat tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 56 }}>
          {STATS.map((s, i) => (
            <RevealOnScroll key={s.label} delay={i * 0.08}>
              <div style={{ borderTop: "2px solid #0a0a0a", paddingTop: 20 }}>
                <div style={{ fontSize: "clamp(48px, 6vw, 76px)", fontWeight: 900, color: "#0a0a0a", lineHeight: 1, letterSpacing: "-0.04em" }}>{s.value}</div>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5, marginTop: 12, whiteSpace: "pre-line" }}>{s.label}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Testimonial */}
        <RevealOnScroll>
          <div style={{ background: "#0d0d0d", borderRadius: 20, padding: "clamp(32px, 5vw, 64px)" }}>
            <p style={{ fontSize: "clamp(20px, 2.6vw, 34px)", fontWeight: 600, color: "#fff", lineHeight: 1.4, letterSpacing: "-0.01em", margin: 0, maxWidth: 900 }}>
              “{TESTIMONIAL.quote}”
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{TESTIMONIAL.name}</span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
              <span style={{ fontSize: 15, color: "rgba(255,255,255,0.6)" }}>{TESTIMONIAL.brand}</span>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div style={{ marginTop: 48 }}>
            <button
              onClick={scrollToForm}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: "none", background: "#0a0a0a", color: "#fff",
                borderRadius: 999, padding: "15px 34px", fontSize: 15, fontWeight: 700,
                cursor: "pointer", transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Siz de büyümeye başlayın <span style={{ fontSize: 16 }}>↗</span>
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
