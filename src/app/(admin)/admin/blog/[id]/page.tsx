"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getPostById, savePost, setPublished, generateSlug } from "@/lib/blog";
import { uploadImage } from "@/lib/content";
import type { BlogPost, BlogBlock } from "@/types/blog";
import { Save, RefreshCw, Upload, Plus, X, ChevronUp, ChevronDown, ArrowLeft, Eye, EyeOff, Wand2 } from "lucide-react";

const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5">{label}{hint && <span className="ml-2 text-zinc-600">{hint}</span>}</label>
      {children}
    </div>
  );
}

/* Yeni blok üreticileri (MVP: en kullanışlı 4 tip; render tarafı 8 tipin hepsini destekler) */
const BLOCK_TYPES: { type: BlogBlock["type"]; label: string }[] = [
  { type: "rich_text", label: "Metin" },
  { type: "media", label: "Görsel / Video" },
  { type: "quote", label: "Alıntı" },
  { type: "spacer", label: "Boşluk" },
];

function makeBlock(type: BlogBlock["type"]): BlogBlock {
  const id = Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
  switch (type) {
    case "media": return { type, id, media: { type: "image", url: "" } };
    case "quote": return { type, id, text: { tr: "", en: "" }, author: "" };
    case "spacer": return { type, id, size: "md" };
    case "rich_text":
    default:
      return { type: "rich_text", id, content: { tr: "", en: "" } };
  }
}

