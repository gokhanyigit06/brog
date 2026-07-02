// Teklif sayfası CTA yardımcıları — WhatsApp, arama, forma kaydırma, dönüşüm takibi.
// Tüm butonlar tek kaynaktan beslensin diye burada toplanır.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sadece rakam ve baştaki + işaretini bırakır. */
export function onlyDigits(s: string): string {
  return (s || "").replace(/[^\d]/g, "");
}

/**
 * WhatsApp sohbet linki. `number` boşsa `fallbackPhone`'dan hane türetir.
 * wa.me formatı: rakamlar, + ve boşluk olmadan.
 */
export function buildWhatsAppUrl(number: string, text: string, fallbackPhone = ""): string {
  const digits = onlyDigits(number) || onlyDigits(fallbackPhone);
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** tel: linki. */
export function buildTelUrl(phone: string): string {
  return `tel:${(phone || "").replace(/[^\d+]/g, "")}`;
}

/** #teklif formuna yumuşak kaydırır. */
export function scrollToForm(): void {
  if (typeof document === "undefined") return;
  document.getElementById("teklif")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Form başarısında dönüşüm eventi (env yoksa fbq/gtag tanımsız → sessiz geçer). */
export function trackLead(service?: string): void {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead", service ? { content_category: service } : undefined);
  window.gtag?.("event", "generate_lead", service ? { service } : undefined);
}

/** WhatsApp / arama tıklamasında hafif event. */
export function trackContactClick(kind: "whatsapp" | "call"): void {
  if (typeof window === "undefined") return;
  window.fbq?.("trackCustom", kind === "whatsapp" ? "WhatsAppClick" : "CallClick");
  window.gtag?.("event", kind === "whatsapp" ? "whatsapp_click" : "call_click");
}
