"use client";

import { useEffect, useState } from "react";
import {
  getLeads, updateLead, deleteLead,
  type Lead, type LeadStatus,
} from "@/lib/content";
import { RefreshCw, Trash2, Phone, MessageCircle, Check, Archive } from "lucide-react";

const SERVICE_LABEL: Record<string, string> = { web: "Web", reklam: "Reklam", seo: "SEO", hepsi: "Hepsi", diger: "İletişim" };
const STATUS_LABEL: Record<LeadStatus, string> = { new: "Yeni", read: "Okundu", contacted: "İletişim kuruldu", archived: "Arşiv" };

const FILTERS: { key: "all" | LeadStatus; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "new", label: "Yeni" },
  { key: "contacted", label: "İletişim kuruldu" },
  { key: "archived", label: "Arşiv" },
];

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa önce`;
  const d = Math.floor(h / 24);
  return `${d} gün önce`;
}

function waLink(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  const withCc = digits.startsWith("0") ? "9" + digits : digits;
  return `https://wa.me/${withCc}`;
}

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");

  const load = () => { setLoading(true); getLeads().then((l) => { setLeads(l); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: LeadStatus) {
    await updateLead(id, { status });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }
  async function handleDelete(id: string) {
    if (!confirm("Bu talebi silmek istiyor musun?")) return;
    await deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  const shown = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Talepler</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {leads.length} talep · <span className="text-yellow-400">{newCount} yeni</span>
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
          <RefreshCw size={14} /> Yenile
        </button>
      </div>

      {/* Filtreler */}
      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.key ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {f.label}
            {f.key === "new" && newCount > 0 && <span className="ml-1.5 text-yellow-500">{newCount}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>
      ) : shown.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 text-sm">Talep yok.</div>
      ) : (
        <div className="space-y-3">
          {shown.map((l) => (
            <div
              key={l.id}
              className={`bg-zinc-900 border rounded-xl p-5 ${l.status === "new" ? "border-yellow-400/40" : "border-zinc-800"}`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-semibold text-white">{l.name || l.email || "İsimsiz"}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium">{SERVICE_LABEL[l.service] ?? l.service}</span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                      l.status === "new" ? "bg-yellow-400/15 text-yellow-400"
                      : l.status === "contacted" ? "bg-green-500/15 text-green-400"
                      : l.status === "archived" ? "bg-zinc-700 text-zinc-400"
                      : "bg-blue-500/15 text-blue-400"
                    }`}>{STATUS_LABEL[l.status]}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm text-zinc-400 flex-wrap">
                    {l.phone && (
                      <>
                        <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-white"><Phone size={13} /> {l.phone}</a>
                        <a href={waLink(l.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-green-400"><MessageCircle size={13} /> WhatsApp</a>
                      </>
                    )}
                    {l.email && (
                      <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5 hover:text-white">✉ {l.email}</a>
                    )}
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-500">{relTime(l.createdAt)}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-600 text-xs">{l.source}</span>
                  </div>
                  {l.message && <p className="mt-3 text-sm text-zinc-300 bg-zinc-800/60 rounded-lg px-3 py-2 max-w-2xl">{l.message}</p>}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {l.status !== "contacted" && (
                    <button onClick={() => setStatus(l.id!, "contacted")} title="İletişim kuruldu" className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-green-400 hover:bg-green-500/10 transition-colors"><Check size={14} /></button>
                  )}
                  {l.status !== "archived" && (
                    <button onClick={() => setStatus(l.id!, "archived")} title="Arşivle" className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><Archive size={14} /></button>
                  )}
                  <button onClick={() => handleDelete(l.id!)} title="Sil" className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-900/40 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
