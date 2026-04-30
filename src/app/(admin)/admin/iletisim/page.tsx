"use client";

import { useState, useEffect } from "react";
import {
  getContactContent,
  saveContactContent,
  uploadImage,
  type ContactContent,
} from "@/lib/content";
import { Save, RefreshCw, Upload, CheckCircle } from "lucide-react";

const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5 font-medium">{label}</label>
      {hint && <p className="text-xs text-zinc-600 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

/* ── Image field: URL input + upload button + preview ── */
function ImageField({
  label, value, onChange, storagePath, hint,
}: {
  label: string; value: string;
  onChange: (url: string) => void;
  storagePath: string; hint?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, `contact/${storagePath}_${Date.now()}_${file.name}`);
    onChange(url);
    setUploading(false);
  }

  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5 font-medium">{label}</label>
      {hint && <p className="text-xs text-zinc-600 mb-1.5">{hint}</p>}
      {value && (
        <img src={value} alt={label} className="w-full h-40 object-cover rounded-lg mb-2" />
      )}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... veya aşağıdan yükle"
          className={INPUT}
        />
        <label className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg cursor-pointer transition-colors">
          {uploading
            ? <RefreshCw size={13} className="animate-spin" />
            : <Upload size={13} />}
          {uploading ? "Yükleniyor" : "Yükle"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════ */
export default function IletisimAdmin() {
  const [data, setData]       = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    getContactContent().then(d => { setData(d); setLoading(false); });
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    await saveContactContent(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-zinc-500">
        <RefreshCw size={16} className="animate-spin" /> Yükleniyor...
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-400">Veri yüklenemedi.</div>;

  return (
    <div className="p-8 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">İletişim Sayfası</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Görseller Firebase Storage'a yüklenir · Bilgiler Firestore'a kaydedilir
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50"
        >
          {saving
            ? <RefreshCw size={14} className="animate-spin" />
            : saved
            ? <CheckCircle size={14} className="text-green-600" />
            : <Save size={14} />}
          {saving ? "Kaydediliyor..." : saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

      <div className="space-y-8">

        {/* ── Görseller ── */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Görseller</h2>

          <ImageField
            label="Hero Görseli (üst kapak)"
            hint="Sayfa başındaki büyük görsel — 1400px genişlik önerilir"
            value={data.heroImage}
            onChange={async v => {
              const newData = { ...data, heroImage: v };
              setData(newData);
              setSaving(true);
              await saveContactContent(newData);
              setSaving(false); setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            storagePath="hero"
          />

          <div className="grid grid-cols-2 gap-4">
            <ImageField
              label="Alt Görsel 1 (sol)"
              value={data.image1}
              onChange={async v => {
                const newData = { ...data, image1: v };
                setData(newData);
                setSaving(true);
                await saveContactContent(newData);
                setSaving(false); setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
              storagePath="img1"
            />
            <ImageField
              label="Alt Görsel 2 (sağ)"
              value={data.image2}
              onChange={async v => {
                const newData = { ...data, image2: v };
                setData(newData);
                setSaving(true);
                await saveContactContent(newData);
                setSaving(false); setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
              storagePath="img2"
            />
          </div>
        </section>

        {/* ── İletişim Bilgileri ── */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">İletişim Bilgileri</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="E-posta">
              <input
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                className={INPUT}
                placeholder="hello@brog.com"
                type="email"
              />
            </Field>
            <Field label="Telefon">
              <input
                value={data.phone}
                onChange={e => setData({ ...data, phone: e.target.value })}
                className={INPUT}
                placeholder="+90 555 000 0000"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Adres (Türkçe)">
              <textarea
                value={data.address_tr}
                onChange={e => setData({ ...data, address_tr: e.target.value })}
                rows={3}
                className={`${INPUT} resize-none`}
                placeholder="İstanbul, Türkiye"
              />
            </Field>
            <Field label="Address (English)">
              <textarea
                value={data.address_en}
                onChange={e => setData({ ...data, address_en: e.target.value })}
                rows={3}
                className={`${INPUT} resize-none`}
                placeholder="Istanbul, Turkey"
              />
            </Field>
          </div>

          <Field label="Google Maps Linki" hint="Opsiyonel — 'Haritada Gör' bağlantısı olarak görünür">
            <input
              value={data.maps_link}
              onChange={e => setData({ ...data, maps_link: e.target.value })}
              className={INPUT}
              placeholder="https://maps.google.com/..."
            />
          </Field>
        </section>

        {/* ── Canlı önizleme linki ── */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Canlı Sayfa</p>
            <p className="text-xs text-zinc-500 mt-0.5">/tr/iletisim · /en/iletisim</p>
          </div>
          <a
            href="/tr/iletisim"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg transition-colors"
          >
            Sayfayı Gör
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 9.5L9.5 1.5M9.5 1.5H4M9.5 1.5V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}
