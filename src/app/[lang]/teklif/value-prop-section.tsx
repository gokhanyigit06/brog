"use client";

import Link from "next/link";
import { scrollToForm } from "./cta-utils";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";

interface Card {
  no: string;
  title: string;
  outcome: string;
  pills: string[];
  detailHref: string;
}

const CARDS: Card[] = [
  {
    no: "01",
    title: "Özel Web Sitesi",
    outcome: "Hazır şablon değil — markanıza özel kodlanmış, hızlı ve dönüşüm odaklı siteler.",
    pills: ["Özel Tasarım", "Mobil Öncelikli", "Yüksek Hız", "SEO Uyumlu", "Yönetim Paneli"],
    detailHref: "/tr/hizmetler/web-tasarim",
  },
  {
    no: "02",
    title: "Reklam Yönetimi",
    outcome: "Meta ve Google reklamlarınızı ROAS odaklı yönetir, bütçenizi satışa çeviririz.",
    pills: ["Meta Ads", "Google Ads", "Retargeting", "A/B Test", "Dönüşüm Takibi"],
    detailHref: "/tr/hizmetler/reklam-yonetimi",
  },
  {
    no: "03",
    title: "SEO",
    outcome: "Teknik altyapıdan içeriğe uçtan uca SEO ile Google'da kalıcı organik trafik.",
    pills: ["Teknik SEO", "İçerik Stratejisi", "Anahtar Kelime", "Yerel SEO", "Raporlama"],
    detailHref: "/tr/hizmetler/seo",
  },
];

export default function ValuePropSection() {
  return (
    <section style={{ background: "#fff", width: "100%" }}>
      <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <RevealOnScroll>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
            Ne Yapıyoruz
          </p>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 84px)", fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.04em", color: "#0a0a0a", maxWidth: 900, marginBottom: 56 }}>
            Büyümeniz için üç şey, tek ekipten.
          </h2>
        </RevealOnScroll>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {CARDS.map((c, i) => (
            <RevealOnScroll key={c.no} delay={i * 0.08}>
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: "34px 30px 30px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  background: "#fff",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: "#9ca3af" }}>{c.no}</span>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.02em", margin: 0 }}>{c.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "#4b5563", margin: 0, flex: 1 }}>{c.outcome}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {c.pills.map((p) => (
                    <span key={p} style={{ display: "inline-block", padding: "6px 13px", background: "#0a0a0a", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{p}</span>
                  ))}
                </div>
                <Link href={c.detailHref} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 13.5, fontWeight: 700, color: "var(--accent)", textDecoration: "none" }}>
                  Detaylı incele ↗
                </Link>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div style={{ marginTop: 48 }}>
            <button
              onClick={scrollToForm}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: "1.5px solid #0a0a0a", background: "transparent", color: "#0a0a0a",
                borderRadius: 999, padding: "13px 30px", fontSize: 14, fontWeight: 600,
                letterSpacing: "0.02em", cursor: "pointer", transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0a0a0a"; }}
            >
              Projeniz için teklif alın <span style={{ fontSize: 16 }}>↗</span>
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