function BlockEditor({ block, onChange, onRemove, onUp, onDown, onUpload, uploading }: {
  block: BlogBlock;
  onChange: (b: BlogBlock) => void;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  const labelMap: Record<string, string> = {
    rich_text: "Metin", media: "Görsel / Video", quote: "Alıntı", spacer: "Boşluk",
    two_media: "2'li Görsel", three_media: "3'lü Görsel", text_left: "Metin + Görsel", text_right: "Görsel + Metin",
  };

  return (
    <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{labelMap[block.type] ?? block.type}</span>
        <div className="flex gap-1">
          <button onClick={onUp} className="p-1 hover:bg-zinc-700 rounded"><ChevronUp size={14} className="text-zinc-400" /></button>
          <button onClick={onDown} className="p-1 hover:bg-zinc-700 rounded"><ChevronDown size={14} className="text-zinc-400" /></button>
          <button onClick={onRemove} className="p-1 hover:bg-red-900/40 rounded"><X size={14} className="text-zinc-400 hover:text-red-400" /></button>
        </div>
      </div>

      {block.type === "rich_text" && (
        <>
          <Field label="Metin TR" hint="çift satır = yeni paragraf; HTML de yazabilirsin (h2, p, ul...)">
            <textarea value={block.content.tr} onChange={(e) => onChange({ ...block, content: { ...block.content, tr: e.target.value } })} rows={7} className={`${INPUT} resize-none`} />
          </Field>
          <Field label="Text EN (opsiyonel)">
            <textarea value={block.content.en} onChange={(e) => onChange({ ...block, content: { ...block.content, en: e.target.value } })} rows={3} className={`${INPUT} resize-none`} />
          </Field>
        </>
      )}

      {block.type === "media" && (
        <>
          {block.media.url && (
            <div className="w-full h-44 rounded-lg overflow-hidden bg-zinc-900">
              {block.media.type === "video"
                ? <video src={block.media.url} muted loop autoPlay playsInline className="w-full h-full object-cover" />
                : <img src={block.media.url} alt="" className="w-full h-full object-cover" />}
            </div>
          )}
          <div className="flex gap-2">
            <input value={block.media.url} onChange={(e) => onChange({ ...block, media: { ...block.media, url: e.target.value } })} className={INPUT} placeholder="https://... veya yükle →" />
            <label className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg cursor-pointer">
              {uploading ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />} Yükle
              <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
            </label>
          </div>
        </>
      )}

      {block.type === "quote" && (
        <>
          <Field label="Alıntı TR">
            <textarea value={block.text.tr} onChange={(e) => onChange({ ...block, text: { ...block.text, tr: e.target.value } })} rows={3} className={`${INPUT} resize-none`} />
          </Field>
          <Field label="Yazar (opsiyonel)">
            <input value={block.author ?? ""} onChange={(e) => onChange({ ...block, author: e.target.value })} className={INPUT} />
          </Field>
        </>
      )}

      {block.type === "spacer" && (
        <div className="flex gap-3">
          {(["sm", "md", "lg"] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer text-sm text-white">
              <input type="radio" checked={block.size === s} onChange={() => onChange({ ...block, size: s })} /> {s.toUpperCase()}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    getPostById(id).then((p) => { setPost(p); setLoading(false); });
  }, [id]);

  async function handleSave() {
    if (!post) return;
    setSaving(true);
    await savePost(post);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function togglePublish() {
    if (!post) return;
    await savePost(post); // önce mevcut düzenlemeleri kaydet
    await setPublished(post.id, !post.published);
    const fresh = await getPostById(post.id);
    setPost(fresh);
  }

  async function upload(file: File, key: string): Promise<string> {
    setUploadingKey(key);
    const url = await uploadImage(file, `blog/${Date.now()}_${file.name}`);
    setUploadingKey(null);
    return url;
  }

  function updateBlock(idx: number, b: BlogBlock) {
    if (!post) return;
    const body = [...post.body]; body[idx] = b;
    setPost({ ...post, body });
  }
  function removeBlock(idx: number) {
    if (!post) return;
    setPost({ ...post, body: post.body.filter((_, i) => i !== idx) });
  }
  function moveBlock(idx: number, dir: -1 | 1) {
    if (!post) return;
    const body = [...post.body];
    const ni = idx + dir;
    if (ni < 0 || ni >= body.length) return;
    [body[idx], body[ni]] = [body[ni], body[idx]];
    setPost({ ...post, body });
  }

  if (loading) return <div className="p-8 flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>;
  if (!post) return (
    <div className="p-8">
      <p className="text-zinc-400">Yazı bulunamadı.</p>
      <Link href="/admin/blog" className="text-white text-sm underline mt-2 inline-block">← Blog listesine dön</Link>
    </div>
  );

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg"><ArrowLeft size={15} className="text-zinc-300" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{post.title.tr || "Yeni Yazı"}</h1>
            <p className="text-zinc-400 text-sm mt-0.5">/{post.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={togglePublish} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${post.published ? "bg-green-500/15 text-green-400 hover:bg-green-500/25" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}>
            {post.published ? <><Eye size={14} /> Yayında</> : <><EyeOff size={14} /> Taslak</>}
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50">
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? "Kaydedildi ✓" : "Kaydet"}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Başlık & slug */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <Field label="Başlık TR *">
            <input value={post.title.tr} onChange={(e) => setPost({ ...post, title: { ...post.title, tr: e.target.value } })} className={INPUT} placeholder="SEO nedir? 2026 rehberi" />
          </Field>
          <Field label="Title EN (opsiyonel)">
            <input value={post.title.en} onChange={(e) => setPost({ ...post, title: { ...post.title, en: e.target.value } })} className={INPUT} />
          </Field>
          <Field label="Slug" hint="URL: /tr/blog/...">
            <div className="flex gap-2">
              <input value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} className={INPUT} />
              <button onClick={() => post.title.tr && setPost({ ...post, slug: generateSlug(post.title.tr) })} title="Başlıktan üret"
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg">
                <Wand2 size={12} /> Üret
              </button>
            </div>
          </Field>
        </div>

        {/* Özet & etiketler */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <Field label="Özet TR *" hint="listede ve Google açıklamasında görünür (~155 karakter)">
            <textarea value={post.excerpt.tr} onChange={(e) => setPost({ ...post, excerpt: { ...post.excerpt, tr: e.target.value } })} rows={3} className={`${INPUT} resize-none`} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Etiketler (virgülle)">
              <input value={(post.tags || []).join(", ")} onChange={(e) => setPost({ ...post, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className={INPUT} placeholder="SEO, Web Tasarım" />
            </Field>
            <Field label="Yazar">
              <input value={post.author ?? ""} onChange={(e) => setPost({ ...post, author: e.target.value })} className={INPUT} />
            </Field>
          </div>
        </div>

        {/* Kapak */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Kapak Görseli</h2>
          <div className="flex items-center gap-4">
            <div className="w-40 h-24 rounded-lg bg-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
              {post.coverMedia?.url
                ? <img src={post.coverMedia.url} alt="" className="w-full h-full object-cover" />
                : <span className="text-[10px] text-zinc-600">Kapak yok</span>}
            </div>
            <div className="flex-1 space-y-2">
              <input value={post.coverMedia?.url ?? ""} onChange={(e) => setPost({ ...post, coverMedia: { type: "image", url: e.target.value } })} className={INPUT} placeholder="https://... veya yükle →" />
              <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg cursor-pointer">
                {uploadingKey === "cover" ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />} Yükle
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const url = await upload(f, "cover");
                  setPost((prev) => (prev ? { ...prev, coverMedia: { type: "image", url } } : prev));
                }} />
              </label>
            </div>
          </div>
        </div>

        {/* İçerik blokları */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">İçerik</h2>
            <p className="text-xs text-zinc-500">{post.body.length} blok</p>
          </div>
          <div className="space-y-3 mb-4">
            {post.body.map((block, idx) => (
              <BlockEditor
                key={block.id}
                block={block}
                onChange={(b) => updateBlock(idx, b)}
                onRemove={() => removeBlock(idx)}
                onUp={() => moveBlock(idx, -1)}
                onDown={() => moveBlock(idx, 1)}
                uploading={uploadingKey === block.id}
                onUpload={async (f) => {
                  const url = await upload(f, block.id);
                  if (block.type === "media") {
                    const isVideo = /\.(mp4|webm|mov)/i.test(f.name);
                    updateBlock(idx, { ...block, media: { type: isVideo ? "video" : "image", url } });
                  }
                }}
              />
            ))}
          </div>
          <div className="border border-dashed border-zinc-700 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-3 font-semibold uppercase tracking-wider">Blok Ekle</p>
            <div className="flex flex-wrap gap-2">
              {BLOCK_TYPES.map((bt) => (
                <button key={bt.type} onClick={() => setPost({ ...post, body: [...post.body, makeBlock(bt.type)] })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors">
                  <Plus size={11} /> {bt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
