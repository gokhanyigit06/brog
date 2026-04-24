"use client";

import { useEffect, useState } from "react";
import { getFaqContent, type FaqContent, type FaqItem } from "@/lib/content";
import { useSiteConfig } from "@/hooks/use-site-config";

interface Props { lang: string }

function AccordionItem({ item, lang }: { item: FaqItem; lang: string }) {
  const [open, setOpen] = useState(false);
  const question = lang === "tr" ? item.question_tr : item.question_en;
  const answer   = lang === "tr" ? item.answer_tr   : item.answer_en;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "26px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 500, color: "#0a0a0a", lineHeight: 1.4, flex: 1 }}>
          {question}
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 300,
            color: "#0a0a0a",
            flexShrink: 0,
            lineHeight: 1,
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          +
        </span>
      </button>

      {/* Answer — animated height */}
      <div
        style={{
          maxHeight: open ? "400px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <p style={{ fontSize: 14, lineHeight: 1.75, color: "#4b5563", paddingBottom: 24 }}>
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FaqSection({ lang }: Props) {
  const [content, setContent] = useState<FaqContent | null>(null);
  const config = useSiteConfig();

  useEffect(() => { getFaqContent().then(setContent); }, []);

  if (config && !(config as any).showFaq && (config as any).showFaq !== undefined) return null;

  const title = lang === "tr" ? content?.title_tr : content?.title_en;
  const items = [...(content?.items ?? [])].sort((a, b) => a.order - b.order);

  const fallback: FaqItem[] = [
    { id: "1", question_tr: "Tipik teslim süreniz nedir?", question_en: "What is your typical turnaround time?", answer_tr: "Küçük projeler 1–2 hafta, büyük projeler 4–8 hafta sürmektedir.", answer_en: "Small projects take 1–2 weeks, larger ones 4–8 weeks.", order: 0 },
    { id: "2", question_tr: "Özel tasarım çözümleri sunuyor musunuz?", question_en: "Do you offer custom design solutions?", answer_tr: "Evet, markanıza ve hedeflerinize özel çözümler geliştiriyoruz.", answer_en: "Yes, we develop solutions tailored to your brand and goals.", order: 1 },
    { id: "3", question_tr: "Hangi sektörlerde uzmanlaşıyorsunuz?", question_en: "What industries do you specialize in?", answer_tr: "Teknoloji, moda, sağlık, fintech ve yaratıcı endüstriler.", answer_en: "Tech, fashion, health, fintech and creative industries.", order: 2 },
    { id: "4", question_tr: "Hem tasarım hem geliştirmeyi üstlenebilir misiniz?", question_en: "Can you handle both design and development?", answer_tr: "Evet, uçtan uca hizmet sunuyoruz.", answer_en: "Yes, we offer end-to-end services.", order: 3 },
    { id: "5", question_tr: "Lansman sonrası destek sağlıyor musunuz?", question_en: "Do you provide post-launch support?", answer_tr: "Evet, tüm projelerimizde bakım planları sunuyoruz.", answer_en: "Yes, we offer maintenance plans for all projects.", order: 4 },
  ];

  const displayItems = items.length > 0 ? items : fallback;

  return (
    <section className="w-full bg-white">
      <div className="section-container py-20 lg:py-28">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

          {/* LEFT: label + massive title */}
          <div style={{ position: "sticky", top: 120 }}>
            <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, letterSpacing: "0.06em", marginBottom: 28 }}>
              ({content?.label ?? "05"}) {lang === "tr" ? "SSS" : "FAQ"}
            </p>
            <h2 style={{
              fontSize: "clamp(52px, 7.5vw, 96px)",
              fontWeight: 900,
              lineHeight: 0.95,
              color: "#0a0a0a",
              letterSpacing: "-0.04em",
              whiteSpace: "pre-line",
            }}>
              {title ?? (lang === "tr" ? "Sıkça\nSorulan\nSorular" : "Frequently\nAsked\nQuestions")}
            </h2>
          </div>

          {/* RIGHT: accordion */}
          <div>
            {displayItems.map((item, idx) => (
              <div key={item.id}>
                <AccordionItem item={item} lang={lang} />
                {idx < displayItems.length - 1 && (
                  <div style={{ borderTop: "1px solid #e5e7eb" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
