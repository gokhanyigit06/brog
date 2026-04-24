"use client";

import { useEffect, useState } from "react";
import { getMarqueeContent, type MarqueeContent } from "@/lib/content";

const SEPARATOR = "·";

export default function MarqueeSection() {
  const [content, setContent] = useState<MarqueeContent>({
    items: ["BRANDING", "DESIGN", "DEVELOPMENT", "PHOTOGRAPHY", "MARKETING", "STRATEGY", "MOTION", "UX/UI"],
    speed: 30,
  });

  useEffect(() => {
    getMarqueeContent().then(setContent);
  }, []);

  const items = content.items.length > 0 ? content.items : ["BRANDING", "DESIGN", "DEVELOPMENT", "PHOTOGRAPHY", "MARKETING"];

  // Repeat enough times to fill wide screens seamlessly
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <>
      {/* Inject keyframe animation */}
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll ${content.speed}s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          overflow: "hidden",
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
          paddingTop: 28,
          paddingBottom: 28,
          /* Edge fade mask */
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="marquee-track"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            whiteSpace: "nowrap",
            width: "max-content",
          }}
        >
          {repeated.map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  color: "#0a0a0a",
                  textTransform: "uppercase",
                  padding: "0 40px",
                }}
              >
                {item}
              </span>
              <span style={{ color: "#9ca3af", fontSize: 10 }}>{SEPARATOR}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
