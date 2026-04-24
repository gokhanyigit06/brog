"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n";

interface NavbarProps {
  lang: Locale;
}

export default function Navbar({ lang }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const navLinks = [
    { href: `/${lang}/projeler`, label: lang === "tr" ? "Projeler" : "Projects" },
    { href: `/${lang}/hizmetler`, label: lang === "tr" ? "Hizmetler" : "Services" },
    { href: `/${lang}/blog`, label: "Blog" },
    { href: `/${lang}/hakkimizda`, label: lang === "tr" ? "Hakkımızda" : "About" },
    { href: `/${lang}/iletisim`, label: lang === "tr" ? "İletişim" : "Contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between section-container py-6">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Vogo Lab Logo" className="h-7 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          <span className="text-white font-bold text-lg tracking-widest uppercase">
            vogolab
          </span>
        </Link>

        {/* Right side: contact info + hamburger */}
        <div className="flex items-center gap-8">
          {/* Contact info — hidden on mobile */}
          <div className="hidden md:flex items-start gap-8">
            <div>
              <p className="text-white text-[13px] font-semibold mb-0.5">Email</p>
              <p className="text-white text-[13px]">hello@brog.com</p>
            </div>
            <div>
              <p className="text-white text-[13px] font-semibold mb-0.5">Phone</p>
              <p className="text-white text-[13px]">+90 555 000 0000</p>
            </div>
            <div>
              <p className="text-white text-[13px] font-semibold mb-0.5">Location</p>
              <p className="text-white text-[13px]">Istanbul, Turkey</p>
            </div>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex flex-col gap-[7px] cursor-pointer"
            aria-label="Menu"
          >
            <motion.span
              animate={{
                width: menuOpen ? "28px" : hovered ? "28px" : "18px",
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 7 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block h-[2px] bg-white origin-left"
              style={{ display: "block" }}
            />
            <motion.span
              animate={{
                width: menuOpen ? "28px" : hovered ? "18px" : "28px",
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -7 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block h-[2px] bg-white origin-left"
              style={{ display: "block" }}
            />
          </button>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/95 flex flex-col justify-center section-container transition-all duration-500",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="space-y-2">
          {navLinks.map((link, i) => (
            <div
              key={link.href}
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
              className={cn(
                "transition-all duration-500",
                menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-white text-5xl md:text-7xl font-bold tracking-tight hover:text-white/50 transition-colors"
              >
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* Lang switcher inside menu */}
        <div className="mt-12 flex gap-4">
          <Link
            href={`/tr${lang === "tr" ? "" : ""}`}
            className={cn("text-sm tracking-widest uppercase transition-colors",
              lang === "tr" ? "text-white" : "text-white/30 hover:text-white")}
          >
            TR
          </Link>
          <span className="text-white/20">|</span>
          <Link
            href={`/en`}
            className={cn("text-sm tracking-widest uppercase transition-colors",
              lang === "en" ? "text-white" : "text-white/30 hover:text-white")}
          >
            EN
          </Link>
        </div>
      </div>
    </>
  );
}
