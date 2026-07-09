import type { Metadata } from "next";
import { locales } from "@/i18n";
import LenisProvider from "@/components/providers/lenis-provider";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Vogolab — Ankara Web Tasarım, Reklam & SEO Ajansı",
  description: "Ankara merkezli dijital ajans Vogolab: markaya özel web siteleri, Meta & Google reklam yönetimi ve uçtan uca SEO. Ankara ve çevre illerdeki işletmeler için sonuç odaklı dijital büyüme.",
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
  await params;
  return <LenisProvider>{children}</LenisProvider>;
}
