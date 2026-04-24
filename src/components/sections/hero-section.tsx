"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Phase = "idle" | "card1" | "card2" | "card3" | "expand" | "text";

const CARD_COLORS = [
  "linear-gradient(160deg, #1a2d42 0%, #0d1c2e 100%)",  // kart 1
  "linear-gradient(160deg, #142236 0%, #0a1828 100%)",  // kart 2
  "linear-gradient(160deg, #0a2540 0%, #07182a 100%)",  // kart 3 / hero
];

const EASE = [0.22, 1, 0.36, 1] as const;

interface HeroSectionProps {
  lang: string;
}

export default function HeroSection({ lang }: HeroSectionProps) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("card1"), 500);
    const t2 = setTimeout(() => setPhase("card2"), 1250);
    const t3 = setTimeout(() => setPhase("card3"), 2000);
    const t4 = setTimeout(() => setPhase("expand"), 2800);
    const t5 = setTimeout(() => setPhase("text"), 4100);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  const isExpanded = phase === "expand" || phase === "text";
  const showText = phase === "text";

  // Kart görünürlükleri
  const card1Visible = phase === "card1" || phase === "card2" || phase === "card3";
  const card2Visible = phase === "card2" || phase === "card3";

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

      {/* ── Kart 1: en küçük, üstte ── */}
      <motion.div
        initial={{ opacity: 0, y: 160 }}
        animate={{
          opacity: card1Visible ? 1 : 0,
          y: card1Visible ? 0 : 160,
        }}
        transition={{ duration: 0.95, ease: EASE }}
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          translateX: "-50%",
          width: "38%",
          aspectRatio: "16/9",
          borderRadius: 10,
          background: CARD_COLORS[0],
          zIndex: 2,
        }}
      />

      {/* ── Kart 2: orta boy, biraz altta ── */}
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{
          opacity: card2Visible ? 1 : 0,
          y: card2Visible ? 0 : 200,
        }}
        transition={{ duration: 0.95, ease: EASE }}
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          translateX: "-50%",
          width: "50%",
          aspectRatio: "16/9",
          borderRadius: 10,
          background: CARD_COLORS[1],
          zIndex: 3,
        }}
      />

      {/* ── Kart 3 / Hero: alttan gelir, sonra tam ekrana açılır ── */}
      <motion.div
        className="absolute inset-0"
        style={{ background: CARD_COLORS[2], originX: "50%", originY: "50%", zIndex: 4 }}
        initial={{ opacity: 0, scale: 0.65, y: 260, borderRadius: 12 }}
        animate={
          isExpanded
            ? { opacity: 1, scale: 1, y: 0, borderRadius: 0 }
            : phase === "card3"
            ? { opacity: 1, scale: 0.65, y: 60, borderRadius: 12 }
            : { opacity: 0, scale: 0.65, y: 260, borderRadius: 12 }
        }
        transition={
          isExpanded
            ? {
                opacity: { duration: 0.5 },
                scale: { duration: 1.35, ease: EASE },
                y: { duration: 1.35, ease: EASE },
                borderRadius: { duration: 1.35, ease: EASE },
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

      {/* ── Beyaz gradient — alttan yavaşça gelir ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showText ? 1 : 0 }}
        transition={{ duration: 2.0, delay: 0.5, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none"
        style={{
          height: "100px",
          background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 40%, transparent 100%)",
        }}
      />

      {/* ── Yazı overlay ── */}
      <div className="section-container absolute inset-0 z-20 pointer-events-none pt-[70px] pb-12">
        <div className="relative h-full w-full">

          {/* VOGO® — sol, biraz aşağı */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="absolute left-0 text-white font-black leading-none tracking-tight select-none"
            style={{ fontSize: "clamp(86px, 11.5vw, 154px)", top: "8%" }}
          >
            VOGO
          </motion.h1>

          {/* Studio — sağ orta */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            className="absolute right-0 text-white font-black leading-none tracking-tight select-none"
            style={{ fontSize: "clamp(61px, 8vw, 109px)", top: "40%" }}
          >
            lab.
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
