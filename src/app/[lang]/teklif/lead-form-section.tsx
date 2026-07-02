"use client";

import { useState } from "react";
import { saveLead, type LeadService, type SiteSettings } from "@/lib/content";
import { buildWhatsAppUrl, buildTelUrl, trackLead, trackContactClick } from "./cta-utils";

interface Props {
  settings: SiteSettings;
}

const SERVICES: { value: LeadService; label: string }[] = [
  { value: "web", label: "Web Sitesi" },
  { value: "reklam", label: "Reklam" },
  { value: "seo", label: "SEO" },
  { value: "hepsi", label: "Hepsi" },
];

export default function LeadFormSection({ settings }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<LeadService | "">("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const waUrl = buildWhatsAppUrl(settings.whatsapp || "", settings.waMessage || "", settings.phone);
  const telUrl = buildTelUrl(settings.phone);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Lütfen adınızı girin.");
    if (phone.replace(/[^\d]/g, "").length < 10) return setError("Lütfen geçerli bir telefon numarası girin.");
    if (!service) return setError("Lütfen bir hizmet seçin.");

    setSubmitting(true);
    try {
      await saveLead({ name: name.trim(), phone: phone.trim(), service, message: message.trim() || undefined, source: "teklif-form" });
      trackLead(service);
      setSent(true);
      setName(""); setPhone(""); setService(""); setMessage("");
    } catch {
      setError("Bir hata oluştu. Lütfen WhatsApp'tan yazın, hemen dönelim.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="teklif" style={{ background: "#0a0a0a", width: "100%", scrollMarginTop: 90 }}>
      <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="lead-grid">
          {/* Sol: başlık + hızlı iletişim */}
          <div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
              Teklif Alın
            </p>
            <h2 style={{ fontSize: "clamp(40px, 6vw, 82px)", fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.04em", color: "#fff", margin: 0 }}>
              Hadi<br />başlayalım.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", marginTop: 28, maxWidth: 440 }}>
              Formu doldurun, 24 saat içinde size özel bir yol haritası ve fiyat teklifiyle dönelim.
              Acele ediyorsanız doğrudan yazın veya arayın.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick("whatsapp")}
                style={quickBtn}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                WhatsApp&apos;tan Yaz
              </a>
              <a
                href={telUrl}
                onClick={() => trackContactClick("call")}
                style={quickBtn}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Hemen Ara
              </a>
            </div>
          </div>

          {/* Sağ: form kartı */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(28px, 3.5vw, 44px)" }}>
            {sent ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14, minHeight: 320, justifyContent: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: "#0a0a0a", margin: 0 }}>Talebiniz alındı!</h3>
                <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.6, margin: 0 }}>
                  En kısa sürede size döneceğiz. Dilerseniz WhatsApp&apos;tan da yazabilirsiniz.
                </p>
                <button onClick={() => setSent(false)} style={{ ...submitBtn, background: "#0a0a0a", marginTop: 8 }}>
                  Yeni talep gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Adınız *">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız Soyadınız" style={inputStyle} />
                </Field>
                <Field label="Telefon *">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="05xx xxx xx xx" style={inputStyle} />
                </Field>
                <Field label="İlgilendiğiniz hizmet *">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SERVICES.map((s) => {
                      const active = service === s.value;
                      return (
                        <button
                          type="button"
                          key={s.value}
                          onClick={() => setService(s.value)}
                          style={{
                            padding: "9px 16px", borderRadius: 999, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                            border: `1px solid ${active ? "#0a0a0a" : "#d1d5db"}`,
                            background: active ? "#0a0a0a" : "#fff",
                            color: active ? "#fff" : "#374151",
                            transition: "all 0.15s",
                          }}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <Field label="Mesajınız (opsiyonel)">
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Projeniz hakkında kısaca..." style={{ ...inputStyle, resize: "none" }} />
                </Field>

                {error && (
                  <p style={{ fontSize: 13.5, color: "#dc2626", margin: 0 }}>
                    {error}{" "}
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#dc2626", textDecoration: "underline" }}>WhatsApp&apos;tan yazın →</a>
                  </p>
                )}

                <button type="submit" disabled={submitting} style={{ ...submitBtn, background: "#0a0a0a", opacity: submitting ? 0.6 : 1 }}>
                  {submitting ? "Gönderiliyor..." : "Ücretsiz Teklif İste"}
                  {!submitting && <span style={{ fontSize: 16 }}>↗</span>}
                </button>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, textAlign: "center" }}>
                  Bilgileriniz yalnızca sizinle iletişim için kullanılır.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 899px) {
          .lead-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: "#6b7280", letterSpacing: "0.02em" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "13px 16px", borderRadius: 10, border: "1px solid #d1d5db",
  fontSize: 15, color: "#0a0a0a", outline: "none", fontFamily: "inherit", background: "#fff",
};

const submitBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
  border: "none", color: "#fff", borderRadius: 999, padding: "15px 28px",
  fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", transition: "opacity 0.2s",
};

const quickBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.28)",
  borderRadius: 999, padding: "13px 24px", fontSize: 14, fontWeight: 600,
  textDecoration: "none", transition: "background 0.2s",
};
