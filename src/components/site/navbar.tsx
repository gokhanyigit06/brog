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
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 group overflow-hidden relative"
      style={{ height: "clamp(52px, 6.5vw, 88px)" }}
    >
      {/* Arrow */}
      <span className="text-white/40 text-xl mt-1 flex-shrink-0">↗</span>

      {/* Text wrapper */}
      <span className="relative overflow-hidden flex-1" style={{ height: "1.1em" }}>
        {/* Top text — slides up on hover */}
        <motion.span
          animate={{ y: hovered ? "-110%" : "0%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 text-white font-bold leading-none text-left"
          style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
        >
          {label}
        </motion.span>
        {/* Bottom text — comes up from below on hover */}
        <motion.span
          animate={{ y: hovered ? "0%" : "110%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 text-white font-bold leading-none text-left"
          style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
        >
          {label}
        </motion.span>
      </span>
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
    <div className="text-white/70 font-mono text-2xl leading-tight">
      <div>{date}</div>
      <div>{time}</div>
    </div>
  );
}

export default function Navbar({ lang }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const navLinks = [
    { href: `/${lang}`,              label: lang === "tr" ? "Ana Sayfa"  : "Home"     },
    { href: `/${lang}/projeler`,     label: lang === "tr" ? "Projeler"   : "Projects" },
    { href: `/${lang}/hizmetler`,    label: lang === "tr" ? "Hizmetler"  : "Services" },
    { href: `/${lang}/hakkimizda`,   label: lang === "tr" ? "Hakkımızda" : "About"    },
    { href: `/${lang}/iletisim`,     label: lang === "tr" ? "İletişim"   : "Contact"  },
  ];

  const socials = [
    { href: "https://x.com",        label: "X.com"      },
    { href: "https://dribbble.com", label: "Dribbble"   },
    { href: "https://instagram.com",label: "Instagram"  },
    { href: "https://linkedin.com", label: "LinkedIn"   },
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
                width: menuOpen ? "38px" : hovered ? "38px" : "22px",
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 7 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block h-[2px] bg-white origin-right"
              style={{ display: "block" }}
            />
            <motion.span
              animate={{
                width: menuOpen ? "38px" : hovered ? "22px" : "38px",
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -7 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block h-[2px] bg-white origin-right"
              style={{ display: "block" }}
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
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black flex section-container pt-28 pb-12"
          >
            {/* LEFT: brand + clock + socials */}
            <div className="flex flex-col justify-between w-1/2">
              <div>
                {/* Brand */}
                <div
                  className="text-white font-black leading-none tracking-tight"
                  style={{ fontSize: "clamp(52px, 7vw, 96px)" }}
                >
                  <div>vogo-</div>
                  <div>lab</div>
                </div>

                {/* Clock */}
                <div className="mt-10">
                  <LiveClock />
                </div>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-6 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1"
                  >
                    {s.label}
                    <span className="text-xs">↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT: nav links */}
            <nav className="flex flex-col justify-center items-end w-1/2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
