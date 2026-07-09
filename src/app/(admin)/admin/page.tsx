"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLeads, getProjects, type Lead } from "@/lib/content";
import { getAllPosts } from "@/lib/blog";

const SERVICE_LABELS: Record<string, string> = {
  web: "Web Sitesi",
  reklam: "Reklam",
  seo: "SEO",
  hepsi: "Hepsi",
  diger: "Diğer",
};

const SOURCE_LABELS: Record<string, string> = {
  "teklif-form": "Teklif sayfası",
  "iletisim-form": "İletişim sayfası",
  "footer-form": "Footer",
};

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [postCount, setPostCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getLeads(), getProjects(), getAllPosts(true)]).then(([l, p, b]) => {
      if (l.status === "fulfilled") setLeads(l.value);
      if (p.status === "fulfilled") setProjectCount(p.value.length);
      if (b.status === "fulfilled") setPostCount(b.value.length);
      setLoading(false);
    });
  }, []);

  const newLeads = leads.filter((l) => l.status === "new");

  const stats = [
    { label: "Yeni Talep", value: loading ? "…" : String(newLeads.length), href: "/admin/leads", accent: newLeads.length > 0 },
    { label: "Toplam Talep", value: loading ? "…" : String(leads.length), href: "/admin/leads", accent: false },
    { label: "Proje", value: projectCount === null ? "…" : String(projectCount), href: "/admin/projeler", accent: false },
    { label: "Yayında Yazı", value: postCount === null ? "…" : String(postCount), href: "/admin/blog", accent: false },
  ];

  const pages = [
    { slug: "leads", label: "Gelen Talepler", href: "/admin/leads", icon: "📥" },
    { slug: "projeler", label: "Projeler", href: "/admin/projeler", icon: "💼" },
    { slug: "blog", label: "Blog", href: "/admin/blog", icon: "✍️" },
    { slug: "anasayfa", label: "Anasayfa", href: "/admin/anasayfa", icon: "🏠" },
    { slug: "hizmetler", label: "Hizmetler", href: "/admin/hizmetler", icon: "⚙️" },
    { slug: "hakkimizda", label: "Hakkımızda", href: "/admin/hakkimizda", icon: "👥" },
    { slug: "teklif-vitrin", label: "Teklif Vitrini", href: "/admin/teklif-vitrin", icon: "🖼️" },
    { slug: "logolar", label: "Müşteri Logoları", href: "/admin/logolar", icon: "🔖" },
    { slug: "iletisim", label: "İletişim", href: "/admin/iletisim", icon: "📬" },
    { slug: "ayarlar", label: "Ayarlar", href: "/admin/ayarlar", icon: "🔧" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Site özeti — talepler, içerikler ve hızlı erişim.
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`block p-5 rounded-xl border transition-all ${
              s.accent
                ? "bg-blue-600/15 border-blue-500/50 hover:border-blue-400"
                : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
            }`}
          >
            <div className={`text-3xl font-black ${s.accent ? "text-blue-400" : "text-white"}`}>{s.value}</div>
            <p className="text-zinc-400 text-sm mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Son talepler */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Son Talepler</h2>
          <Link href="/admin/leads" className="text-sm text-blue-400 hover:text-blue-300">Tümünü gör →</Link>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800 overflow-hidden">
          {loading ? (
            <p className="p-5 text-zinc-500 text-sm">Yükleniyor…</p>
          ) : leads.length === 0 ? (
            <p className="p-5 text-zinc-500 text-sm">Henüz talep yok. Formlardan gelen kayıtlar burada görünecek.</p>
          ) : (
            leads.slice(0, 5).map((l) => (
              <Link key={l.id} href="/admin/leads" className="flex items-center gap-4 p-4 hover:bg-zinc-800/60 transition-colors">
                {l.status === "new" && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{l.name}</p>
                  <p className="text-zinc-500 text-xs truncate">{l.phone || l.email || "—"}</p>
                </div>
                <span className="text-xs text-zinc-400 bg-zinc-800 rounded-full px-2.5 py-1 shrink-0">
                  {SERVICE_LABELS[l.service] || l.service}
                </span>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-zinc-400 text-xs">{SOURCE_LABELS[l.source] || l.source}</p>
                  <p className="text-zinc-600 text-xs">{fmtDate(l.createdAt)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Hızlı erişim */}
      <h2 className="text-white font-semibold mb-3">Sayfalar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={page.href}
            className="group block p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 hover:bg-zinc-800 transition-all"
          >
            <div className="text-2xl mb-2">{page.icon}</div>
            <h3 className="text-white font-semibold">{page.label}</h3>
            <p className="text-zinc-500 text-sm mt-0.5">Düzenle →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
