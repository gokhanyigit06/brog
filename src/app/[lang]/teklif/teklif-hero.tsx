"use client";

import { motion } from "framer-motion";
import type { SiteSettings } from "@/lib/content";
import { buildWhatsAppUrl, scrollToForm, trackContactClick } from "./cta-utils";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  settings: SiteSettings;
}

const BADGES = ["120+ Proje", "%98 Memnuniyet", "5+ Yıl Deneyim", "Meta & Google"];

export default function TeklifHero({ settings }: Props) {
  const waUrl = buildWhatsAppUrl(settings.whatsapp || "", settings.waMessage || "", settings.phone);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "92vh",
        background: "#080808",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Yumuşak ışık aksanı */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "60%",
          height: "80%",
          background: "radial-gradient(circle at center, rgba(37,99,235,0.16) 0%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="section-container" style={{ position: "relative", zIndex: 1, width: "100%", paddingTop: 140, paddingBottom: 80 }}>
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 600, marginBottom: 28 }}
        >
          Ankara Dijital Büyüme Ajansı
        </motion.p>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.06, ease: EASE }}
          style={{
            fontSize: "clamp(40px, 6.2vw, 92px)",
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: "#fff",
            maxWidth: 1100,
            margin: 0,
          }}
        >
          Web siteniz, reklamlarınız ve SEO&apos;nuz — tek ekipten, sonuç odaklı.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
          style={{ fontSize: "clamp(16px, 1.5vw, 21px)", lineHeight: 1.6, color: "rgba(255,255,255,0.72)", maxWidth: 640, marginTop: 28 }}
        >
          Ankara ve çevresindeki işletmeler için yüksek kaliteli özel web sitesi kurar, Meta &amp; Google
          reklamlarını yönetir, uçtan uca SEO yaparız. Markanızı büyütmek için ihtiyacınız olan tek ekip.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
          style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 40 }}
        >
          <button
            onClick={scrollToForm}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", color: "#0a0a0a", border: "none",
              borderRadius: 999, padding: "16px 34px", fontSize: 15, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.01em", transition: "transform 0.2s ease, opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Ücretsiz Teklif Al <span style={{ fontSize: 17 }}>↗</span>
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactClick("whatsapp")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "transparent", color: "#fff",
              border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: 999, padding: "16px 30px", fontSize: 15, fontWeight: 600,
              textDecoration: "none", transition: "background 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
          >
            <WhatsAppIcon /> WhatsApp&apos;tan Yaz
          </a>
        </motion.div>

        {/* Güven rozetleri */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 26px", marginTop: 48 }}
        >
          {BADGES.map((b, i) => (
            <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 26 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.02em" }}>{b}</span>
              {i < BADGES.length - 1 && <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.22 8.24c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14 0-.31-.01-.48-.01a.9.9 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z"/>
    </svg>
  );
}
