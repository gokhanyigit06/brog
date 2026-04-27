"use client";

import { useEffect, useState } from "react";
import { getContactContent, type ContactContent } from "@/lib/content";

interface Props { lang: string }

/* ── minimal underline input ── */
function Field({
  label, value, onChange, placeholder, type = "text", multiline = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; multiline?: boolean;
}) {
  const base: React.CSSProperties = {
    width: "100%", background: "transparent",
    border: "none", borderBottom: "1px solid #d1d5db",
    padding: "10px 0", fontSize: 16, color: "#0a0a0a",
    outline: "none", resize: "none",
    fontFamily: "inherit",
  };
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>
        {label}
      </label>
      {multiline
        ? <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...base, display: "block" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
      }
    </div>
  );
}

export default function IletisimClient({ lang }: Props) {
  const [contact, setContact] = useState<ContactContent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => { getContactContent().then(setContact); }, []);

  const address = lang === "tr" ? contact?.address_tr : contact?.address_en;

  function handleSend() {
    if (!name || !email || !message) return;
    setSent(true);
    setName(""); setEmail(""); setMessage("");
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <main style={{ background: "#ffffff", minHeight: "100vh", paddingTop: 100 }}>

      {/* ══════════════════════════════════════════════
          1. HERO IMAGE  — full container width, 700 px tall
      ══════════════════════════════════════════════ */}
      <div className="section-container" style={{ paddingBottom: 0 }}>
        <div style={{
          width: "100%", height: 700,
          borderRadius: 20, overflow: "hidden",
          background: "#e5e7eb",
        }}>
          {contact?.heroImage && (
            <img
              src={contact.heroImage}
              alt="Contact hero"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          2. FORM SECTION
      ══════════════════════════════════════════════ */}
      <div className="section-container" style={{ paddingTop: 96, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>

          {/* Left: small label */}
          <div style={{ paddingTop: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {lang === "tr" ? "BİR ADIMLA BAŞLA" : "START WITH A STEP"}
            </p>
          </div>

          {/* Right: heading + form */}
          <div>
            <h1 style={{
              fontSize: "clamp(42px, 6vw, 80px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: "#0a0a0a",
              marginBottom: 20,
            }}>
              {lang === "tr" ? "Haydi\nBağlanalım" : "Let's\nConnect"}
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6b7280", marginBottom: 48, maxWidth: 560 }}>
              {lang === "tr"
                ? "Birlikte özgün, sürükleyici ve derin kişisel bir şey yaratmak için bağlanalım."
                : "Let's connect to create something curated, immersive, and deeply personal together."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <Field label={lang === "tr" ? "İsim" : "Name"} value={name} onChange={setName} placeholder={lang === "tr" ? "Adınız" : "Your Name"} />
              <Field label="Email" value={email} onChange={setEmail} placeholder={lang === "tr" ? "E-posta adresiniz" : "Your Email"} type="email" />
              <Field label={lang === "tr" ? "Mesaj" : "Message"} value={message} onChange={setMessage} placeholder={lang === "tr" ? "Mesajınız" : "Your Message"} multiline />
            </div>

            <div style={{ marginTop: 36 }}>
              {sent ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, color: "#16a34a", fontWeight: 600 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4.5 4.5 7.5-9" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {lang === "tr" ? "Mesajınız iletildi!" : "Message sent!"}
                </div>
              ) : (
                <button
                  onClick={handleSend}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "transparent",
                    border: "1.5px solid #0a0a0a",
                    borderRadius: 999,
                    padding: "13px 30px",
                    fontSize: 15, fontWeight: 600, color: "#0a0a0a",
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#0a0a0a"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
                >
                  {lang === "tr" ? "Mesaj Gönder" : "Send a Message"}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          3. ADDRESS INFO  — centered
      ══════════════════════════════════════════════ */}
      <div className="section-container" style={{ paddingTop: 0, paddingBottom: 72 }}>
        <div style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: 72,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 520,
          gap: 36,
        }}>
          {/* Address */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1C6.24 1 4 3.24 4 6c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 6.75c-1.04 0-1.875-.84-1.875-1.875S7.96 4 9 4s1.875.84 1.875 1.875S10.04 7.75 9 7.75z" fill="#0a0a0a"/></svg>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.01em" }}>
                {lang === "tr" ? "Adres" : "Address"}
              </span>
            </div>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.6, paddingLeft: 28 }}>
              {address || (lang === "tr" ? "İstanbul, Türkiye" : "Istanbul, Turkey")}
              {contact?.maps_link && (
                <>
                  {" "}·{" "}
                  <a href={contact.maps_link} target="_blank" rel="noopener noreferrer"
                    style={{ color: "#6b7280", textDecoration: "underline", fontSize: 13 }}>
                    {lang === "tr" ? "Haritada Gör" : "View on Maps"}
                  </a>
                </>
              )}
            </p>
          </div>

          {/* Contact */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="3.5" width="16" height="11" rx="2" stroke="#0a0a0a" strokeWidth="1.5"/><path d="M1 6l8 5 8-5" stroke="#0a0a0a" strokeWidth="1.5"/></svg>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.01em" }}>
                {lang === "tr" ? "İletişim" : "Contact"}
              </span>
            </div>
            <a
              href={`mailto:${contact?.email || "hello@brog.com"}`}
              style={{ fontSize: 15, color: "#374151", textDecoration: "underline", paddingLeft: 28, display: "block" }}
            >
              {contact?.email || "Hello@brog.com"}
            </a>
            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                style={{ fontSize: 15, color: "#374151", textDecoration: "none", paddingLeft: 28, display: "block", marginTop: 4 }}
              >
                {contact.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          4. BOTTOM 2 IMAGES  — 50/50 grid
      ══════════════════════════════════════════════ */}
      <div className="section-container" style={{ paddingTop: 0, paddingBottom: 100 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[contact?.image1, contact?.image2].map((src, i) => (
            <div
              key={i}
              style={{
                height: 540,
                borderRadius: 16,
                overflow: "hidden",
                background: "#e5e7eb",
              }}
            >
              {src && (
                <img
                  src={src}
                  alt={`Studio ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
