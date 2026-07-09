"use client";

import Image from "next/image";
import { useState } from "react";
import LazyVideo from "@/components/ui/lazy-video";

interface Props {
  imageUrl?: string;
  videoUrl?: string;
  link?: string;
  alt?: string;
  sizes?: string;
  /** Gövde en-boy oranı (varsayılan 16/10) */
  ratio?: string;
}

function hostFromLink(link?: string): string {
  if (!link) return "";
  try {
    const u = new URL(link.startsWith("http") ? link : `https://${link}`);
    return u.host.replace(/^www\./, "");
  } catch {
    return link.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

/**
 * Ekran görüntüsünü tarayıcı penceresi çerçevesinde sunan premium kapak.
 * Tüm proje yüzeylerinde (listeleme, ana sayfa, teklif) ortak kullanılır.
 */
export default function BrowserMockup({ imageUrl, videoUrl, link, alt = "", sizes = "100vw", ratio = "16 / 10" }: Props) {
  const [hovered, setHovered] = useState(false);
  const host = hostFromLink(link);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        border: `1px solid ${hovered ? "var(--accent)" : "#e5e7eb"}`,
        boxShadow: hovered
          ? "0 34px 66px -24px rgba(37,99,235,0.30)"
          : "0 20px 48px -28px rgba(0,0,0,0.38)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.45s cubic-bezier(.4,0,.2,1), box-shadow 0.45s ease, border-color 0.3s ease",
      }}
    >
      {/* Tarayıcı chrome barı */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", height: 38, background: "#f7f7f8", borderBottom: "1px solid #ececed" }}>
        <span style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <i key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#d1d5db", display: "block" }} />
          ))}
        </span>
        {host && (
          <span style={{ marginLeft: 8, flex: 1, maxWidth: 340, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 999, fontSize: 12, color: "#6b7280", padding: "4px 12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {host}
          </span>
        )}
      </div>

      {/* Gövde — ekran görüntüsü */}
      <div style={{ position: "relative", width: "100%", aspectRatio: ratio, background: "#e5e7eb" }}>
        {videoUrl ? (
          <LazyVideo
            src={videoUrl}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.03)" : "scale(1)", transition: "transform 0.8s cubic-bezier(.4,0,.2,1)" }}
          />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes={sizes}
            style={{ objectFit: "cover", objectPosition: "top", transform: hovered ? "scale(1.03)" : "scale(1)", transition: "transform 0.8s cubic-bezier(.4,0,.2,1)" }}
          />
        ) : null}
      </div>
    </div>
  );
}
