import { locales, defaultLocale } from "@/i18n";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

/**
 * canonical + hreflang (alternates) üretir.
 * Google'a tr/en sürümlerinin aynı sayfa olduğunu bildirir.
 *
 * @param lang mevcut dil kodu (tr | en)
 * @param path dil önekinden SONRAKİ yol; ana sayfa için "", örn "/hizmetler" veya `/blog/${slug}`
 */
export function altLanguages(
  lang: string,
  path = "",
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${path}`;
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${path}`;
  return { canonical: `${SITE_URL}/${lang}${path}`, languages };
}
