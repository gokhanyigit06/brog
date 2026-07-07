interface Props {
  tags?: string[];
  category?: string;
  max?: number;
  /** Koyu zeminde mi kullanılıyor (outline rengi değişir) */
  dark?: boolean;
}

/**
 * Proje hizmet etiketleri (pills). İlki accent-dolgulu, gerisi outline.
 * Kaynak: tags[] varsa onlar, yoksa category. Boşsa render etmez.
 */
export default function ServiceTags({ tags, category, max = 4, dark = false }: Props) {
  const list = (tags && tags.length ? tags : category ? [category] : [])
    .filter(Boolean)
    .slice(0, max);
  if (!list.length) return null;

  const outline = dark
    ? { background: "transparent", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.25)" }
    : { background: "transparent", color: "#374151", border: "1px solid #d1d5db" };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {list.map((t, i) => (
        <span
          key={`${t}-${i}`}
          style={{
            display: "inline-block",
            borderRadius: 999,
            padding: "6px 14px",
            fontSize: 12.5,
            fontWeight: 600,
            lineHeight: 1,
            ...(i === 0
              ? { background: "var(--accent)", color: "var(--accent-ink)", border: "1px solid var(--accent)" }
              : outline),
          }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}
