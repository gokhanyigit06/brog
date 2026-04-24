"use client";

import { useState, useEffect } from "react";
import {
  getServices, addService, updateService, deleteService, type Service,
} from "@/lib/content";
import { Plus, Trash2, Pencil, RefreshCw, Save, X, GripVertical } from "lucide-react";

const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";
const EMPTY: Omit<Service, "id"> = { title_tr: "", title_en: "", description_tr: "", description_en: "", order: 0 };

export default function HizmetlerAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getServices().then((s) => { setServices(s); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    if (isNew) await addService({ ...editing, order: services.length });
    else await updateService(editing.id!, editing);
    setSaving(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu hizmeti silmek istiyor musun?")) return;
    await deleteService(id);
    load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Hizmetler</h1>
          <p className="text-zinc-400 text-sm mt-1">{services.length} hizmet</p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY } as Service); setIsNew(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors"
        >
          <Plus size={14} /> Yeni Hizmet
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>
      ) : (
        <div className="space-y-2">
          {services.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
              <GripVertical size={16} className="text-zinc-700 flex-shrink-0" />
              <span className="text-xs text-zinc-600 w-5">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{s.title_tr} <span className="text-zinc-500">/ {s.title_en}</span></p>
                <p className="text-zinc-500 text-xs mt-0.5 truncate">{s.description_tr}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(s); setIsNew(false); }} className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(s.id!)} className="p-1.5 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="text-center py-16 text-zinc-600">
              <p className="mb-3">Henüz hizmet eklenmemiş</p>
              <button onClick={() => { setEditing({ ...EMPTY } as Service); setIsNew(true); }} className="text-white text-sm underline">İlk hizmeti ekle</button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="font-bold text-white">{isNew ? "Yeni Hizmet" : "Hizmeti Düzenle"}</h2>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-zinc-800 rounded-lg"><X size={16} className="text-zinc-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Başlık (TR)</label>
                  <input value={editing.title_tr} onChange={(e) => setEditing({ ...editing, title_tr: e.target.value })} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Title (EN)</label>
                  <input value={editing.title_en} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} className={INPUT} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Açıklama (TR)</label>
                  <textarea value={editing.description_tr} onChange={(e) => setEditing({ ...editing, description_tr: e.target.value })} rows={4} className={`${INPUT} resize-none`} />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Description (EN)</label>
                  <textarea value={editing.description_en} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} rows={4} className={`${INPUT} resize-none`} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-zinc-800">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">İptal</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50">
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
