"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n";

interface NavbarProps {
  lang: Locale;
}

export default function Navbar({ lang }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}/projeler`, label: lang === "tr" ? "Projeler" : "Projects" },
    { href: `/${lang}/hizmetler`, label: lang === "tr" ? "Hizmetler" : "Services" },
    { href: `/${lang}/blog`, label: "Blog" },
    { href: `/${lang}/hakkimizda`, label: lang === "tr" ? "Hakkımızda" : "About" },
    { href: `/${lang}/iletisim`, label: lang === "tr" ? "İletişim" : "Contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between section-container py-5">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>
          <span className="text-white font-bold text-base tracking-widest uppercase">
            BROG®
          </span>
        </Link>

        {/* Center: contact info */}
        <div className="hidden md:flex items-start gap-8 text-white/70 text-xs">
          <div>
            <p className="text-white/40 uppercase tracking-widest text-[10px] mb-0.5">Email</p>
            <p>hello@brog.com</p>
          </div>
          <div>
            <p className="text-white/40 uppercase tracking-widest text-[10px] mb-0.5">Phone</p>
            <p>+90 555 000 0000</p>
          </div>
          <div>
            <p className="text-white/40 uppercase tracking-widest text-[10px] mb-0.5">Location</p>
            <p>Istanbul, Turkey</p>
          </div>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 cursor-pointer group"
          aria-label="Menu"
        >
          <span
            className={cn(
              "block h-px w-7 bg-white transition-all duration-300 origin-center",
              menuOpen && "rotate-45 translate-y-[5px]"
            )}
          />
          <span
            className={cn(
              "block h-px w-7 bg-white transition-all duration-300",
              menuOpen && "-rotate-45 -translate-y-[3px]"
            )}
          />
        </button>
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
