"use client";

import { useState, useEffect } from "react";
import { getClientLogos, saveClientLogos, uploadImage, type ClientLogo } from "@/lib/content";
import { Save, RefreshCw, Plus, Trash2, Upload, ChevronUp, ChevronDown } from "lucide-react";

const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";

export default function LogolarAdmin() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    getClientLogos().then((d) => { setLogos([...d.logos].sort((a, b) => a.order - b.order)); setLoading(false); });
  }, []);

  function addLogo() {
    setLogos((prev) => [...prev, { id: Date.now().toString(), name: "", logoUrl: "", order: prev.length }]);
  }
  function update(id: string, patch: Partial<ClientLogo>) {
    setLogos((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function remove(id: string) {
    setLogos((prev) => prev.filter((l) => l.id !== id).map((l, i) => ({ ...l, order: i })));
  }
  function move(id: string, dir: -1 | 1) {
    setLogos((prev) => {
      const arr = [...prev];
      const idx = arr.findIndex((l) => l.id === id);
      const ni = idx + dir;
      if (ni < 0 || ni >= arr.length) return prev;
      [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
      return arr.map((l, i) => ({ ...l, order: i }));
    });
  }
  async function handleUpload(id: string, file: File) {
    setUploadingId(id);
    const url = await uploadImage(file, `client-logos/${Date.now()}_${file.name}`);
    update(id, { logoUrl: url });
    setUploadingId(null);
  }
  async function handleSave() {
    setSaving(true);
    await saveClientLogos({ logos: logos.map((l, i) => ({ ...l, order: i })) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="p-8 flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Müşteri Logoları</h1>
          <p className="text-zinc-400 text-sm mt-1">/tr/teklif sayfasındaki kayan logo şeridi · {logos.length} logo</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Kaydedildi ✓" : "Kaydet"}
        </button>
      </div>

      <div className="mb-5 bg-blue-400/10 border border-blue-400/20 rounded-xl px-4 py-3 text-blue-200 text-sm">
        Şeffaf arka planlı (PNG/SVG) logolar en iyi görünür. Logolar sitede otomatik gri tonlanır.
      </div>

      <div className="space-y-3 mb-4">
        {logos.length === 0 && <div className="text-center py-16 text-zinc-600 text-sm">Henüz logo yok. &quot;Logo Ekle&quot; ile başlayın.</div>}
        {logos.map((l, idx) => (
          <div key={l.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
            {/* Önizleme */}
            <div className="w-28 h-16 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
              {l.logoUrl
                ? <img src={l.logoUrl} alt={l.name} className="max-h-12 max-w-24 object-contain" />
                : <span className="text-[10px] text-zinc-400">Logo yok</span>}
            </div>
            {/* Alanlar */}
            <div className="flex-1 space-y-2">
              <input value={l.name} onChange={(e) => update(l.id, { name: e.target.value })} className={INPUT} placeholder="Marka adı (örn. Acity)" />
              <div className="flex gap-2">
                <input value={l.logoUrl} onChange={(e) => update(l.id, { logoUrl: e.target.value })} className={INPUT} placeholder="https://... veya yükle →" />
                <label className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg cursor-pointer transition-colors">
                  {uploadingId === l.id ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />} Yükle
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(l.id, f); }} />
                </label>
              </div>
            </div>
            {/* Sıra + sil */}
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => move(l.id, -1)} disabled={idx === 0} className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"><ChevronUp size={14} /></button>
              <button onClick={() => move(l.id, 1)} disabled={idx === logos.length - 1} className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"><ChevronDown size={14} /></button>
            </div>
            <button onClick={() => remove(l.id)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-900/40 shrink-0"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      <button onClick={addLogo} className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors">
        <Plus size={15} /> Logo Ekle
      </button>
    </div>
  );
}
