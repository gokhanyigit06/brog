"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, saveSiteSettings, type SiteSettings } from "@/lib/content";
import { Save, RefreshCw } from "lucide-react";

const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";

export default function AyarlarAdmin() {
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteSettings().then((d) => { setData(d); setLoading(false); });
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    await saveSiteSettings(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="p-8 flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
          <p className="text-zinc-400 text-sm mt-1">Navbar ve sosyal medya bilgileri</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Kaydedildi ✓" : "Kaydet"}
        </button>
      </div>

      <div className="space-y-6">
        {/* İletişim bilgileri */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">İletişim Bilgileri (Navbar)</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">E-posta</label>
              <input value={data!.email} onChange={(e) => setData({ ...data!, email: e.target.value })} className={INPUT} placeholder="hello@vogolab.com" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Telefon</label>
              <input value={data!.phone} onChange={(e) => setData({ ...data!, phone: e.target.value })} className={INPUT} placeholder="+90 555 000 0000" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Konum</label>
              <input value={data!.location} onChange={(e) => setData({ ...data!, location: e.target.value })} className={INPUT} placeholder="Istanbul, Turkey" />
            </div>
          </div>
        </div>

        {/* Sosyal medya */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Sosyal Medya (Menü)</h2>
          <div className="space-y-3">
            {(["social_x", "social_dribbble", "social_instagram", "social_linkedin"] as const).map((key) => {
              const labels: Record<string, string> = {
                social_x: "X.com",
                social_dribbble: "Dribbble",
                social_instagram: "Instagram",
                social_linkedin: "LinkedIn",
              };
              return (
                <div key={key}>
                  <label className="block text-xs text-zinc-500 mb-1.5">{labels[key]}</label>
                  <input
                    value={data![key]}
                    onChange={(e) => setData({ ...data!, [key]: e.target.value })}
                    className={INPUT}
                    placeholder="https://..."
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
