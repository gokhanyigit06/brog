"use client";

import { useState, useEffect } from "react";
import { getAboutContent, saveAboutContent, uploadImage, type AboutContent } from "@/lib/content";
import { Save, RefreshCw, Upload } from "lucide-react";

const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";

export default function HakkimizdaAdmin() {
  const [data, setData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getAboutContent().then((d) => { setData(d); setLoading(false); });
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    await saveAboutContent(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    const url = await uploadImage(file, `about/${Date.now()}_${file.name}`);
    setData((prev) => (prev ? { ...prev, image: url } : prev));
    setUploading(false);
  }

  if (loading || !data) return <div className="p-8 flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Hakkımızda</h1>
          <p className="text-zinc-400 text-sm mt-1">/tr/hakkimizda sayfası içeriği</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Kaydedildi ✓" : "Kaydet"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-1">Başlık</h2>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Başlık TR <span className="text-zinc-600">— boşsa &quot;Markaları dijitalde büyüten ekip.&quot; kullanılır</span></label>
            <input value={data.title_tr} onChange={(e) => setData({ ...data, title_tr: e.target.value })} className={INPUT} placeholder="Markaları dijitalde büyüten ekip." />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Title EN</label>
            <input value={data.title_en} onChange={(e) => setData({ ...data, title_en: e.target.value })} className={INPUT} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-1">Hikaye / Bio</h2>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Bio TR <span className="text-zinc-600">— çift satır = yeni paragraf. Boşsa hazır metin kullanılır.</span></label>
            <textarea value={data.bio_tr} onChange={(e) => setData({ ...data, bio_tr: e.target.value })} rows={8} className={`${INPUT} resize-none`} />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Bio EN</label>
            <textarea value={data.bio_en} onChange={(e) => setData({ ...data, bio_en: e.target.value })} rows={5} className={`${INPUT} resize-none`} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Görsel <span className="font-normal text-zinc-600 normal-case">— dikey (4:5) önerilir; boşsa logo deseni gösterilir</span></h2>
          <div className="flex items-center gap-4">
            <div className="w-32 h-40 rounded-lg bg-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
              {data.image
                ? <img src={data.image} alt="" className="w-full h-full object-cover" />
                : <span className="text-[10px] text-zinc-500">Görsel yok</span>}
            </div>
            <div className="space-y-2 flex-1">
              <input value={data.image} onChange={(e) => setData({ ...data, image: e.target.value })} className={INPUT} placeholder="https://... veya yükle →" />
              <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg cursor-pointer transition-colors">
                {uploading ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />} Görsel Yükle
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              </label>
              {data.image && <button onClick={() => setData({ ...data, image: "" })} className="ml-2 text-xs text-zinc-500 hover:text-zinc-300">Görseli kaldır</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
