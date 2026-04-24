"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getHeroContent, type HeroContent } from "@/lib/content";

type Phase = "idle" | "card1" | "card2" | "card3" | "expand" | "text";

const CARD_COLORS = [
  "linear-gradient(160deg, #1a2d42 0%, #0d1c2e 100%)",
  "linear-gradient(160deg, #142236 0%, #0a1828 100%)",
  "linear-gradient(160deg, #0a2540 0%, #07182a 100%)",
];

const EASE = [0.22, 1, 0.36, 1] as const;

interface HeroSectionProps {
  lang: string;
}

export default function HeroSection({ lang }: HeroSectionProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [content, setContent] = useState<HeroContent | null>(null);

  const [contentReady, setContentReady] = useState(false);

  // Load Firebase content first
  useEffect(() => {
    // Max 1.5s wait — then proceed with defaults
    const timeout = setTimeout(() => setContentReady(true), 1500);
    getHeroContent().then((data) => {
      setContent(data);
      setContentReady(true);
      clearTimeout(timeout);
    }).catch(() => setContentReady(true));
    return () => clearTimeout(timeout);
  }, []);

  // Animation sequence — only starts after content is ready
  useEffect(() => {
    if (!contentReady) return;
    const t1 = setTimeout(() => setPhase("card1"), 300);
    const t2 = setTimeout(() => setPhase("card2"), 1050);
    const t3 = setTimeout(() => setPhase("card3"), 1800);
    const t4 = setTimeout(() => setPhase("expand"), 2600);
    const t5 = setTimeout(() => setPhase("text"), 3900);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [contentReady]);

  const isExpanded = phase === "expand" || phase === "text";
  const showText = phase === "text";

  const card1Visible = phase === "card1" || phase === "card2" || phase === "card3";
  const card2Visible = phase === "card2" || phase === "card3";

  const services = content
    ? (lang === "tr" ? content.services_tr : content.services_en)
    : (lang === "tr"
        ? ["MARKA", "TASARIM", "GELİŞTİRME", "FOTOĞRAF", "PAZARLAMA"]
        : ["BRANDING", "DESIGN", "DEVELOPMENT", "PHOTOGRAPHY", "MARKETING"]);

  const slogan = content
    ? (lang === "tr" ? content.slogan_tr : content.slogan_en)
    : (lang === "tr"
        ? "Büyümeyi hızlandıran iş çözümleri üretiyoruz —\nverimli, ölçeklenebilir ve sonuç odaklı."
        : "We build business solutions that drive real growth —\nefficient, scalable, and profit-focused.");

  const titleMain = content?.title_main ?? "VOGO";
  const titleSub  = content?.title_sub  ?? "lab.";

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
          overflow: "hidden",
          zIndex: 2,
          backgroundImage: content?.card1Image ? undefined : CARD_COLORS[0],
        }}
      >
        {content?.card1Image && (
          <img src={content.card1Image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
      </motion.div>

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
          overflow: "hidden",
          zIndex: 3,
          backgroundImage: content?.card2Image ? undefined : CARD_COLORS[1],
        }}
      >
        {content?.card2Image && (
          <img src={content.card2Image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
      </motion.div>

      {/* ── Kart 3 / Hero: alttan gelir, sonra tam ekrana aışlır ── */}
      <motion.div
        className="absolute inset-0"
        style={{ originX: "50%", originY: "50%", zIndex: 4, overflow: "hidden", backgroundImage: content?.card3Image ? undefined : CARD_COLORS[2] }}
        initial={{ opacity: 0, scale: 0.65, y: 260, borderRadius: 12 }}
        animate={
          isExpanded
            ? { opacity: 1, scale: 1, y: 0, borderRadius: "0 0 24px 24px" }
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
        {/* Background image (only when URL set) */}
        {content?.card3Image && (
          <img src={content.card3Image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)", zIndex: 1 }}
        />
      </motion.div>

      {/* ── Sayfa arka planı için alt beyaz alan ── */}
      <div className="section-container absolute inset-0 z-20 pointer-events-none pt-[70px] pb-12">
        <div className="relative h-full w-full">

          {/* VOGO® — sol, biraz aşağı */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="absolute left-0 text-white font-black leading-none tracking-tight select-none"
            style={{ fontSize: "clamp(86px, 11.5vw, 154px)", top: "calc(3% + 40px)" }}
          >
            {titleMain}
          </motion.h1>

          {/* Studio — sağ orta */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            className="absolute right-0 text-white font-black leading-none tracking-tight select-none"
            style={{ fontSize: "clamp(61px, 8vw, 109px)", top: "38%" }}
          >
            {titleSub}
          </motion.p>

          {/* Servisler — sol alt */}
          <motion.ul
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 14 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="absolute left-0 space-y-1"
            style={{ top: "55%" }}>
            {services.map((s) => (
              <li
                key={s}
                className="text-white font-bold uppercase tracking-widest leading-tight"
                style={{ fontSize: "clamp(20px, 2.2vw, 28px)" }}
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
            className="absolute right-0 text-white font-bold leading-snug text-left"
            style={{
              fontSize: "clamp(22px, 2.5vw, 34px)",
              whiteSpace: "pre-line",
              top: "62%",
              left: "50%",
            }}
          >
            {slogan}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
