"use client";

import { useState, useEffect } from "react";
import { getHeroContent, saveHeroContent, type HeroContent } from "@/lib/content";
import { Save, Plus, Trash2, RefreshCw } from "lucide-react";

export default function AnasayfaAdmin() {
  const [data, setData] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getHeroContent().then((d) => { setData(d); setLoading(false); });
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    await saveHeroContent(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function updateService(lang: "tr" | "en", idx: number, val: string) {
    if (!data) return;
    const key = lang === "tr" ? "services_tr" : "services_en";
    const arr = [...data[key]];
    arr[idx] = val;
    setData({ ...data, [key]: arr });
  }

  function addService() {
    if (!data) return;
    setData({
      ...data,
      services_tr: [...data.services_tr, ""],
      services_en: [...data.services_en, ""],
    });
  }

  function removeService(idx: number) {
    if (!data) return;
    setData({
      ...data,
      services_tr: data.services_tr.filter((_, i) => i !== idx),
      services_en: data.services_en.filter((_, i) => i !== idx),
    });
  }

  if (loading) return <AdminLoader />;

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Anasayfa</h1>
          <p className="text-zinc-400 text-sm mt-1">Hero bölümü içeriklerini düzenle</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Kaydedildi ✓" : "Kaydet"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Başlıklar */}
        <Card title="Ana Başlıklar">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Büyük Başlık (VOGO)">
              <input
                value={data!.title_main}
                onChange={(e) => setData({ ...data!, title_main: e.target.value })}
                className={INPUT}
              />
            </Field>
            <Field label="Alt Başlık (lab.)">
              <input
                value={data!.title_sub}
                onChange={(e) => setData({ ...data!, title_sub: e.target.value })}
                className={INPUT}
              />
            </Field>
          </div>
        </Card>

        {/* Hizmetler */}
        <Card title="Hizmetler Listesi">
          <div className="space-y-2">
            {data!.services_tr.map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-zinc-600 text-xs w-5 text-right">{idx + 1}</span>
                <input
                  value={data!.services_tr[idx]}
                  onChange={(e) => updateService("tr", idx, e.target.value)}
                  placeholder="Türkçe"
                  className={`${INPUT} flex-1`}
                />
                <input
                  value={data!.services_en[idx]}
                  onChange={(e) => updateService("en", idx, e.target.value)}
                  placeholder="English"
                  className={`${INPUT} flex-1`}
                />
                <button
                  onClick={() => removeService(idx)}
                  className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addService}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mt-2"
            >
              <Plus size={14} /> Hizmet Ekle
            </button>
          </div>
        </Card>

        {/* Slogan */}
        <Card title="Slogan">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Türkçe">
              <textarea
                value={data!.slogan_tr}
                onChange={(e) => setData({ ...data!, slogan_tr: e.target.value })}
                rows={4}
                className={`${INPUT} resize-none`}
              />
            </Field>
            <Field label="English">
              <textarea
                value={data!.slogan_en}
                onChange={(e) => setData({ ...data!, slogan_en: e.target.value })}
                rows={4}
                className={`${INPUT} resize-none`}
              />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Shared UI helpers ────────────────────────
const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function AdminLoader() {
  return (
    <div className="p-8 flex items-center gap-3 text-zinc-500">
      <RefreshCw size={16} className="animate-spin" />
      Yükleniyor...
    </div>
  );
}
