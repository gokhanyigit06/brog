import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vogolab — Ankara Web Tasarım, Reklam & SEO Ajansı",
  description: "Ankara merkezli dijital ajans Vogolab: markaya özel web siteleri, Meta & Google reklam yönetimi ve uçtan uca SEO. Ankara ve çevre illerdeki işletmeler için sonuç odaklı dijital büyüme.",
  icons: {
    icon: [
      { url: "/vogolab-vg-mark.svg", type: "image/svg+xml" },
    ],
    apple: "/vogolab-vg-mark.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
