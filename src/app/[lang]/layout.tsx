import type { Metadata } from "next";
import { locales } from "@/i18n";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Brog Agency",
  description: "Creative Agency",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // lang is used by root layout via <html lang=...> — no nested html needed
  await params;
  return <>{children}</>;
}
