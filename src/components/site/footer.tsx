"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Props { lang: string }

/* ── Tiny logo mark — circle with "V" ── */
function VogoLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      <path d="M10 11l6 10 6-10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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

  const socials = [
    { label: "X.com",      href: "#" },
    { label: "Dribbble",   href: "#" },
    { label: "Instagram",  href: "#" },
    { label: "LinkedIn",   href: "#" },
  ];

  const navLinks = lang === "tr"
    ? [{ label: "Ana Sayfa", href: `/${lang}` }, { label: "Projeler", href: `/${lang}/projeler` }, { label: "\u0130leti\u015fim", href: `/${lang}/iletisim` }]
    : [{ label: "Home",      href: `/${lang}` }, { label: "Projects",  href: `/${lang}/projects`  }, { label: "Contact",  href: `/${lang}/contact`  }];

  const priorityLinks = [
    { label: lang === "tr" ? "Kullan\u0131m Ko\u015fullar\u0131" : "Terms And Conditions", href: "#" },
    { label: lang === "tr" ? "Gizlilik Politikas\u0131" : "Privacy & Policy",    href: "#" },
  ];

  const labelStyle: React.CSSProperties = {
    fontSize: 16, fontWeight: 600, color: "#ffffff",
    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24,
  };
  const linkStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", alignItems: "flex-end",
    fontSize: 17, color: "#ffffff",
    textDecoration: "none", marginBottom: 18,
    transition: "opacity 0.2s",
  };

  return (
    <footer style={{ background: "#0a0a0a", width: "100%" }}>

      {/* ── Social bar top ── */}
      <div className="section-container" style={{ paddingTop: 38, paddingBottom: 38, borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 38 }}>
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
      <div className="section-container" style={{ paddingTop: 77, paddingBottom: 0, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 58 }}>

        {/* Contact Us */}
        <div>
          <p style={labelStyle}>{lang === "tr" ? "Bize Ulaşın" : "Contact Us"}</p>
          <h3 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, color: "#ffffff", lineHeight: 1.25, marginBottom: 34 }}>
            {lang === "tr" ? "Bir projeniz mi var?" : "Have a project in mind?"}
          </h3>

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
            onClick={() => { if (email && message) { setSent(true); setEmail(""); setMessage(""); setTimeout(() => setSent(false), 3000); } }}
            style={{
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 999, padding: "14px 34px", fontSize: 16,
              color: "#fff", cursor: "pointer", fontWeight: 500,
              transition: "background 0.2s",
            }}
          >
            {sent ? (lang === "tr" ? "Gönderildi ✓" : "Sent ✓") : (lang === "tr" ? "Mesaj Gönder" : "Send a Message")}
          </button>
        </div>

        {/* Lets Talk */}
        <div style={{ textAlign: "right" }}>
          <p style={labelStyle}>{lang === "tr" ? "Konuşalım" : "Lets Talk"}</p>
          <a href="tel:+15108956500" style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <span>(510) 895-6500</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 4 }}>
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="mailto:hello@brog.com" style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <span>Hello@brog.com</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 4 }}>
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Navigation */}
        <div style={{ textAlign: "right" }}>
          <p style={labelStyle}>{lang === "tr" ? "Navigasyon" : "Navigation"}</p>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <span>{l.label}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 4 }}>
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
        </div>

        {/* Priority */}
        <div style={{ textAlign: "right" }}>
          <p style={labelStyle}>{lang === "tr" ? "Yasal" : "Priority"}</p>
          {priorityLinks.map(l => (
            <a key={l.label} href={l.href} style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <span>{l.label}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 4 }}>
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
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
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
              {lang === "tr" ? "Tarafından oluşturuldu" : "Created by"}
            </span>
            <VogoLogo size={20} />
            <span style={{ fontSize: 14, color: "#ffffff", fontWeight: 600, letterSpacing: "0.04em" }}>
              Vogolab ↗
            </span>
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
