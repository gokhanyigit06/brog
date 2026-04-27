"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNavbarContent, type NavbarContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n";

interface NavbarProps {
  lang: Locale;
  lightBg?: boolean; // force dark text on light background pages
}

// ── Hover slide-up text component ──────────────────────────────
function SlideLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const fontSize = "clamp(20px, 2.75vw, 38px)";
  const rowH = 52;

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", width: "100%" }}
    >
      {/* Clip container — overflow hidden here, not on Link */}
      <div style={{ flex: 1, overflow: "hidden", height: `${rowH}px` }}>
        <motion.div
          initial={false}
          animate={{ y: hovered ? -rowH : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ height: `${rowH}px`, fontSize, display: "flex", alignItems: "center", justifyContent: "flex-end", color: "white", fontWeight: 700 }}>
            {label}
          </div>
          <div style={{ height: `${rowH}px`, fontSize, display: "flex", alignItems: "center", justifyContent: "flex-end", color: "white", fontWeight: 700 }}>
            {label}
          </div>
        </motion.div>
      </div>

      {/* Arrow — short & thick SVG */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
        <line x1="2" y1="12" x2="12" y2="2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <polyline points="5,2 12,2 12,9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </Link>
  );
}

// ── Live clock ──────────────────────────────────────────────────
function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const date = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const time = now.toLocaleTimeString("en-US", { hour12: false });

  return (
    <div className="text-white font-mono leading-tight" style={{ fontSize: "clamp(20px, 2.45vw, 34px)" }}>
      <div>{date}</div>
      <div>{time}</div>
    </div>
  );
}

