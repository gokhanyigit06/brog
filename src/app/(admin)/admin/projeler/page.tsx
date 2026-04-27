"use client";

import { useState, useEffect } from "react";
import {
  getProjects, addProject, updateProject, deleteProject, uploadImage,
  type Project, type ProjectBlock,
} from "@/lib/content";
import { Plus, Trash2, Pencil, RefreshCw, Save, X, Upload, Star, ChevronUp, ChevronDown } from "lucide-react";

const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";
const INPUT_SM = "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-full";

const EMPTY: Omit<Project, "id"> = {
  title: "", brandName: "", slug: "",
  description_tr: "", description_en: "",
  industry_tr: "", industry_en: "", timeline: "",
  imageUrl: "", videoUrl: "",
  year: new Date().getFullYear().toString(),
  category: "", tags: [], link: "",
  order: 0, featured: false, blocks: [],
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

/* ─── Image upload helper ─── */
function ImgInput({ value, onChange, path }: { value: string; onChange: (url: string) => void; path: string }) {
  const [uploading, setUploading] = useState(false);
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, `projects/${path}_${Date.now()}_${file.name}`);
    onChange(url); setUploading(false);
  }
  return (
    <div className="flex gap-2 items-center">
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="https://..." className={INPUT_SM} />
      <label className="flex-shrink-0 flex items-center gap-1 px-2 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg cursor-pointer transition-colors">
        {uploading ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />}
        <input type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
      </label>
    </div>
  );
}

