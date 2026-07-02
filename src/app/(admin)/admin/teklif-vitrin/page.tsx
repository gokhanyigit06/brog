"use client";

import { useEffect, useState } from "react";
import {
  getProjects, getTeklifShowcase, saveTeklifShowcase, uploadImage,
  type Project, type TeklifShowcaseContent, type TeklifShowcaseItem,
} from "@/lib/content";
import { Save, RefreshCw, Plus, Trash2, Upload, ChevronUp, ChevronDown } from "lucide-react";

const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";

export default function TeklifVitrinAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [content, setContent] = useState<TeklifShowcaseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [addId, setAddId] = useState("");

  useEffect(() => {
    Promise.all([getProjects(), getTeklifShowcase()]).then(([p, c]) => {
      setProjects(p);
      setContent({ ...c, items: [...c.items].sort((a, b) => a.order - b.order) });
      setLoading(false);
    });
  }, []);

  const projById = (id: string) => projects.find((p) => p.id === id);
  const items = content?.items ?? [];
  const available = projects.filter((p) => !items.some((it) => it.projectId === p.id));

  function addItem() {
    if (!addId || !content) return;
    setContent({ ...content, items: [...items, { id: Date.now().toString(), projectId: addId, coverUrl: "", order: items.length }] });
    setAddId("");
  }
  function update(id: string, patch: Partial<TeklifShowcaseItem>) {
    if (!content) return;
    setContent({ ...content, items: items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });
  }
  function remove(id: string) {
    if (!content) return;
    setContent({ ...content, items: items.filter((it) => it.id !== id).map((it, i) => ({ ...it, order: i })) });
  }
  function move(id: string, dir: -1 | 1) {
    if (!content) return;
    const arr = [...items];
    const idx = arr.findIndex((it) => it.id === id);
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    setContent({ ...content, items: arr.map((it, i) => ({ ...it, order: i })) });
  }
  async function uploadCover(id: string, file: File) {
    setUploadingId(id);
    const url = await uploadImage(file, `teklif-vitrin/${Date.now()}_${file.name}`);
    update(id, { coverUrl: url });
    setUploadingId(null);
  }
  async function handleSave() {
    if (!content) return;
    setSaving(true);
    await saveTeklifShowcase({ ...content, items: items.map((it, i) => ({ ...it, order: i })) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading || !content) return <div className="p-8 flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Teklif Vitrini</h1>
          <p className="text-zinc-400 text-sm mt-1">/tr/teklif sayfasındaki referans vitrini · {items.length} proje</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Kaydedildi ✓" : "Kaydet"}
        </button>
      </div>

      {/* Başlık ayarları */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-5 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Etiket</label>
          <input value={content.label} onChange={(e) => setContent({ ...content, label: e.target.value })} className={INPUT} placeholder="Referanslar" />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Başlık</label>
          <input value={content.title_tr} onChange={(e) => setContent({ ...content, title_tr: e.target.value })} className={INPUT} placeholder="Seçili işlerimiz" />
        </div>
      </div>

      <div className="mb-5 bg-blue-400/10 border border-blue-400/20 rounded-xl px-4 py-3 text-blue-200 text-sm">
        Vitrin boşsa otomatik olarak &quot;öne çıkan&quot; projeler gösterilir. Buradan istediğin projeleri seçip her birine özel kapak görseli verebilirsin.
      </div>

      {/* Proje ekle */}
      <div className="flex gap-2 mb-5">
        <select value={addId} onChange={(e) => setAddId(e.target.value)} className={INPUT}>
          <option value="">Proje seç…</option>
          {available.map((p) => <option key={p.id} value={p.id}>{p.brandName || p.title}</option>)}
        </select>
        <button onClick={addItem} disabled={!addId} className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium disabled:opacity-40"><Plus size={15} /> Ekle</button>
      </div>

      {/* Vitrin listesi */}
      <div className="space-y-3">
        {items.length === 0 && <div className="text-center py-14 text-zinc-600 text-sm">Vitrin boş — şu an öne çıkan projeler gösteriliyor.</div>}
        {items.map((it, idx) => {
          const p = projById(it.projectId);
          const cover = it.coverUrl || p?.imageUrl || p?.listingImageUrl || "";
          return (
            <div key={it.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
              <div className="w-36 h-20 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                {cover ? <img src={cover} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-zinc-500">Kapak yok</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{p ? (p.brandName || p.title) : <span className="text-red-400">Proje bulunamadı</span>}</h3>
                <p className="text-zinc-500 text-xs mb-2">{it.coverUrl ? "Özel kapak" : "Proje kapağı (imageUrl)"}</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg cursor-pointer">
                  {uploadingId === it.id ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />} Kapak Yükle
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(it.id, f); }} />
                </label>
                {it.coverUrl && <button onClick={() => update(it.id, { coverUrl: "" })} className="ml-2 text-xs text-zinc-500 hover:text-zinc-300">Kapağı sıfırla</button>}
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => move(it.id, -1)} disabled={idx === 0} className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"><ChevronUp size={14} /></button>
                <button onClick={() => move(it.id, 1)} disabled={idx === items.length - 1} className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"><ChevronDown size={14} /></button>
              </div>
              <button onClick={() => remove(it.id)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-900/40 shrink-0"><Trash2 size={14} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
