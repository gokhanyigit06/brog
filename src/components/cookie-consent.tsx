"use client";

import { useEffect, useState } from "react";
import { readConsent, setConsent } from "@/lib/consent";

/**
 * Çerez onay bandı. Karar verilmemişse görünür; Kabul/Reddet kararını
 * localStorage'a yazar (bkz. consent.ts) ve Analytics'i tetikler.
 * Reddet → hiçbir izleme yüklenmez. Metin dile göre TR/EN.
 */
export default function CookieConsent({ lang }: { lang: string }) {
  const tr = lang !== "en";
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Karar verilmemişse göster (SSR/flash olmasın diye mount sonrası).
    if (readConsent() === null) setShow(true);
  }, []);

  if (!show) return null;

  function decide(v: "granted" | "denied") {
    setConsent(v);
    setShow(false);
  }

  return (
    <div
      role="dialog"
      aria-label={tr ? "Çerez tercihi" : "Cookie preference"}
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 60,
        margin: "0 auto",
        maxWidth: 720,
        background: "#0a0a0a",
        color: "#fff",
        borderRadius: 16,
        padding: "18px 20px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
      }}
    >
      <p style={{ flex: "1 1 280px", fontSize: 13.5, lineHeight: 1.6, margin: 0, color: "#e5e7eb" }}>
        {tr ? (
          <>
            Deneyimini iyileştirmek ve trafiği ölçmek için çerez kullanıyoruz. Ayrıntı için{" "}
            <a href={`/${lang}/privacy-policy`} style={{ color: "#fff", textDecoration: "underline" }}>
              Gizlilik Politikası
            </a>
            .
          </>
        ) : (
          <>
            We use cookies to improve your experience and measure traffic. See our{" "}
            <a href={`/${lang}/privacy-policy`} style={{ color: "#fff", textDecoration: "underline" }}>
              Privacy Policy
            </a>
            .
          </>
        )}
      </p>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button
          onClick={() => decide("denied")}
          style={{
            background: "transparent",
            border: "1.5px solid #3f3f46",
            color: "#d4d4d8",
            borderRadius: 999,
            padding: "9px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {tr ? "Reddet" : "Decline"}
        </button>
        <button
          onClick={() => decide("granted")}
          style={{
            background: "#fff",
            border: "1.5px solid #fff",
            color: "#0a0a0a",
            borderRadius: 999,
            padding: "9px 20px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {tr ? "Kabul Et" : "Accept"}
        </button>
      </div>
    </div>
  );
}
