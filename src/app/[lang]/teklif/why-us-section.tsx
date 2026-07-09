"use client";

import RevealOnScroll from "@/components/ui/reveal-on-scroll";

const ITEMS = [
  { icon: "✦", title: "Tek ekip, tek fatura", desc: "Web, reklam ve SEO için ayrı ajanslarla uğraşmayın. Hepsi tek çatı altında, uyum içinde." },
  { icon: "◎", title: "Sonuç odaklı raporlama", desc: "Şeffaf metrikler: ne yaptığımızı, ne kazandırdığımızı net rakamlarla görürsünüz." },
  { icon: "▦", title: "Şeffaf ve net fiyat", desc: "Sürpriz yok. İşin kapsamını ve bedelini baştan konuşur, sözümüzün arkasında dururuz." },
  { icon: "↗", title: "Ankara'ya ve bölgesine hâkim", desc: "Ankara merkezliyiz; başkentin ve çevre illerin pazarını, tüketicisini ve rekabetini yakından tanırız. Gerektiğinde yüz yüze de çalışırız." },
];

export default function WhyUsSection() {
  return (
    <section style={{ background: "#fff", width: "100%" }}>
      <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <RevealOnScroll>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
            Neden Vogolab
          </p>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 84px)", fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.04em", color: "#0a0a0a", maxWidth: 900, marginBottom: 56 }}>
            Doğru yerde olduğunuzu hissedeceksiniz.
          </h2>
        </RevealOnScroll>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40 }}>
          {ITEMS.map((it, i) => (
            <RevealOnScroll key={it.title} delay={i * 0.06}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 24, color: "#0a0a0a", lineHeight: 1 }}>{it.icon}</div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: "#0a0a0a", lineHeight: 1.3, margin: 0 }}>{it.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#4b5563", margin: 0 }}>{it.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
