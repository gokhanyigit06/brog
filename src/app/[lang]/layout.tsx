import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { locales } from "@/i18n";
import "../globals.css";
import LenisProvider from "@/components/providers/lenis-provider";
import Analytics from "@/components/analytics";

// Bu, kamuya açık sitenin KÖK layout'udur (app/layout.tsx kaldırıldı).
// <html lang> artık server'da doğru dile ayarlanıyor — /en sayfaları için de.
// (Eski çözüm: client-only HtmlLang bileşeni; SSR HTML'i "tr" kalıyordu.)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Vogolab — Ankara Web Tasarım, Reklam & SEO Ajansı",
  description:
    "Ankara merkezli dijital ajans Vogolab: markaya özel web siteleri, Meta & Google reklam yönetimi ve uçtan uca SEO. Ankara ve çevre illerdeki işletmeler için sonuç odaklı dijital büyüme.",
  icons: {
    icon: [{ url: "/vogolab-vg-mark.svg", type: "image/svg+xml" }],
    apple: "/vogolab-vg-mark.svg",
  },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LenisProvider>{children}</LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
