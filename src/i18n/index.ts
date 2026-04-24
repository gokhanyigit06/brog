import { tr } from "./tr";
import { en } from "./en";
import type { Translations } from "./tr";

export type Locale = "tr" | "en";

export const locales: Locale[] = ["tr", "en"];
export const defaultLocale: Locale = "tr";

export function getTranslations(locale: Locale): Translations {
  const dict: Record<Locale, Translations> = { tr, en };
  return dict[locale] ?? tr;
}

export { tr, en };
export type { Translations };
