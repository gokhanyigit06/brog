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

/* ── Infinite marquee ── */
function FooterMarquee() {
  const text = "STUDIO / Design / Development BROG / Creative /\u00a0";
  const repeated = Array(6).fill(text).join("");
  return (
    <div style={{ overflow: "hidden", width: "100%", padding: "40px 0 32px" }}>
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          animation: "footerMarquee 28s linear infinite",
          fontSize: "clamp(48px, 7vw, 88px)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          background: "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.08) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundSize: "200% 100%",
        }}
      >
        {repeated}
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
    ? [{ label: "Ana Sayfa", href: `/${lang}` }, { label: "Projeler", href: `/${lang}/projeler` }, { label: "İletişim", href: `/${lang}/iletisim` }]
    : [{ label: "Home",      href: `/${lang}` }, { label: "Projects",  href: `/${lang}/projects`  }, { label: "Contact",  href: `/${lang}/contact`  }];

  const priorityLinks = [
    { label: lang === "tr" ? "Kullanım Koşulları" : "Terms And Conditions", href: "#" },
    { label: lang === "tr" ? "Gizlilik Politikası" : "Privacy & Policy",    href: "#" },
  ];

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)",
    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20,
  };
  const linkStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 4,
    fontSize: 14, color: "rgba(255,255,255,0.75)",
    textDecoration: "none", marginBottom: 10,
    transition: "color 0.2s",
  };

  return (
    <footer style={{ background: "#0a0a0a", width: "100%" }}>

      {/* ── Social bar top ── */}
      <div className="section-container" style={{ paddingTop: 32, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 32 }}>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              {s.label} <span style={{ fontSize: 10 }}>↗</span>
            </a>
          ))}
        </div>
        {/* Small brand dot */}
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>B</span>
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div className="section-container" style={{ paddingTop: 64, paddingBottom: 0, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>

        {/* Contact Us */}
        <div>
          <p style={labelStyle}>{lang === "tr" ? "Bize Ulaşın" : "Contact Us"}</p>
          <h3 style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: "#ffffff", lineHeight: 1.25, marginBottom: 28 }}>
            {lang === "tr" ? "Bir projeniz mi var?" : "Have a project in mind?"}
          </h3>

          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            Email
          </p>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={lang === "tr" ? "E-posta adresiniz*" : "Your Email*"}
            style={{
              width: "100%", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)",
              padding: "8px 0 10px", fontSize: 13, color: "#fff", outline: "none",
              caretColor: "#fff", marginBottom: 24,
            }}
          />

          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            {lang === "tr" ? "Mesajınız" : "Message"}
          </p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={lang === "tr" ? "Mesajınız*" : "Your message*"}
            rows={3}
            style={{
              width: "100%", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)",
              padding: "8px 0 10px", fontSize: 13, color: "#fff", outline: "none",
              caretColor: "#fff", resize: "none", fontFamily: "inherit", marginBottom: 24,
            }}
          />

          <button
            onClick={() => { if (email && message) { setSent(true); setEmail(""); setMessage(""); setTimeout(() => setSent(false), 3000); } }}
            style={{
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 999, padding: "12px 28px", fontSize: 13,
              color: "#fff", cursor: "pointer", fontWeight: 500,
              transition: "background 0.2s",
            }}
          >
            {sent ? (lang === "tr" ? "Gönderildi ✓" : "Sent ✓") : (lang === "tr" ? "Mesaj Gönder" : "Send a Message")}
          </button>
        </div>

        {/* Lets Talk */}
        <div>
          <p style={labelStyle}>{lang === "tr" ? "Konuşalım" : "Lets Talk"}</p>
          <a href="tel:+15108956500" style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
          >
            (510) 895-6500 <span style={{ fontSize: 10 }}>↗</span>
          </a>
          <a href="mailto:hello@brog.com" style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
          >
            Hello@brog.com <span style={{ fontSize: 10 }}>↗</span>
          </a>
        </div>

        {/* Navigation */}
        <div>
          <p style={labelStyle}>{lang === "tr" ? "Navigasyon" : "Navigation"}</p>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            >
              {l.label} <span style={{ fontSize: 10 }}>↗</span>
            </Link>
          ))}
        </div>

        {/* Priority */}
        <div>
          <p style={labelStyle}>{lang === "tr" ? "Yasal" : "Priority"}</p>
          {priorityLinks.map(l => (
            <a key={l.label} href={l.href} style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            >
              {l.label} <span style={{ fontSize: 10 }}>↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Giant scrolling marquee ── */}
      <FooterMarquee />

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="section-container" style={{
          paddingTop: 18, paddingBottom: 18,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Created by Vogolab */}
          <a
            href="https://vogolab.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
              {lang === "tr" ? "Tarafından oluşturuldu" : "Created by"}
            </span>
            <VogoLogo size={18} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 600, letterSpacing: "0.04em" }}>
              Vogolab ↗
            </span>
          </a>

          {/* Right: copyright */}
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
            © 2026 VOGOLAB. {lang === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}
          </span>
        </div>
      </div>

    </footer>
  );
}
