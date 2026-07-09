"use client";

import { useEffect } from "react";

/**
 * <html lang> root layout'ta sabit "tr"; EN rotalarında bunu düzeltir.
 * (Yanlış lang, CSS uppercase'in "I"yı "İ" yapmasına ve SEO'da yanlış dil
 * bildirimine yol açıyor.)
 */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
