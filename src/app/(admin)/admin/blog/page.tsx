"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllPosts, savePost, deletePost, setPublished } from "@/lib/blog";
import type { BlogPost } from "@/types/blog";
import { Plus, Trash2, Pencil, RefreshCw, Eye, EyeOff } from "lucide-react";

export default function BlogAdmin() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = () => { setLoading(true); getAllPosts(false).then((p) => { setPosts(p); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  async function handleNew() {
    setCreating(true);
    const id = Date.now().toString(36);
    const now = new Date().toISOString();
    const draft: BlogPost = {
      id,
      slug: `taslak-${id}`,
      title: { tr: "", en: "" },
      excerpt: { tr: "", en: "" },
      coverMedia: { type: "image", url: "" },
      body: [],
      tags: [],
      author: "Vogolab",
      published: false,
      publishedAt: "",
      createdAt: now,
      updatedAt: now,
    };
    await savePost(draft);
    router.push(`/admin/blog/${id}`);
  }

  async function togglePublish(p: BlogPost) {
    await setPublished(p.id, !p.published);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu yazıyı silmek istiyor musun?")) return;
    await deletePost(id);
    load();
  }

  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-zinc-400 text-sm mt-1">{posts.length} yazı · <span className="text-green-400">{publishedCount} yayında</span></p>
        </div>
        <button onClick={handleNew} disabled={creating} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50">
          {creating ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />} Yeni Yazı
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 text-sm">Henüz yazı yok. &quot;Yeni Yazı&quot; ile başla.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className={`bg-zinc-900 border rounded-xl p-4 flex items-center gap-4 ${p.published ? "border-zinc-800" : "border-yellow-400/30"}`}>
              <div className="w-28 h-16 rounded-lg bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                {p.coverMedia?.url
                  ? <img src={p.coverMedia.url} alt="" className="w-full h-full object-cover" />
                  : <span className="text-[10px] text-zinc-600">Kapak yok</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white truncate">{p.title?.tr || "(başlıksız taslak)"}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${p.published ? "bg-green-500/15 text-green-400" : "bg-yellow-400/15 text-yellow-400"}`}>
                    {p.published ? "Yayında" : "Taslak"}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs mt-1 truncate">/{p.slug} · {(p.tags || []).join(", ") || "etiket yok"}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => togglePublish(p)} title={p.published ? "Yayından kaldır" : "Yayınla"}
                  className={`p-2 rounded-lg transition-colors ${p.published ? "bg-green-500/15 text-green-400 hover:bg-green-500/25" : "bg-zinc-800 text-zinc-400 hover:text-green-400"}`}>
                  {p.published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => router.push(`/admin/blog/${p.id}`)} className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors">
                  <Pencil size={12} /> Düzenle
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded-lg transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
