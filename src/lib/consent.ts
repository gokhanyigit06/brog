// Çerez onayı — tek kaynak. Banner onayı yazar, Analytics bunu okuyup script'leri
// yalnız onaydan SONRA yükler (KVKK/GDPR). Karar localStorage'da tutulur; değişince
// aynı sekmedeki dinleyicilere custom event ile haber verilir.

export const CONSENT_KEY = "vg_cookie_consent";
export const CONSENT_EVENT = "vg-consent-change";

export type ConsentValue = "granted" | "denied";

/** SSR-güvenli okuma. Karar verilmemişse null. */
export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

/** Kararı kaydeder ve aynı sekmedeki dinleyicileri uyarır. */
export function setConsent(value: ConsentValue): void {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
