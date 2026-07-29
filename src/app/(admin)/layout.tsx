import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AdminSidebar from "@/components/admin/sidebar";

// Admin paneli kendi KÖK layout'u (route group ile ayrı root). app/layout.tsx
// kaldırıldığı için globals.css ve fontları burada da içeri almak gerekir.
// Analytics bilinçli olarak YOK — iç panelde GA/Pixel çalışmasın.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 text-white antialiased`}
        suppressHydrationWarning
      >
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
