"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getNavbarContent, type NavbarContent } from "@/lib/content";

interface Props { lang: string }

/* ── Infinite marquee with edge fade (inside section-container padding) ── */
function FooterMarquee() {
  const text = "STUDIO / Design / Development BROG / Creative /\u00a0";
  const repeated = Array(6).fill(text).join("");
  return (
    <div className="section-container" style={{ overflow: "hidden", paddingTop: 40, paddingBottom: 32 }}>
      <div
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            animation: "footerMarquee 28s linear infinite",
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.18)",
          }}
        >
          {repeated}
        </div>
      </div>
      <style>{`
        @keyframes footerMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default function Footer({ lang }: Props) {
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  // Spam koruması: botlar gizli alanı doldurur
  const [honeypot, setHoneypot] = useState("");
  const [contactData, setContactData] = useState<NavbarContent | null>(null);

  useEffect(() => { getNavbarContent().then(setContactData).catch(() => {}); }, []);

  const contactPhone = contactData?.phone || "+90 507 734 75 21";
  const contactEmail = contactData?.email || "info@vogolab.com";

  async function handleFooterSend() {
    if (!email || !message || sending) return;
    if (honeypot) {
      setSent(true);
      setEmail(""); setMessage("");
      setTimeout(() => setSent(false), 3000);
      return;
    }
    setSending(true);
    try {
      const { saveLead } = await import("@/lib/content");
      await saveLead({ name: "", phone: "", email: email.trim(), service: "diger", message: message.trim(), source: "footer-form" });
      setSent(true);
      setEmail(""); setMessage("");
      setTimeout(() => setSent(false), 3000);
    } catch {
      // sessizce geç — kullanıcı tekrar deneyebilir
    } finally {
      setSending(false);
    }
  }

  const socials = [
    { label: "X.com",      href: "#" },
    { label: "Dribbble",   href: "#" },
    { label: "Instagram",  href: "#" },
    { label: "LinkedIn",   href: "#" },
  ];

  const navLinks = lang === "tr"
    ? [{ label: "Ana Sayfa", href: `/${lang}` }, { label: "Hakk\u0131m\u0131zda", href: `/${lang}/hakkimizda` }, { label: "Hizmetler", href: `/${lang}/hizmetler` }, { label: "Projeler", href: `/${lang}/projeler` }, { label: "Blog", href: `/${lang}/blog` }, { label: "\u0130leti\u015fim", href: `/${lang}/iletisim` }]
    : [{ label: "Home",      href: `/${lang}` }, { label: "About",      href: `/${lang}/hakkimizda` }, { label: "Services",  href: `/${lang}/hizmetler` }, { label: "Projects",  href: `/${lang}/projeler`  }, { label: "Blog", href: `/${lang}/blog` }, { label: "Contact",  href: `/${lang}/iletisim`  }];

  const priorityLinks = [
    { label: lang === "tr" ? "Kullanım Koşulları" : "Terms And Conditions", href: `/${lang}/terms-of-service` },
    { label: lang === "tr" ? "Gizlilik Politikası" : "Privacy & Policy",    href: `/${lang}/privacy-policy` },
  ];

  const labelStyle: React.CSSProperties = {
    fontSize: 16, fontWeight: 600, color: "#ffffff",
    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24,
  };
  const linkStyle: React.CSSProperties = {
    display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 6,
    fontSize: 17, color: "#ffffff",
    textDecoration: "none", marginBottom: 18,
    transition: "opacity 0.2s",
  };

  return (
    <footer style={{ background: "#0a0a0a", width: "100%" }}>

      {/* ── Social bar top ── */}
      <div className="section-container" style={{ paddingTop: 38, paddingBottom: 38, borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="ft-social" style={{ display: "flex", gap: 38 }}>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 16, color: "#ffffff", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {s.label} <span style={{ fontSize: 11 }}>↗</span>
            </a>
          ))}
        </div>
        {/* Small brand dot */}
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>B</span>
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div className="section-container ft-grid" style={{ paddingTop: 77, paddingBottom: 0, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 58 }}>

        {/* Contact Us */}
        <div>
          <p style={labelStyle}>{lang === "tr" ? "Bize Ulaşın" : "Contact Us"}</p>
          <h3 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, color: "#ffffff", lineHeight: 1.25, marginBottom: 34 }}>
            {lang === "tr" ? "Bir projeniz mi var?" : "Have a project in mind?"}
          </h3>

          {/* Honeypot — insanlar görmez, botlar doldurur */}
          <input
            type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
            name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
            style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }}
          />
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
            Email
          </p>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={lang === "tr" ? "E-posta adresiniz*" : "Your Email*"}
            style={{
              width: "100%", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)",
              padding: "10px 0 12px", fontSize: 16, color: "#fff", outline: "none",
              caretColor: "#fff", marginBottom: 29,
            }}
          />

          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
            {lang === "tr" ? "Mesajınız" : "Message"}
          </p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={lang === "tr" ? "Mesajınız*" : "Your message*"}
            rows={3}
            style={{
              width: "100%", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)",
              padding: "10px 0 12px", fontSize: 16, color: "#fff", outline: "none",
              caretColor: "#fff", resize: "none", fontFamily: "inherit", marginBottom: 29,
            }}
          />

          <button
            onClick={handleFooterSend}
            style={{
              width: "100%", textAlign: "center",
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 999, padding: "14px 34px", fontSize: 16,
              color: "#fff", cursor: "pointer", fontWeight: 500,
              transition: "background 0.2s",
            }}
          >
            {sent ? (lang === "tr" ? "Gönderildi ✓" : "Sent ✓") : (lang === "tr" ? "Mesaj Gönder" : "Send a Message")}
          </button>
          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginTop: 12, lineHeight: 1.5 }}>
            {lang === "tr" ? (
              <>Formu göndererek <a href={`/${lang}/privacy-policy`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>KVKK Aydınlatma Metni</a>&apos;ni kabul etmiş olursunuz.</>
            ) : (
              <>By submitting you accept our <a href={`/${lang}/privacy-policy`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>Privacy Policy</a>.</>
            )}
          </p>
        </div>

        {/* Lets Talk */}
        <div className="ft-col" style={{ textAlign: "right" }}>
          <p style={labelStyle}>{lang === "tr" ? "Konuşalım" : "Lets Talk"}</p>
          <a href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`} style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <span>{contactPhone}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 4 }}>
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href={`mailto:${contactEmail}`} style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <span>{contactEmail}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 4 }}>
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Navigation */}
        <div className="ft-col" style={{ textAlign: "right" }}>
          <p style={labelStyle}>{lang === "tr" ? "Navigasyon" : "Navigation"}</p>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <span>{l.label}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
        </div>

        {/* Priority */}
        <div className="ft-col" style={{ textAlign: "right" }}>
          <p style={labelStyle}>{lang === "tr" ? "Yasal" : "Priority"}</p>
          {priorityLinks.map(l => (
            <Link key={l.label} href={l.href} style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <span>{l.label}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Giant scrolling marquee ── */}
      <FooterMarquee />

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="section-container" style={{
          paddingTop: 22, paddingBottom: 22,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Created by Vogolab */}
          <a
            href="https://vogolab.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
          >
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
              {lang === "tr" ? "Tarafından oluşturuldu" : "Created by"}
            </span>
            <Image
              src="/vogolab-vg-lockup-white.svg"
              alt="Vogolab"
              width={110}
              height={24}
              style={{ opacity: 0.9 }}
            />
          </a>

          {/* Right: copyright */}
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
            © 2026 VOGOLAB. {lang === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}
          </span>
        </div>
      </div>

    </footer>
  );
}
