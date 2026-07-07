"use client";

import { useEffect, useState } from "react";
import { getClientLogos, type ClientLogo } from "@/lib/content";

interface Props {
  initialLogos?: ClientLogo[];
  label?: string;
  title?: string;
}

/** Dairesel rozetlerde müşteri logoları ("Çalıştığımız Markalar"). Boşsa gizli. */
export default function ClientLogosGrid({ initialLogos, label = "Referanslar", title = "Çalıştığımız Markalar" }: Props) {
  const [logos, setLogos] = useState<ClientLogo[]>(initialLogos ?? []);

  useEffect(() => {
    if (initialLogos && initialLogos.length > 0) return;
    getClientLogos().then((d) => setLogos(d.logos || [])).catch(() => {});
  }, [initialLogos]);

  const list = [...logos].sort((a, b) => a.order - b.order);
  if (!list.length) return null;

  return (
    <section style={{ background: "#fff", width: "100%" }}>
      <div className="section-container" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>{label}</p>
          <h2 style={{ fontSize: "clamp(34px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0a0a0a", margin: 0 }}>{title}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 24, justifyItems: "center" }}>
          {list.map((l) => (
            <div
              key={l.id}
              style={{ width: 140, height: 140, borderRadius: "50%", background: "#fff", border: "1px solid #eef0f2", boxShadow: "0 12px 34px -20px rgba(0,0,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center", padding: 26 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.logoUrl} alt={l.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: "grayscale(1)", opacity: 0.8 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
