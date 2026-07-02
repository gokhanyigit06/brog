"use client";

import type { SiteSettings } from "@/lib/content";
import { buildWhatsAppUrl, buildTelUrl, scrollToForm, trackContactClick } from "./cta-utils";

interface Props {
  settings: SiteSettings;
}

/** Sadece mobilde (≤767px) görünen sabit alt aksiyon çubuğu. */
export default function StickyCtaBar({ settings }: Props) {
  const waUrl = buildWhatsAppUrl(settings.whatsapp || "", settings.waMessage || "", settings.phone);
  const telUrl = buildTelUrl(settings.phone);

  return (
    <>
      <div className="sticky-cta">
        <a href={telUrl} className="sticky-cta__btn sticky-cta__ghost" onClick={() => trackContactClick("call")}>Ara</a>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="sticky-cta__btn sticky-cta__ghost" onClick={() => trackContactClick("whatsapp")}>WhatsApp</a>
        <button className="sticky-cta__btn sticky-cta__primary" onClick={scrollToForm}>Teklif Al</button>
      </div>
      <style>{`
        .sticky-cta { display: none; }
        @media (max-width: 767px) {
          .sticky-cta {
            display: grid;
            grid-template-columns: 1fr 1fr 1.2fr;
            gap: 8px;
            position: fixed;
            left: 0; right: 0; bottom: 0;
            z-index: 45;
            padding: 10px 14px calc(10px + env(safe-area-inset-bottom, 0px));
            background: rgba(10,10,10,0.92);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-top: 1px solid rgba(255,255,255,0.12);
          }
          .sticky-cta__btn {
            display: inline-flex; align-items: center; justify-content: center;
            height: 46px; border-radius: 999px; font-size: 14px; font-weight: 700;
            text-decoration: none; border: none; cursor: pointer;
          }
          .sticky-cta__ghost { background: rgba(255,255,255,0.1); color: #fff; }
          .sticky-cta__primary { background: #fff; color: #0a0a0a; }
        }
      `}</style>
    </>
  );
}
