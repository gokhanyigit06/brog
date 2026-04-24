"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Phase = "idle" | "card1" | "card2" | "expand" | "text";

const CARD_COLORS = [
  "linear-gradient(135deg, #1c2f45 0%, #0e1c2a 100%)",
  "linear-gradient(135deg, #0a2540 0%, #07182a 100%)",
];

interface HeroSectionProps {
  lang: string;
}

export default function HeroSection({ lang }: HeroSectionProps) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("card1"), 400);
    const t2 = setTimeout(() => setPhase("card2"), 950);
    const t3 = setTimeout(() => setPhase("expand"), 1500);
    const t4 = setTimeout(() => setPhase("text"), 2500);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const isExpanded = phase === "expand" || phase === "text";
  const showText = phase === "text";

  const services =
    lang === "tr"
      ? ["MARKA", "TASARIM", "GELİŞTİRME", "FOTOĞRAF", "PAZARLAMA"]
      : ["BRANDING", "DESIGN", "DEVELOPMENT", "PHOTOGRAPHY", "MARKETING"];

  const slogan =
    lang === "tr"
      ? "Büyümeyi hızlandıran iş çözümleri üretiyoruz —\nverimli, ölçeklenebilir ve sonuç odaklı."
      : "We build business solutions that drive real growth —\nefficient, scalable, and profit-focused.";

  return (
    <div className="relative w-full h-screen bg-[#080808] overflow-hidden">

      {/* ── Card 1 — small upper placeholder ── */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{
          opacity: phase === "card1" ? 1 : phase === "card2" ? 0.5 : 0,
          y: phase === "idle" ? 80 : 0,
        }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="absolute rounded-lg"
        style={{
          top: "22%",
          left: "50%",
          transform: "translateX(-46%)",
          width: "42%",
          aspectRatio: "16/9",
          background: CARD_COLORS[0],
          zIndex: 2,
        }}
      />

      {/* ── Card 2 / Hero — starts small, expands to fill ── */}
      <motion.div
        initial={{ clipPath: "inset(36% 14% 8% 14% round 10px)", opacity: 0 }}
        animate={{
          opacity: phase === "idle" ? 0 : 1,
          clipPath: isExpanded
            ? "inset(0% 0% 0% 0% round 0px)"
            : "inset(36% 14% 8% 14% round 10px)",
        }}
        transition={{
          opacity: { duration: 0.5 },
          clipPath: {
            duration: isExpanded ? 1.1 : 0.001,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        className="absolute inset-0 z-10"
        style={{ background: CARD_COLORS[1] }}
      >
        {/* Subtle dark vignette for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </motion.div>

      {/* ── Bottom white gradient — animates in after text ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showText ? 1 : 0 }}
        transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none"
        style={{
          height: "28%",
          background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* ── Text overlay ── */}
      {/* section-container gives 150px horizontal padding */}
      <div className="section-container absolute inset-0 z-20 pointer-events-none pt-[72px] pb-14">
        {/* Inner relative wrapper so absolute children respect the 150px margin */}
        <div className="relative h-full w-full">

          {/* Brog® — top left */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 24 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-0 text-white font-black leading-none tracking-tight select-none"
            style={{ fontSize: "clamp(72px, 9.5vw, 130px)" }}
          >
            Brog®
          </motion.h1>

          {/* Studio — right, vertical mid */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 24 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 text-white font-black leading-none tracking-tight select-none"
            style={{
              fontSize: "clamp(72px, 9.5vw, 130px)",
              top: "40%",
            }}
          >
            Studio
          </motion.p>

          {/* Services — bottom left */}
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 16 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 space-y-0"
          >
            {services.map((s) => (
              <li
                key={s}
                className="text-white font-bold uppercase tracking-widest leading-snug"
                style={{ fontSize: "clamp(12px, 1.2vw, 15px)" }}
              >
                {s}
              </li>
            ))}
          </motion.ul>

          {/* Slogan — bottom right */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 16 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 right-0 text-white leading-relaxed text-right"
            style={{
              fontSize: "clamp(12px, 1vw, 14px)",
              maxWidth: "340px",
              whiteSpace: "pre-line",
            }}
          >
            {slogan}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
