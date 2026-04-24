"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Phase = "idle" | "card1" | "card2" | "expand" | "text";

const CARD_COLORS = [
  "linear-gradient(160deg, #1c2f45 0%, #0e1c2a 100%)",
  "linear-gradient(160deg, #0a2540 0%, #07182a 100%)",
];

const EASE = [0.22, 1, 0.36, 1] as const;

interface HeroSectionProps {
  lang: string;
}

export default function HeroSection({ lang }: HeroSectionProps) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("card1"), 500);
    const t2 = setTimeout(() => setPhase("card2"), 1200);
    const t3 = setTimeout(() => setPhase("expand"), 2100);
    const t4 = setTimeout(() => setPhase("text"), 3400);
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

      {/* ── Kart 1: küçük, merkezin biraz üstü, alttan yukarı gelir ── */}
      <motion.div
        initial={{ opacity: 0, y: 160 }}
        animate={{
          opacity: phase === "card1" || phase === "card2" ? 1 : 0,
          y: phase === "idle" ? 160 : 0,
        }}
        transition={{ duration: 0.95, ease: EASE }}
        style={{
          position: "absolute",
          top: "26%",
          left: "50%",
          translateX: "-50%",
          width: "42%",
          aspectRatio: "16/9",
          borderRadius: 10,
          background: CARD_COLORS[0],
          zIndex: 2,
        }}
      />

      {/* ── Kart 2 / Hero: alttan yukarı gelir, sonra scale ile hero'ya açılır ── */}
      {/*
        inset-0 ile tam ekran div.
        card2 aşamasında: scale(0.50) + y(50px) → küçük kart gibi görünür, kart 1'in biraz altında
        expand aşamasında: scale(1) + y(0) + borderRadius(0) → hero'ya açılır
      */}
      <motion.div
        className="absolute inset-0"
        style={{ background: CARD_COLORS[1], zIndex: 3, originX: "50%", originY: "50%" }}
        initial={{ opacity: 0, scale: 0.48, y: 220, borderRadius: 12 }}
        animate={
          isExpanded
            ? { opacity: 1, scale: 1, y: 0, borderRadius: 0 }
            : phase === "card2"
            ? { opacity: 1, scale: 0.48, y: 40, borderRadius: 12 }
            : { opacity: 0, scale: 0.48, y: 220, borderRadius: 12 }
        }
        transition={
          isExpanded
            ? {
                opacity: { duration: 0.5 },
                scale: { duration: 1.3, ease: EASE },
                y: { duration: 1.3, ease: EASE },
                borderRadius: { duration: 1.3, ease: EASE },
              }
            : {
                opacity: { duration: 0.85, ease: EASE },
                y: { duration: 0.95, ease: EASE },
              }
        }
      >
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </motion.div>

      {/* ── Beyaz gradient — hero açıldıktan sonra alttan yavaşça gelir ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showText ? 1 : 0 }}
        transition={{ duration: 2.0, delay: 0.5, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none"
        style={{
          height: "30%",
          background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* ── Yazı overlay ── */}
      <div className="section-container absolute inset-0 z-20 pointer-events-none pt-[70px] pb-12">
        <div className="relative h-full w-full">

          {/* Brog® — sol üst */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="absolute left-0 text-white font-black leading-none tracking-tight select-none"
            style={{ fontSize: "clamp(86px, 11.5vw, 154px)", top: "8%" }}
          >
            VOGO®
          </motion.h1>

          {/* Studio — sağ orta */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            className="absolute right-0 text-white font-black leading-none tracking-tight select-none"
            style={{ fontSize: "clamp(72px, 9.5vw, 128px)", top: "40%" }}
          >
            Studio
          </motion.p>

          {/* Servisler — sol alt */}
          <motion.ul
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 14 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="absolute bottom-0 left-0 space-y-0.5"
          >
            {services.map((s) => (
              <li
                key={s}
                className="text-white font-bold uppercase tracking-widest leading-snug"
                style={{ fontSize: "clamp(11px, 1.15vw, 14px)" }}
              >
                {s}
              </li>
            ))}
          </motion.ul>

          {/* Slogan — sağ alt */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 14 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="absolute bottom-0 right-0 text-white leading-relaxed text-right"
            style={{
              fontSize: "clamp(12px, 1vw, 14px)",
              maxWidth: "320px",
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