/* ─── Single block editor ─── */
function BlockEditor({ block, onChange, onRemove, onUp, onDown }: {
  block: ProjectBlock;
  onChange: (b: ProjectBlock) => void;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
}) {
  const labelMap: Record<string, string> = {
    image_16_9: "16:9 Görsel",
    text_block: "Yazı Bloğu",
    gallery: "Galeri (1 büyük + 2 küçük)",
    single_image: "Tek Görsel (Özel Oran)",
    mobile_preview: "Mobil Telefon Önizleme",
  };

  return (
    <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{labelMap[block.type]}</span>
        <div className="flex gap-1">
          <button onClick={onUp} className="p-1 hover:bg-zinc-700 rounded"><ChevronUp size={14} className="text-zinc-400" /></button>
          <button onClick={onDown} className="p-1 hover:bg-zinc-700 rounded"><ChevronDown size={14} className="text-zinc-400" /></button>
          <button onClick={onRemove} className="p-1 hover:bg-red-900/40 rounded"><X size={14} className="text-zinc-400 hover:text-red-400" /></button>
        </div>
      </div>

      {/* image_16_9 */}
      {block.type === "image_16_9" && (
        <Field label="Görsel URL">
          <ImgInput value={block.url} onChange={url => onChange({ ...block, url })} path="block_16_9" />
        </Field>
      )}

      {/* text_block */}
      {block.type === "text_block" && (
        <>
          <Field label="Etiket (sol)">
            <input value={block.label} onChange={e => onChange({ ...block, label: e.target.value })} className={INPUT} placeholder="Introduction" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Başlık TR">
              <input value={block.title_tr} onChange={e => onChange({ ...block, title_tr: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Title EN">
              <input value={block.title_en} onChange={e => onChange({ ...block, title_en: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Metin TR (çift satır = paragraf)">
              <textarea value={block.body_tr} onChange={e => onChange({ ...block, body_tr: e.target.value })} rows={4} className={`${INPUT} resize-none`} />
            </Field>
            <Field label="Body EN">
              <textarea value={block.body_en} onChange={e => onChange({ ...block, body_en: e.target.value })} rows={4} className={`${INPUT} resize-none`} />
            </Field>
          </div>
        </>
      )}

      {/* gallery */}
      {block.type === "gallery" && (
        <>
          <Field label="Düzen">
            <div className="flex gap-3">
              {(["left_big", "right_big"] as const).map(layout => (
                <label key={layout} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={block.layout === layout} onChange={() => onChange({ ...block, layout })} />
                  <span className="text-sm text-white">{layout === "left_big" ? "Solda büyük" : "Sağda büyük"}</span>
                </label>
              ))}
            </div>
          </Field>
          <Field label="Büyük görsel">
            <ImgInput value={block.big} onChange={big => onChange({ ...block, big })} path="gallery_big" />
          </Field>
          <Field label="Küçük görsel 1 (üst)">
            <ImgInput value={block.small1} onChange={small1 => onChange({ ...block, small1 })} path="gallery_sm1" />
          </Field>
          <Field label="Küçük görsel 2 (alt)">
            <ImgInput value={block.small2} onChange={small2 => onChange({ ...block, small2 })} path="gallery_sm2" />
          </Field>
        </>
      )}

      {/* single_image */}
      {block.type === "single_image" && (
        <>
          <Field label="Görsel URL">
            <ImgInput value={block.url} onChange={url => onChange({ ...block, url })} path="single_img" />
          </Field>
          <Field label="Oran (örn: 21:9 veya 4:3)">
            <input value={block.ratio} onChange={e => onChange({ ...block, ratio: e.target.value })} className={INPUT} placeholder="21:9" />
          </Field>
        </>
      )}

      {/* mobile_preview */}
      {block.type === "mobile_preview" && (
        <>
          <Field label="Telefon Sayısı">
            <div className="flex gap-4">
              {([1, 2, 3] as const).map(n => (
                <label key={n} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={block.count === n} onChange={() => {
                    const newUrls = Array.from({ length: n }, (_, i) => (block.urls || [])[i] || "");
                    onChange({ ...block, count: n, urls: newUrls });
                  }} />
                  <span className="text-sm text-white">{n} Telefon</span>
                </label>
              ))}
            </div>
          </Field>

          {Array.from({ length: block.count || 1 }).map((_, i) => (
            <Field key={i} label={`Telefon ${i + 1} URL`} hint="https:// olmasa da otomatik eklenir">
              <input
                value={(block.urls || [])[i] || ""}
                onChange={e => {
                  const newUrls = [...(block.urls || [])];
                  newUrls[i] = e.target.value;
                  onChange({ ...block, urls: newUrls });
                }}
                className={INPUT}
                placeholder="https://fouramour.com"
              />
            </Field>
          ))}

          <p className="text-xs text-zinc-600 bg-zinc-700/30 rounded-lg px-3 py-2">
            Not: Bazı siteler iframe yüklemeyi engeller (X-Frame-Options). Bu durumda boş ekran görünür.
          </p>
        </>
      )}
    </div>
  );
}

/* ─── Add block bar ─── */
const BLOCK_TYPES: { type: ProjectBlock["type"]; label: string }[] = [
  { type: "image_16_9",     label: "16:9 Görsel" },
  { type: "text_block",     label: "Yazı Bloğu" },
  { type: "gallery",        label: "Galeri (1B+2K)" },
  { type: "single_image",   label: "Tek Görsel" },
  { type: "mobile_preview", label: "📱 Mobil Önizleme" },
];

function makeBlock(type: ProjectBlock["type"]): ProjectBlock {
  switch (type) {
    case "image_16_9":     return { type, url: "" };
    case "text_block":     return { type, label: "", title_tr: "", title_en: "", body_tr: "", body_en: "" };
    case "gallery":        return { type, layout: "left_big", big: "", small1: "", small2: "" };
    case "single_image":   return { type, url: "", ratio: "21:9" };
    case "mobile_preview": return { type, urls: [""], count: 1 };
  }
}

/* ─────────────────────────────────────────────────────────────── */
export default function ProjelerAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState<Project | null>(null);
  const [isNew, setIsNew]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);

  const load = () => { setLoading(true); getProjects().then(p => { setProjects(p); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    if (isNew) await addProject({ ...editing, order: projects.length });
    else await updateProject(editing.id!, editing);
    setSaving(false); setEditing(null); load();
  }

  async function toggleFeatured(p: Project) {
    await updateProject(p.id!, { featured: !p.featured }); load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu projeyi silmek istiyor musun?")) return;
    await deleteProject(id); load();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file || !editing) return;
    setUploading(true);
    const url = await uploadImage(file, `projects/${Date.now()}_${file.name}`);
    setEditing({ ...editing, imageUrl: url }); setUploading(false);
  }

  /* block helpers */
  function updateBlock(idx: number, b: ProjectBlock) {
    if (!editing) return;
    const blocks = [...(editing.blocks ?? [])];
    blocks[idx] = b; setEditing({ ...editing, blocks });
  }
  function removeBlock(idx: number) {
    if (!editing) return;
    const blocks = [...(editing.blocks ?? [])];
    blocks.splice(idx, 1); setEditing({ ...editing, blocks });
  }
  function moveBlock(idx: number, dir: -1 | 1) {
    if (!editing) return;
    const blocks = [...(editing.blocks ?? [])];
    const ni = idx + dir; if (ni < 0 || ni >= blocks.length) return;
    [blocks[idx], blocks[ni]] = [blocks[ni], blocks[idx]];
    setEditing({ ...editing, blocks });
  }
  function addBlock(type: ProjectBlock["type"]) {
    if (!editing) return;
    setEditing({ ...editing, blocks: [...(editing.blocks ?? []), makeBlock(type)] });
  }

  const featuredCount = projects.filter(p => p.featured).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projeler</h1>
          <p className="text-zinc-400 text-sm mt-1">{projects.length} proje · <span className="text-yellow-400">{featuredCount} öne çıkan</span></p>
        </div>
        <button onClick={() => { setEditing({ ...EMPTY } as Project); setIsNew(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors">
          <Plus size={14} /> Yeni Proje
        </button>
      </div>

      <div className="mb-6 bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-3 flex items-center gap-3">
        <Star size={14} className="text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-sm"><strong>★ Öne Çıkar</strong> — anasayfada görünür. Proje kartına tıklayınca iç sayfaya gider.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 text-sm">Henüz proje yok.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className={`bg-zinc-900 border rounded-xl overflow-hidden ${p.featured ? "border-yellow-400/40" : "border-zinc-800"}`}>
              {p.imageUrl
                ? <img src={p.imageUrl} alt={p.brandName} className="w-full h-44 object-cover" />
                : <div className="w-full h-44 bg-zinc-800 flex items-center justify-center text-zinc-600 text-sm">Görsel yok</div>}
              <div className="p-4">
                {p.featured && <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold mb-2"><Star size={11} fill="currentColor" /> Öne Çıkan</div>}
                <h3 className="font-semibold text-white text-sm mb-0.5">{p.brandName || p.title || "İsimsiz"}</h3>
                <div className="flex gap-2 mb-1 text-zinc-500 text-xs">{p.year && <span>{p.year}</span>}{p.category && <span>· {p.category}</span>}</div>
                {p.slug && <p className="text-zinc-600 text-xs mb-2">/{p.slug}</p>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => toggleFeatured(p)} title={p.featured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                    className={`p-2 rounded-lg transition-colors ${p.featured ? "bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30" : "bg-zinc-800 text-zinc-500 hover:text-yellow-400 hover:bg-yellow-400/10"}`}>
                    <Star size={13} fill={p.featured ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => { setEditing(p); setIsNew(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors">
                    <Pencil size={12} /> Düzenle
                  </button>
                  <button onClick={() => handleDelete(p.id!)}
                    className="p-2 bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit / New Modal ── */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
              <h2 className="font-bold text-white">{isNew ? "Yeni Proje" : "Projeyi Düzenle"}</h2>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-zinc-800 rounded-lg"><X size={16} className="text-zinc-400" /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Featured toggle */}
              <label className="flex items-center gap-3 bg-zinc-800 rounded-xl px-4 py-3 cursor-pointer select-none">
                <div style={{ width: 36, height: 20, borderRadius: 10, position: "relative", background: editing.featured ? "#facc15" : "#3f3f46", transition: "background 0.2s" }}>
                  <div style={{ position: "absolute", top: 2, left: editing.featured ? 18 : 2, width: 16, height: 16, borderRadius: 8, background: "#fff", transition: "left 0.2s" }} />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Anasayfada Öne Çıkar</span>
                  <p className="text-xs text-zinc-500 mt-0.5">Açık olduğunda ana sayfada görünür</p>
                </div>
                <input type="checkbox" checked={editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} className="hidden" />
              </label>

              {/* Basic fields */}
              <Field label="Marka / Proje Adı">
                <input value={editing.brandName} onChange={e => setEditing({ ...editing, brandName: e.target.value, title: e.target.value })} className={INPUT} placeholder="Urban Glow" />
                <p className="text-xs text-zinc-500 mt-1">
                  URL: /tr/projeler/<span className="text-zinc-400">{
                    (editing.brandName || "marka-adi")
                      .toLowerCase()
                      .replace(/ç/g,"c").replace(/ğ/g,"g").replace(/ı/g,"i")
                      .replace(/ö/g,"o").replace(/ş/g,"s").replace(/ü/g,"u")
                      .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")
                  }</span>
                </p>
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Yıl"><input value={editing.year} onChange={e => setEditing({ ...editing, year: e.target.value })} className={INPUT} placeholder="2025" /></Field>
                <Field label="Çalışma Alanı (Kategori)"><input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className={INPUT} placeholder="Web Design" /></Field>
                <Field label="Süre (Timeline)"><input value={editing.timeline ?? ""} onChange={e => setEditing({ ...editing, timeline: e.target.value })} className={INPUT} placeholder="8 Weeks" /></Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Sektör TR"><input value={editing.industry_tr ?? ""} onChange={e => setEditing({ ...editing, industry_tr: e.target.value })} className={INPUT} placeholder="Sağlık" /></Field>
                <Field label="Industry EN"><input value={editing.industry_en ?? ""} onChange={e => setEditing({ ...editing, industry_en: e.target.value })} className={INPUT} placeholder="Healthcare" /></Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="🇹🇷 Açıklama TR">
                  <textarea value={editing.description_tr} onChange={e => setEditing({ ...editing, description_tr: e.target.value })} rows={3} className={`${INPUT} resize-none`} />
                </Field>
                <Field label="🇬🇧 Description EN">
                  <textarea value={editing.description_en} onChange={e => setEditing({ ...editing, description_en: e.target.value })} rows={3} className={`${INPUT} resize-none`} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Etiketler (virgülle)">
                  <input value={editing.tags.join(", ")} onChange={e => setEditing({ ...editing, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} className={INPUT} placeholder="Design, Branding" />
                </Field>
                <Field label="Canlı Site Linki">
                  <input value={editing.link} onChange={e => setEditing({ ...editing, link: e.target.value })} className={INPUT} placeholder="https://..." />
                </Field>
              </div>

              <Field label="Video URL (mp4/webm — opsiyonel)">
                <input value={editing.videoUrl ?? ""} onChange={e => setEditing({ ...editing, videoUrl: e.target.value })} className={INPUT} placeholder="https://...video.mp4" />
              </Field>

              <Field label="Kapak Görseli">
                {editing.imageUrl && <img src={editing.imageUrl} className="w-full h-40 object-cover rounded-lg mb-2" alt="" />}
                <label className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors w-fit">
                  {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? "Yükleniyor..." : "Görsel Yükle"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </Field>

              {/* ─── Content Blocks ─── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">İçerik Blokları</h3>
                  <p className="text-xs text-zinc-500">{editing.blocks?.length ?? 0} blok</p>
                </div>

                <div className="space-y-3 mb-4">
                  {(editing.blocks ?? []).map((block, idx) => (
                    <BlockEditor
                      key={idx}
                      block={block}
                      onChange={b => updateBlock(idx, b)}
                      onRemove={() => removeBlock(idx)}
                      onUp={() => moveBlock(idx, -1)}
                      onDown={() => moveBlock(idx, 1)}
                    />
                  ))}
                </div>

                {/* Add block */}
                <div className="border border-dashed border-zinc-700 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 mb-3 font-semibold uppercase tracking-wider">Blok Ekle</p>
                  <div className="flex flex-wrap gap-2">
                    {BLOCK_TYPES.map(bt => (
                      <button key={bt.type} onClick={() => addBlock(bt.type)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors">
                        <Plus size={11} /> {bt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-zinc-800 sticky bottom-0 bg-zinc-900">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">İptal</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50">
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
