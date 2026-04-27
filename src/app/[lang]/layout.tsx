import type { Metadata } from "next";
import { locales } from "@/i18n";
import LenisProvider from "@/components/providers/lenis-provider";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "VOGOLAB",
  description: "Creative Agency",
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