export default function Navbar({ lang, lightBg }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const [nbData, setNbData]     = useState<NavbarContent | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // On light-bg pages the navbar always looks as if scrolled (dark text)
  const isDark = lightBg || scrolled;

  useEffect(() => {
    getNavbarContent().then(setNbData);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dynamic nav links — labels from Firebase, hrefs always correct
  const navLinks = [
    { href: `/${lang}`,           label: nbData ? (lang === "tr" ? nbData.nav_home_tr     : nbData.nav_home_en)     : (lang === "tr" ? "Ana Sayfa" : "Home")     },
    { href: `/${lang}/projeler`,  label: nbData ? (lang === "tr" ? nbData.nav_projects_tr : nbData.nav_projects_en) : (lang === "tr" ? "Projeler"  : "Projects") },
    { href: `/${lang}#hizmetler`, label: nbData ? (lang === "tr" ? nbData.nav_services_tr : nbData.nav_services_en) : (lang === "tr" ? "Hizmetler" : "Services") },
    { href: `/${lang}/iletisim`,  label: nbData ? (lang === "tr" ? nbData.nav_contact_tr  : nbData.nav_contact_en)  : (lang === "tr" ? "İletişim"  : "Contact")  },
    { href: `/${lang}#sss`,       label: lang === "tr" ? "SSS" : "FAQ" },
  ];

  const socials = [
    { href: nbData?.social_x         || "https://x.com",         label: "X.com"     },
    { href: nbData?.social_dribbble  || "https://dribbble.com",  label: "Dribbble"  },
    { href: nbData?.social_instagram || "https://instagram.com", label: "Instagram" },
    { href: nbData?.social_linkedin  || "https://linkedin.com",  label: "LinkedIn"  },
  ];

  const brandText      = nbData?.brandText      || "vogolab";
  const menuBrandLine1 = nbData?.menuBrandLine1 || "vogolab";
  const menuBrandLine2 = nbData?.menuBrandLine2 || "lab.";
  const email          = nbData?.email          || "hello@brog.com";
  const phone          = nbData?.phone          || "+90 555 000 0000";
  const location       = nbData?.location       || "Istanbul, Turkey";
  const menuBgImage    = nbData?.menuBgImage    || "";

  return (
    <>
      {/* ── Header bar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between section-container py-6"
        style={{
          background: isDark ? "rgba(255,255,255,0.85)" : "transparent",
          backdropFilter: isDark ? "blur(18px) saturate(1.8)" : "none",
          WebkitBackdropFilter: isDark ? "blur(18px) saturate(1.8)" : "none",
          borderBottom: isDark ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
          transition: "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease",
        }}
      >
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5">
          <img
            src={nbData?.logoUrl || "/logo.png"}
            alt="Vogo Lab Logo"
            className="h-7 w-auto object-contain"
            style={{
              filter: isDark
                ? (nbData?.logoUrl ? "none" : "brightness(0)")
                : (nbData?.logoUrl ? "none" : "brightness(0) invert(1)"),
              transition: "filter 0.35s ease",
            }}
          />
          <span
            style={{
              color: isDark ? "#0a0a0a" : "#fff",
              transition: "color 0.35s ease",
              fontWeight: 700,
              fontSize: "1.125rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {brandText}
          </span>
        </Link>

        {/* Right: contact info + hamburger */}
        <div className="flex items-center gap-8">
          {/* Contact info */}
          <div className="hidden md:flex items-start gap-8">
            <div>
              <p style={{ color: isDark ? "#0a0a0a" : "#fff", transition: "color 0.35s ease", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Email</p>
              <p style={{ color: isDark ? "#374151" : "#fff", transition: "color 0.35s ease", fontSize: 14 }}>{email}</p>
            </div>
            <div>
              <p style={{ color: isDark ? "#0a0a0a" : "#fff", transition: "color 0.35s ease", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Phone</p>
              <p style={{ color: isDark ? "#374151" : "#fff", transition: "color 0.35s ease", fontSize: 14 }}>{phone}</p>
            </div>
            <div>
              <p style={{ color: isDark ? "#0a0a0a" : "#fff", transition: "color 0.35s ease", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Location</p>
              <p style={{ color: isDark ? "#374151" : "#fff", transition: "color 0.35s ease", fontSize: 14 }}>{location}</p>
            </div>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex flex-col items-end gap-[7px] cursor-pointer z-[60] relative"
            aria-label="Menu"
          >
            <motion.span
              animate={{
                width:  menuOpen ? "32px" : hovered ? "38px" : "22px",
                rotate: menuOpen ? 45 : 0,
                y:      menuOpen ? 4.5 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: isDark ? "#0a0a0a" : "#fff", transition: "background 0.35s ease" }}
              className="block h-[2px] origin-center"
            />
            <motion.span
              animate={{
                width:  menuOpen ? "32px" : hovered ? "22px" : "38px",
                rotate: menuOpen ? -45 : 0,
                y:      menuOpen ? -4.5 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: isDark ? "#0a0a0a" : "#fff", transition: "background 0.35s ease" }}
              className="block h-[2px] origin-center"
            />
          </button>
        </div>
      </header>

      {/* ── Full-screen menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-40 section-container"
            style={{
              display: "flex",
              alignItems: "stretch",
              paddingTop: "100px",
              paddingBottom: "60px",
              backgroundColor: "#000",
              backgroundImage: menuBgImage ? `url(${menuBgImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* LEFT: brand + clock + socials */}
            <div className="flex flex-col justify-center w-1/2" style={{ gap: "24px" }}>
              {/* Brand */}
              <div
                className="text-white font-black leading-none tracking-tight"
                style={{ fontSize: "clamp(48px, 6.4vw, 88px)", marginTop: "48px" }}
              >
                <div>{menuBrandLine1}</div>
                <div>{menuBrandLine2}</div>
              </div>

              {/* Clock */}
              <div style={{ marginTop: "15px" }}>
                <LiveClock />
              </div>

              {/* Socials */}
              <div className="flex items-center gap-6 flex-wrap" style={{ marginTop: "10px" }}>
                {socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-colors flex items-center gap-1"
                    style={{ fontSize: "19px" }}
                  >
                    {s.label} <span className="text-xs">↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT: nav links */}
            <nav className="flex flex-col justify-center items-end w-1/2" style={{ gap: "7px" }}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SlideLink
                    href={link.href}
                    label={link.label}
                    onClick={() => setMenuOpen(false)}
                  />
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
