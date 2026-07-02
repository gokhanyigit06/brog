"use client";

import RevealOnScroll from "@/components/ui/reveal-on-scroll";

const STEPS = [
  { no: "01", title: "Keşif & Strateji", desc: "Hedeflerinizi, sektörünüzü ve rakiplerinizi analiz eder, size özel bir dijital yol haritası çıkarırız." },
  { no: "02", title: "Tasarım & Geliştirme", desc: "Markanıza özel, hızlı ve dönüşüm odaklı web sitenizi tasarlar ve baştan sona kodlarız." },
  { no: "03", title: "Reklam & Lansman", desc: "Meta ve Google kampanyalarını kurar, doğru kitleye ulaşır ve ürününüzü sahaya süreriz." },
  { no: "04", title: "Ölçümleme & Büyüme", desc: "Verileri takip eder, SEO ve reklamları sürekli optimize ederek büyümeyi kalıcı hale getiririz." },
];

export default function ProcessSection() {
  return (
    <section style={{ background: "#0d0d0d", width: "100%" }}>
      <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <RevealOnScroll>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
            Nasıl Çalışıyoruz
          </p>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 84px)", fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.04em", color: "#fff", maxWidth: 900, marginBottom: 24 }}>
            Fikirden sonuca, net bir süreç.
          </h2>
        </RevealOnScroll>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 40 }}>
          {STEPS.map((s, i) => (
            <RevealOnScroll key={s.no} delay={i * 0.06}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: 28,
                  alignItems: "start",
                  padding: "40px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", fontWeight: 600, paddingTop: 6 }}>{s.no}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 620 }}>
                  <h3 style={{ fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>{s.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
