"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Phase = "idle" | "card1" | "card2" | "expand" | "text";

// Placeholder card colors - admin will replace with real media via Firebase
const CARD_COLORS = [
  "linear-gradient(135deg, #1c2f45 0%, #0e1c2a 100%)", // card 1
  "linear-gradient(135deg, #0f2540 0%, #071829 100%)", // card 2 / hero
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

  const services = lang === "tr"
    ? ["Marka", "Tasarım", "Geliştirme", "Fotoğraf", "Pazarlama"]
    : ["Branding", "Design", "Development", "Photography", "Marketing"];

  const slogan = lang === "tr"
    ? "Büyümeyi hızlandıran iş çözümleri\nüretiyoruz — verimli, ölçeklenebilir\nve sonuç odaklı."
    : "We build business solutions that\ndrive real growth — efficient,\nscalable, and profit-focused.";

  return (
    <div className="relative w-full h-screen bg-[#080808] overflow-hidden">

      {/* ── Card 1 — small upper card ── */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{
          opacity: phase === "card1" ? 1 : phase === "card2" ? 0.6 : 0,
          y: phase === "idle" ? 80 : 0,
        }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="absolute rounded-lg overflow-hidden"
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

      {/* ── Card 2 / Hero — starts as card, expands to fill ── */}
      <motion.div
        initial={{ clipPath: "inset(36% 22% 8% 22% round 10px)", opacity: 0 }}
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
        {/* Dark bottom gradient for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </motion.div>

      {/* ── Text overlay ── */}
      <div className="section-container absolute inset-0 z-20 flex flex-col justify-between pointer-events-none pt-[88px] pb-14">
        {/* Top: Big title */}
        <div className="flex justify-between items-start">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 30 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-white font-bold leading-none"
            style={{ fontSize: "clamp(64px, 9vw, 120px)" }}
          >
            Brog®
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 30 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-white font-bold leading-none self-end"
            style={{ fontSize: "clamp(64px, 9vw, 120px)" }}
          >
            Studio
          </motion.p>
        </div>

        {/* Bottom: Services + Slogan */}
        <div className="flex justify-between items-end">
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-0.5"
          >
            {services.map((s) => (
              <li
                key={s}
                className="text-white font-semibold tracking-widest uppercase"
                style={{ fontSize: "clamp(11px, 1.1vw, 15px)" }}
              >
                {s}
              </li>
            ))}
          </motion.ul>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/80 text-right max-w-xs leading-relaxed"
            style={{ fontSize: "clamp(13px, 1vw, 15px)", whiteSpace: "pre-line" }}
          >
            {slogan}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
