"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n";

interface NavbarProps {
  lang: Locale;
}

// ── Hover slide-up text component ──────────────────────────────
function SlideLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const fontSize = "clamp(20px, 2.75vw, 38px)";
  const lineH    = "clamp(31px, 4.2vw, 56px)";

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 group"
      style={{ overflow: "hidden", height: lineH }}
    >
      {/* Text wrapper — clips the two sliding spans */}
      <div className="relative" style={{ height: lineH, overflow: "hidden", minWidth: "200px" }}>
        {/* Top span — slides up on hover */}
        <motion.span
          animate={{ y: hovered ? "-100%" : "0%" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center text-white font-bold"
          style={{ fontSize }}
        >
          {label}
        </motion.span>
        {/* Clone — comes from below on hover */}
        <motion.span
          animate={{ y: hovered ? "0%" : "100%" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center text-white font-bold"
          style={{ fontSize }}
        >
          {label}
        </motion.span>
      </div>

      {/* Arrow */}
      <motion.span
        animate={{ y: hovered ? "-100%" : "0%", opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="text-white/50 text-xl flex-shrink-0"
      >↗</motion.span>
    </Link>
  );
}

// ── Live clock ──────────────────────────────────────────────────
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const time = now.toLocaleTimeString("en-US", { hour12: false });

  return (
    <div className="text-white font-mono leading-tight" style={{ fontSize: "clamp(20px, 2.45vw, 34px)" }}>
      <div>{date}</div>
      <div>{time}</div>
    </div>
  );
}

export default function Navbar({ lang }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered]   = useState(false);

  const navLinks = [
    { href: `/${lang}`,            label: lang === "tr" ? "Ana Sayfa"  : "Home"     },
    { href: `/${lang}/projeler`,   label: lang === "tr" ? "Projeler"   : "Projects" },
    { href: `/${lang}/hizmetler`,  label: lang === "tr" ? "Hizmetler"  : "Services" },
    { href: `/${lang}/hakkimizda`, label: lang === "tr" ? "Hakkımızda" : "About"    },
    { href: `/${lang}/iletisim`,   label: lang === "tr" ? "İletişim"   : "Contact"  },
  ];

  const socials = [
    { href: "https://x.com",         label: "X.com"     },
    { href: "https://dribbble.com",  label: "Dribbble"  },
    { href: "https://instagram.com", label: "Instagram" },
    { href: "https://linkedin.com",  label: "LinkedIn"  },
  ];

  return (
    <>
      {/* ── Header bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between section-container py-6">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Vogo Lab Logo"
            className="h-7 w-auto object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span className="text-white font-bold text-lg tracking-widest uppercase">
            vogolab
          </span>
        </Link>

        {/* Right: contact info + hamburger */}
        <div className="flex items-center gap-8">
          {/* Contact info */}
          <div className="hidden md:flex items-start gap-8">
            <div>
              <p className="text-white text-[14px] font-semibold mb-0.5">Email</p>
              <p className="text-white text-[14px]">hello@brog.com</p>
            </div>
            <div>
              <p className="text-white text-[14px] font-semibold mb-0.5">Phone</p>
              <p className="text-white text-[14px]">+90 555 000 0000</p>
            </div>
            <div>
              <p className="text-white text-[14px] font-semibold mb-0.5">Location</p>
              <p className="text-white text-[14px]">Istanbul, Turkey</p>
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
              className="block h-[2px] bg-white origin-center"
            />
            <motion.span
              animate={{
                width:  menuOpen ? "32px" : hovered ? "22px" : "38px",
                rotate: menuOpen ? -45 : 0,
                y:      menuOpen ? -4.5 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block h-[2px] bg-white origin-center"
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
            className="fixed inset-0 z-40 bg-black section-container"
            style={{ display: "flex", alignItems: "stretch", paddingTop: "100px", paddingBottom: "60px" }}
          >
            {/* LEFT: brand + clock + socials */}
            <div className="flex flex-col justify-center w-1/2" style={{ gap: "24px" }}>
              {/* Brand */}
              <div
                className="text-white font-black leading-none tracking-tight"
                style={{ fontSize: "clamp(48px, 6.4vw, 88px)", marginTop: "48px" }}
              >
                <div>VOGO</div>
                <div>lab.</div>
              </div>

              {/* Clock */}
              <LiveClock />

              {/* Socials */}
              <div className="flex items-center gap-6 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-1"
                    style={{ fontSize: "17px" }}
                  >
                    {s.label} <span className="text-xs">↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT: nav links */}
            <nav className="flex flex-col justify-center items-end w-1/2">
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
