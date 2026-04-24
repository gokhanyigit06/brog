"use client";

import { useState, useEffect } from "react";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  uploadImage,
  type Project,
} from "@/lib/content";
import { Plus, Trash2, Pencil, RefreshCw, Save, X, Upload } from "lucide-react";

const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";
const EMPTY: Omit<Project, "id"> = {
  title: "",
  description_tr: "",
  description_en: "",
  image: "",
  tags: [],
  link: "",
  order: 0,
};

export default function ProjelerAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getProjects().then((p) => { setProjects(p); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    if (isNew) {
      await addProject({ ...editing, order: projects.length });
    } else {
      await updateProject(editing.id!, editing);
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu projeyi silmek istiyor musun?")) return;
    await deleteProject(id);
    load();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadImage(file, `projects/${Date.now()}_${file.name}`);
    setEditing({ ...editing, image: url });
    setUploading(false);
  }

  function updateTags(val: string) {
    if (!editing) return;
    setEditing({ ...editing, tags: val.split(",").map((t) => t.trim()).filter(Boolean) });
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projeler</h1>
          <p className="text-zinc-400 text-sm mt-1">{projects.length} proje</p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY } as Project); setIsNew(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors"
        >
          <Plus size={14} /> Yeni Proje
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {p.image && <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />}
              {!p.image && <div className="w-full h-40 bg-zinc-800 flex items-center justify-center text-zinc-600 text-sm">Görsel yok</div>}
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-1">{p.title || "İsimsiz"}</h3>
                <p className="text-zinc-500 text-xs mb-3 line-clamp-2">{p.description_tr}</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(p); setIsNew(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors"
                  >
                    <Pencil size={12} /> Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(p.id!)}
                    className="p-1.5 bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="font-bold text-white">{isNew ? "Yeni Proje" : "Projeyi Düzenle"}</h2>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <X size={16} className="text-zinc-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Başlık</label>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={INPUT} placeholder="Proje adı" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Açıklama (TR)</label>
                  <textarea value={editing.description_tr} onChange={(e) => setEditing({ ...editing, description_tr: e.target.value })} rows={3} className={`${INPUT} resize-none`} />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Description (EN)</label>
                  <textarea value={editing.description_en} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} rows={3} className={`${INPUT} resize-none`} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Etiketler (virgülle ayır)</label>
                <input value={editing.tags.join(", ")} onChange={(e) => updateTags(e.target.value)} className={INPUT} placeholder="Design, Branding, Web" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Link</label>
                <input value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} className={INPUT} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Görsel</label>
                {editing.image && <img src={editing.image} className="w-full h-40 object-cover rounded-lg mb-2" alt="" />}
                <label className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors w-fit">
                  {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? "Yükleniyor..." : "Görsel Yükle"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-zinc-800">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">İptal</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50">
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
