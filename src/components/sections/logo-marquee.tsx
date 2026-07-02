"use client";

import { useEffect, useState } from "react";
import { getClientLogos, type ClientLogo } from "@/lib/content";

interface Props {
  /** Server'dan gelen logolar (varsa client fetch atlanır). */
  initialLogos?: ClientLogo[];
  /** Logo yoksa akacak marka isimleri (yedek). */
  fallbackBrands?: string[];
  speed?: number;
}

export default function LogoMarquee({ initialLogos, fallbackBrands = [], speed = 40 }: Props) {
  const [logos, setLogos] = useState<ClientLogo[]>(initialLogos ?? []);

  useEffect(() => {
    if (initialLogos && initialLogos.length > 0) return;
    getClientLogos().then((d) => setLogos(d.logos || [])).catch(() => {});
  }, [initialLogos]);

  const sorted = [...logos].sort((a, b) => a.order - b.order);
  const hasLogos = sorted.length > 0;

  // Geniş ekranı kesintisiz doldurmak için içeriği çoğalt
  const logoTrack = hasLogos ? [...sorted, ...sorted, ...sorted, ...sorted] : [];
  const nameTrack = !hasLogos ? [...fallbackBrands, ...fallbackBrands, ...fallbackBrands, ...fallbackBrands] : [];

  if (!hasLogos && fallbackBrands.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes logo-marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .logo-marquee-track { animation: logo-marquee-scroll ${speed}s linear infinite; }
        .logo-marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <div
        style={{
          width: "100%",
          overflow: "hidden",
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
          paddingTop: hasLogos ? 26 : 28,
          paddingBottom: hasLogos ? 26 : 28,
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="logo-marquee-track" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", width: "max-content" }}>
          {hasLogos
            ? logoTrack.map((logo, i) => (
                <div key={i} style={{ display: "inline-flex", alignItems: "center", padding: "0 40px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    style={{ height: 40, width: "auto", maxWidth: 160, objectFit: "contain", filter: "grayscale(1)", opacity: 0.7, display: "block" }}
                  />
                </div>
              ))
            : nameTrack.map((name, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.18em", color: "#0a0a0a", textTransform: "uppercase", padding: "0 40px" }}>
                    {name.toLocaleUpperCase("tr-TR")}
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: 10 }}>·</span>
                </span>
              ))}
        </div>
      </div>
    </>
  );
}
