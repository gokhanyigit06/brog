"use client";

import Link from "next/link";

/** Masaüstünde sağ kenarda sabit dikey "Teklif Al" sekmesi (accent). Mobilde gizli. */
export default function StickyCta({ lang }: { lang: string }) {
  return (
    <>
      <Link href={`/${lang}/teklif`} className="sticky-cta-tab" aria-label="Ücretsiz Teklif Al">
        Teklif Al ↗
      </Link>
      <style>{`
        .sticky-cta-tab {
          position: fixed; right: 0; top: 50%; transform: translateY(-50%);
          z-index: 40; background: var(--accent); color: var(--accent-ink);
          writing-mode: vertical-rl;
          padding: 20px 11px; border-radius: 12px 0 0 12px;
          font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; box-shadow: -10px 0 28px -14px rgba(37,99,235,0.55);
          transition: padding 0.2s ease;
        }
        .sticky-cta-tab:hover { padding-right: 17px; }
        @media (max-width: 900px) { .sticky-cta-tab { display: none; } }
      `}</style>
    </>
  );
}
