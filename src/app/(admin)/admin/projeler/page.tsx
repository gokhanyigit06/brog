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
import { Plus, Trash2, Pencil, RefreshCw, Save, X, Upload, Star } from "lucide-react";

const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";

const EMPTY: Omit<Project, "id"> = {
  title: "",
  brandName: "",
  description_tr: "",
  description_en: "",
  imageUrl: "",
  year: new Date().getFullYear().toString(),
  category: "",
  tags: [],
  link: "",
  order: 0,
  featured: false,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

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

  async function toggleFeatured(p: Project) {
    await updateProject(p.id!, { featured: !p.featured });
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
    setEditing({ ...editing, imageUrl: url });
    setUploading(false);
  }

  const featuredCount = projects.filter(p => p.featured).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projeler</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {projects.length} proje · <span className="text-yellow-400">{featuredCount} öne çıkan</span> (anasayfada görünür)
          </p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY } as Project); setIsNew(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors"
        >
          <Plus size={14} /> Yeni Proje
        </button>
      </div>

      {/* Info banner */}
      <div className="mb-6 bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-3 flex items-center gap-3">
        <Star size={14} className="text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-sm">
          <strong>★ Öne Çıkar</strong> işaretlenen projeler anasayfada görünür. Diğerleri yalnızca projeler sayfasında listelenir.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 text-sm">Henüz proje yok. "Yeni Proje" ile ekleyin.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className={`bg-zinc-900 border rounded-xl overflow-hidden transition-colors ${p.featured ? "border-yellow-400/40" : "border-zinc-800"}`}>
              {/* Image */}
              {p.imageUrl
                ? <img src={p.imageUrl} alt={p.brandName || p.title} className="w-full h-44 object-cover" />
                : <div className="w-full h-44 bg-zinc-800 flex items-center justify-center text-zinc-600 text-sm">Görsel yok</div>
              }

              <div className="p-4">
                {/* Featured badge */}
                {p.featured && (
                  <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold mb-2">
                    <Star size={11} fill="currentColor" /> Öne Çıkan · Anasayfada Görünür
                  </div>
                )}

                <h3 className="font-semibold text-white text-sm mb-0.5">{p.brandName || p.title || "İsimsiz"}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {p.year && <span className="text-zinc-500 text-xs">{p.year}</span>}
                  {p.category && <span className="text-zinc-500 text-xs">· {p.category}</span>}
                </div>
                {p.tags?.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  {/* Featured toggle */}
                  <button
                    onClick={() => toggleFeatured(p)}
                    title={p.featured ? "Öne çıkarmayı kaldır" : "Anasayfada öne çıkar"}
                    className={`p-2 rounded-lg transition-colors ${p.featured ? "bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30" : "bg-zinc-800 text-zinc-500 hover:text-yellow-400 hover:bg-yellow-400/10"}`}
                  >
                    <Star size={13} fill={p.featured ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => { setEditing(p); setIsNew(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors"
                  >
                    <Pencil size={12} /> Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(p.id!)}
                    className="p-2 bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / New Modal */}
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
              {/* Featured toggle */}
              <label className="flex items-center gap-3 bg-zinc-800 rounded-xl px-4 py-3 cursor-pointer select-none">
                <div
                  style={{
                    width: 36, height: 20, borderRadius: 10, position: "relative",
                    background: editing.featured ? "#facc15" : "#3f3f46",
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 2, left: editing.featured ? 18 : 2,
                    width: 16, height: 16, borderRadius: 8,
                    background: "#fff", transition: "left 0.2s",
                  }} />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Anasayfada Öne Çıkar</span>
                  <p className="text-xs text-zinc-500 mt-0.5">Açık olduğunda bu proje ana sayfada görünür</p>
                </div>
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="hidden"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Marka / Proje Adı">
                  <input value={editing.brandName} onChange={(e) => setEditing({ ...editing, brandName: e.target.value, title: e.target.value })} className={INPUT} placeholder="Urban Glow" />
                </Field>
                <Field label="Yıl">
                  <input value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} className={INPUT} placeholder="2025" />
                </Field>
              </div>

              <Field label="Kategori (hover'da görünür)">
                <input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={INPUT} placeholder="Branding & Identity" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="🇹🇷 Açıklama TR">
                  <textarea value={editing.description_tr} onChange={(e) => setEditing({ ...editing, description_tr: e.target.value })} rows={3} className={`${INPUT} resize-none`} />
                </Field>
                <Field label="🇬🇧 Description EN">
                  <textarea value={editing.description_en} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} rows={3} className={`${INPUT} resize-none`} />
                </Field>
              </div>

              <Field label="Etiketler (virgülle ayır)">
                <input value={editing.tags.join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className={INPUT} placeholder="Design, Branding, Web" />
              </Field>

              <Field label="Proje Linki">
                <input value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} className={INPUT} placeholder="https://..." />
              </Field>

              <Field label="Görsel">
                {editing.imageUrl && <img src={editing.imageUrl} className="w-full h-48 object-cover rounded-lg mb-2" alt="" />}
                <label className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors w-fit">
                  {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? "Yükleniyor..." : "Görsel Yükle"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </Field>
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
