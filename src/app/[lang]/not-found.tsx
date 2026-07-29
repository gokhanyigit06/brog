import Link from "next/link";
import Image from "next/image";

// Markalı 404 — Next.js fabrika çıkışının yerine geçer (logo + dönüş bağlantısı).
// [lang] segmenti altında olduğu için [lang]/layout içinde (html/font/stil) render olur.
// not-found bileşenleri params almadığından metin iki dilli tutuldu.
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 20px",
        gap: 24,
      }}
    >
      <Image src="/vogolab-vg-lockup-white.svg" alt="Vogolab" width={150} height={32} style={{ opacity: 0.9 }} priority />
      <p style={{ fontSize: "clamp(64px, 14vw, 128px)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, margin: 0 }}>
        404
      </p>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", maxWidth: 460, margin: 0 }}>
        Aradığınız sayfa bulunamadı.
        <br />
        <span style={{ color: "rgba(255,255,255,0.45)" }}>The page you’re looking for could not be found.</span>
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
        <Link
          href="/tr"
          style={{ background: "#fff", color: "#0a0a0a", borderRadius: 999, padding: "12px 26px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}
        >
          Ana Sayfa
        </Link>
        <Link
          href="/en"
          style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "12px 26px", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
        >
          Home (EN)
        </Link>
      </div>
    </main>
  );
}
