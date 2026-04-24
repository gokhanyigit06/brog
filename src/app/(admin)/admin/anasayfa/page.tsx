"use client";

import { useState, useEffect, useRef } from "react";
import {
  getHeroContent, saveHeroContent, type HeroContent,
  getNavbarContent, saveNavbarContent, type NavbarContent,
  getShowcaseContent, saveShowcaseContent, type ShowcaseContent, type ShowcaseMediaItem,
  getProjectsContent, saveProjectsContent, type ProjectsContent, type ProjectItem,
  getWhyContent, saveWhyContent, type WhyContent, type WhyFeature,
  uploadImage,
} from "@/lib/content";
import { Save, Plus, Trash2, RefreshCw, Upload, Image as ImageIcon, ChevronDown, ChevronUp, Video, ArrowUp, ArrowDown } from "lucide-react";

// ── Shared styles ───────────────────────────────────────────────
const INPUT = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors";

function Card({ title, subtitle, children, defaultOpen = true }: {
  title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="text-left">
          <p className="text-sm font-semibold text-white">{title}</p>
          {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
        {open ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-zinc-800 pt-5">{children}</div>}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-zinc-600 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function SaveBar({ onSave, saving, saved }: { onSave: () => void; saving: boolean; saved: boolean }) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50"
    >
      {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
      {saved ? "Kaydedildi ✓" : "Kaydet"}
    </button>
  );
}

// ── Image Upload helper ─────────────────────────────────────────
function ImageUpload({ url, onUpload, storagePath, aspect = "16/9", label = "Görsel Yükle" }: {
  url: string; onUpload: (url: string) => void; storagePath: string; aspect?: string; label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const uploaded = await uploadImage(file, `${storagePath}/${Date.now()}_${file.name}`);
    onUpload(uploaded);
    setUploading(false);
  }

  return (
    <div>
      {url ? (
        <div className="relative rounded-xl overflow-hidden border border-zinc-700 mb-3" style={{ aspectRatio: aspect }}>
          <img src={url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <button onClick={() => inputRef.current?.click()} className="bg-white text-zinc-900 px-3 py-1.5 rounded-lg text-xs font-semibold">
              Değiştir
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-zinc-700 rounded-xl py-8 hover:border-zinc-500 transition-colors mb-3"
        >
          <ImageIcon size={24} className="text-zinc-600" />
          <span className="text-sm text-zinc-500">{label}</span>
        </button>
      )}
      <label className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors w-fit">
        {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? "Yükleniyor..." : "Dosya Seç"}
        <input ref={inputRef} type="file" accept="image/*" onChange={handle} className="hidden" />
      </label>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════
export default function AnasayfaAdmin() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [navbar, setNavbar] = useState<NavbarContent | null>(null);
  const [showcase, setShowcase] = useState<ShowcaseContent | null>(null);
  const [projects, setProjects] = useState<ProjectsContent | null>(null);
  const [why, setWhy] = useState<WhyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [heroSaving, setHeroSaving] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [navSaving, setNavSaving] = useState(false);
  const [navSaved, setNavSaved] = useState(false);
  const [showcaseSaving, setShowcaseSaving] = useState(false);
  const [showcaseSaved, setShowcaseSaved] = useState(false);
  const [projectsSaving, setProjectsSaving] = useState(false);
  const [projectsSaved, setProjectsSaved] = useState(false);
  const [whySaving, setWhySaving] = useState(false);
  const [whySaved, setWhySaved] = useState(false);

  useEffect(() => {
    Promise.all([getHeroContent(), getNavbarContent(), getShowcaseContent(), getProjectsContent(), getWhyContent()])
      .then(([h, n, s, p, w]) => { setHero(h); setNavbar(n); setShowcase(s); setProjects(p); setWhy(w); setLoading(false); })
      .catch((err) => { console.error("Firebase error:", err); setError(err?.message || "Firebase bağlantı hatası"); setLoading(false); });
  }, []);

  async function saveHero() {
    if (!hero) return;
    setHeroSaving(true);
    await saveHeroContent(hero);
    setHeroSaving(false); setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 2500);
  }

  async function saveNavbar() {
    if (!navbar) return;
    setNavSaving(true);
    await saveNavbarContent(navbar);
    setNavSaving(false); setNavSaved(true);
    setTimeout(() => setNavSaved(false), 2500);
  }

  async function saveShowcase() {
    if (!showcase) return;
    setShowcaseSaving(true);
    await saveShowcaseContent(showcase);
    setShowcaseSaving(false); setShowcaseSaved(true);
    setTimeout(() => setShowcaseSaved(false), 2500);
  }

  async function addShowcaseMedia(file: File, type: "image" | "video") {
    const url = await uploadImage(file, `showcase/${Date.now()}_${file.name}`);
    const newItem: ShowcaseMediaItem = {
      id: Date.now().toString(),
      url,
      type,
      order: (showcase?.mediaItems.length ?? 0),
      duration: 3,
    };
    setShowcase((prev) => prev ? { ...prev, mediaItems: [...prev.mediaItems, newItem] } : prev);
  }

  function removeShowcaseMedia(id: string) {
    setShowcase((prev) => prev ? { ...prev, mediaItems: prev.mediaItems.filter(m => m.id !== id).map((m, i) => ({ ...m, order: i })) } : prev);
  }

  function moveShowcaseMedia(id: string, dir: -1 | 1) {
    setShowcase((prev) => {
      if (!prev) return prev;
      const items = [...prev.mediaItems].sort((a,b) => a.order - b.order);
      const idx = items.findIndex(m => m.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= items.length) return prev;
      [items[idx], items[newIdx]] = [items[newIdx], items[idx]];
      return { ...prev, mediaItems: items.map((m, i) => ({ ...m, order: i })) };
    });
  }

  function updateService(lang: "tr" | "en", idx: number, val: string) {
    if (!hero) return;
    const key = lang === "tr" ? "services_tr" : "services_en";
    const arr = [...hero[key]]; arr[idx] = val;
    setHero({ ...hero, [key]: arr });
  }

  if (loading) {
    return <div className="p-8 flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="p-8 max-w-xl">
        <div className="bg-red-950/50 border border-red-800 rounded-xl p-6">
          <h2 className="text-red-400 font-semibold mb-2">Firebase Bağlantı Hatası</h2>
          <p className="text-red-300 text-sm mb-4 font-mono">{error}</p>
          <p className="text-zinc-400 text-sm mb-3">Firestore güvenlik kurallarını kontrol et. Test için aşağıdaki kuralları kullan:</p>
          <pre className="bg-zinc-900 rounded-lg p-4 text-xs text-green-400 overflow-x-auto">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}</pre>
          <button onClick={() => { setError(null); setLoading(true); Promise.all([getHeroContent(), getNavbarContent()]).then(([h,n]) => { setHero(h); setNavbar(n); setLoading(false); }).catch(e => { setError(e?.message); setLoading(false); }); }} className="mt-4 flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold">
            <RefreshCw size={14} /> Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const navLinks = [
    { key: "home",     labelTr: "Ana Sayfa",  labelEn: "Home"     },
    { key: "projects", labelTr: "Projeler",   labelEn: "Projects" },
    { key: "services", labelTr: "Hizmetler",  labelEn: "Services" },
    { key: "about",    labelTr: "Hakkımızda", labelEn: "About"    },
    { key: "contact",  labelTr: "İletişim",   labelEn: "Contact"  },
  ] as const;

  return (
    <div className="p-8 max-w-3xl space-y-10">

      {/* ── NAVBAR SECTION ─────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Navbar</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Logo, marka adı, iletişim bilgileri ve menü yazıları</p>
          </div>
          <SaveBar onSave={saveNavbar} saving={navSaving} saved={navSaved} />
        </div>

        <div className="space-y-4">
          {/* Logo & Brand */}
          <Card title="Logo & Marka" subtitle="Navbar'da görünecek logo ve yazı">
            <div className="grid grid-cols-2 gap-6">
              <Field label="Logo Görseli" hint="PNG/SVG önerilir, şeffaf arka plan">
                <ImageUpload
                  url={navbar!.logoUrl}
                  onUpload={(url) => setNavbar({ ...navbar!, logoUrl: url })}
                  storagePath="navbar"
                  aspect="3/1"
                  label="Logo Yükle"
                />
              </Field>
              <Field label="Marka Adı (Logo yanındaki yazı)">
                <input
                  value={navbar!.brandText}
                  onChange={(e) => setNavbar({ ...navbar!, brandText: e.target.value })}
                  className={INPUT}
                  placeholder="vogolab"
                />
                {navbar!.brandText && (
                  <p className="text-xs text-zinc-600 mt-2">Önizleme: <span className="text-white font-bold uppercase tracking-widest">{navbar!.brandText}</span></p>
                )}
              </Field>
            </div>
          </Card>

          {/* İletişim Bilgileri */}
          <Card title="İletişim Bilgileri" subtitle="Navbar sağında görünür">
            <div className="grid grid-cols-3 gap-4">
              <Field label="E-posta">
                <input value={navbar!.email} onChange={(e) => setNavbar({ ...navbar!, email: e.target.value })} className={INPUT} placeholder="hello@vogolab.com" />
              </Field>
              <Field label="Telefon">
                <input value={navbar!.phone} onChange={(e) => setNavbar({ ...navbar!, phone: e.target.value })} className={INPUT} placeholder="+90 555 000 0000" />
              </Field>
              <Field label="Konum">
                <input value={navbar!.location} onChange={(e) => setNavbar({ ...navbar!, location: e.target.value })} className={INPUT} placeholder="Istanbul, Turkey" />
              </Field>
            </div>
          </Card>

          {/* Menü — Links + Socials + Arka Plan */}
          <Card title="Menü Ayarları" subtitle="Hamburger menü linkleri, sosyal medya ve arka plan">
            {/* Link isimleri */}
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Link Yazıları</p>
            <div className="space-y-2 mb-6">
              <div className="grid grid-cols-3 gap-2 mb-1">
                <p className="text-xs text-zinc-600">Sayfa</p>
                <p className="text-xs text-zinc-600">🇹🇷 Türkçe</p>
                <p className="text-xs text-zinc-600">🇬🇧 English</p>
              </div>
              {navLinks.map(({ key, labelTr, labelEn }) => (
                <div key={key} className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-sm text-zinc-400">{labelTr}</span>
                  <input
                    value={(navbar as any)[`nav_${key}_tr`]}
                    onChange={(e) => setNavbar({ ...navbar!, [`nav_${key}_tr`]: e.target.value } as NavbarContent)}
                    className={INPUT}
                    placeholder={labelTr}
                  />
                  <input
                    value={(navbar as any)[`nav_${key}_en`]}
                    onChange={(e) => setNavbar({ ...navbar!, [`nav_${key}_en`]: e.target.value } as NavbarContent)}
                    className={INPUT}
                    placeholder={labelEn}
                  />
                </div>
              ))}
            </div>

            {/* Sosyal Medya */}
            <div className="border-t border-zinc-800 pt-5 mb-6">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Sosyal Medya Linkleri <span className="text-zinc-600 normal-case font-normal">(site genelinde geçerli)</span></p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: "social_x",         label: "X.com",      placeholder: "https://x.com/vogolab" },
                  { key: "social_dribbble",   label: "Dribbble",   placeholder: "https://dribbble.com/vogolab" },
                  { key: "social_instagram",  label: "Instagram",  placeholder: "https://instagram.com/vogolab" },
                  { key: "social_linkedin",   label: "LinkedIn",   placeholder: "https://linkedin.com/company/vogolab" },
                ] as const).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
                    <input
                      value={(navbar as any)[key]}
                      onChange={(e) => setNavbar({ ...navbar!, [key]: e.target.value } as NavbarContent)}
                      className={INPUT}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Menü Büyük Yazı */}
            <div className="border-t border-zinc-800 pt-5">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Menü Büyük Yazı</p>
              <p className="text-xs text-zinc-600 mb-3">Hamburger menü açıldığında sol altta görünen büyük yazı (2 satır)</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="1. Satır (ör: vogolab)">
                  <input
                    value={navbar!.menuBrandLine1 ?? "vogolab"}
                    onChange={(e) => setNavbar({ ...navbar!, menuBrandLine1: e.target.value })}
                    className={INPUT}
                    placeholder="vogolab"
                  />
                </Field>
                <Field label="2. Satır (ör: lab.)">
                  <input
                    value={navbar!.menuBrandLine2 ?? "lab."}
                    onChange={(e) => setNavbar({ ...navbar!, menuBrandLine2: e.target.value })}
                    className={INPUT}
                    placeholder="lab."
                  />
                </Field>
              </div>
            </div>

            {/* Menü Arka Plan */}
            <div className="border-t border-zinc-800 pt-5">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Menü Arka Plan Görseli</p>
              <p className="text-xs text-zinc-600 mb-3">Boş bırakılırsa menü arka planı siyah kalır</p>
              <ImageUpload
                url={navbar!.menuBgImage}
                onUpload={(url) => setNavbar({ ...navbar!, menuBgImage: url })}
                storagePath="menu"
                aspect="16/9"
                label="Arka Plan Görseli Yükle"
              />
              {navbar!.menuBgImage && (
                <button onClick={() => setNavbar({ ...navbar!, menuBgImage: "" })} className="text-xs text-red-400 hover:text-red-300 transition-colors mt-2">
                  Görseli kaldır (siyah arka plana dön)
                </button>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Hero</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Ana sayfa tam ekran hero bölümü</p>
          </div>
          <SaveBar onSave={saveHero} saving={heroSaving} saved={heroSaved} />
        </div>

        <div className="space-y-4">
          {/* Başlıklar */}
          <Card title="Ana Başlıklar" subtitle="Hero üzerindeki büyük yazılar">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Sol Büyük Başlık" hint="Ekranın sol üstünde (örn: VOGO)">
                <input value={hero!.title_main} onChange={(e) => setHero({ ...hero!, title_main: e.target.value })} className={INPUT} placeholder="VOGO" />
              </Field>
              <Field label="Sağ Alt Başlık" hint="Ekranın sağında (örn: lab.)">
                <input value={hero!.title_sub} onChange={(e) => setHero({ ...hero!, title_sub: e.target.value })} className={INPUT} placeholder="lab." />
              </Field>
            </div>
          </Card>

          {/* Animasyon Kartları */}
          <Card title="Animasyon Kartları" subtitle="Hero açılırken arka arkaya gelen 3 kart görseli (boş bırakılırsa gradient renk kullanılır)" defaultOpen={false}>
            <div className="grid grid-cols-3 gap-4">
              {([
                { key: "card1Image", label: "Kart 1 — Küçük" },
                { key: "card2Image", label: "Kart 2 — Orta" },
                { key: "card3Image", label: "Kart 3 — Büyük" },
              ] as const).map(({ key, label }) => (
                <div key={key}>
                  <p className="text-xs text-zinc-400 font-medium mb-2">{label}</p>
                  <ImageUpload
                    url={(hero as any)[key]}
                    onUpload={(url) => setHero({ ...hero!, [key]: url })}
                    storagePath="hero/cards"
                    aspect="16/9"
                    label="Görsel Yükle"
                  />
                  {(hero as any)[key] && (
                    <button
                      onClick={() => setHero({ ...hero!, [key]: "" } as HeroContent)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors mt-1"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Arka Plan */}
          <Card title="Arka Plan Görseli" subtitle="Hero'nun arka plan fotoğrafı (boş bırakılırsa gradient kullanılır)" defaultOpen={false}>
            <div className="space-y-4">
              <ImageUpload
                url={hero!.bgImage}
                onUpload={(url) => setHero({ ...hero!, bgImage: url })}
                storagePath="hero"
                aspect="16/9"
                label="Hero Arka Plan Görseli Yükle"
              />
              {hero!.bgImage && (
                <button onClick={() => setHero({ ...hero!, bgImage: "" })} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                  Görseli kaldır (gradient'e dön)
                </button>
              )}
              <Field label="Arka Plan Rengi (görsel yoksa kullanılır)">
                <div className="flex items-center gap-3">
                  <input value={hero!.bgColor} onChange={(e) => setHero({ ...hero!, bgColor: e.target.value })} className={`${INPUT} flex-1`} placeholder="linear-gradient(...)" />
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 border border-zinc-700" style={{ background: hero!.bgColor }} />
                </div>
              </Field>
            </div>
          </Card>


          {/* Hizmetler Listesi */}
          <Card title="Hizmetler Listesi" subtitle="Sol alt köşede görünür">
            <div className="space-y-2">
              <div className="grid grid-cols-[20px_1fr_1fr_32px] gap-2 mb-1">
                <span />
                <p className="text-xs text-zinc-600">🇹🇷 Türkçe</p>
                <p className="text-xs text-zinc-600">🇬🇧 English</p>
                <span />
              </div>
              {hero!.services_tr.map((_, idx) => (
                <div key={idx} className="grid grid-cols-[20px_1fr_1fr_32px] gap-2 items-center">
                  <span className="text-xs text-zinc-600 text-right">{idx + 1}</span>
                  <input value={hero!.services_tr[idx]} onChange={(e) => updateService("tr", idx, e.target.value)} className={INPUT} placeholder="MARKA" />
                  <input value={hero!.services_en[idx]} onChange={(e) => updateService("en", idx, e.target.value)} className={INPUT} placeholder="BRANDING" />
                  <button onClick={() => setHero({ ...hero!, services_tr: hero!.services_tr.filter((_, i) => i !== idx), services_en: hero!.services_en.filter((_, i) => i !== idx) })} className="p-1 text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setHero({ ...hero!, services_tr: [...hero!.services_tr, ""], services_en: [...hero!.services_en, ""] })}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mt-1"
              >
                <Plus size={14} /> Hizmet Ekle
              </button>
            </div>
          </Card>

          {/* Slogan */}
          <Card title="Slogan" subtitle="Sağ alt köşedeki açıklama metni">
            <div className="grid grid-cols-2 gap-4">
              <Field label="🇹🇷 Türkçe">
                <textarea value={hero!.slogan_tr} onChange={(e) => setHero({ ...hero!, slogan_tr: e.target.value })} rows={4} className={`${INPUT} resize-none`} />
              </Field>
              <Field label="🇬🇧 English">
                <textarea value={hero!.slogan_en} onChange={(e) => setHero({ ...hero!, slogan_en: e.target.value })} rows={4} className={`${INPUT} resize-none`} />
              </Field>
            </div>
          </Card>
        </div>
      </section>

      {/* ══ SHOWCASE SECTION ════════════════════════ */}
      {showcase && (
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Showcase Bölümü</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Hero altındaki dönüşlü medya ve içerik bölümü</p>
          </div>
          <SaveBar onSave={saveShowcase} saving={showcaseSaving} saved={showcaseSaved} />
        </div>

        <div className="space-y-4">
          {/* Medya Yönetimi */}
          <Card title="Medya Listesi" subtitle="2 saniyede bir dönüşlü görüntülenir — görsel ve video destekler">
            <div className="space-y-3 mb-4">
              {[...showcase.mediaItems].sort((a,b)=>a.order-b.order).map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-zinc-800 rounded-lg p-3">
                  {/* Thumb */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-700">
                    {item.type === "video" ? (
                      <video src={item.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-zinc-400 uppercase font-medium">{item.type === "video" ? "🎬 Video" : "🖼️ Görsel"}</span>
                    <p className="text-xs text-zinc-600 truncate mt-0.5">{item.url.split("/").pop()?.split("?")[0]}</p>
                  </div>
                  {/* Duration */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <span className="text-[10px] text-zinc-500">Süre (sn)</span>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={item.duration ?? 3}
                      onChange={(e) => setShowcase((prev) => prev ? {
                        ...prev,
                        mediaItems: prev.mediaItems.map((m) =>
                          m.id === item.id ? { ...m, duration: Number(e.target.value) } : m
                        )
                      } : prev)}
                      className="w-16 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white text-center focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  {/* Order */}
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveShowcaseMedia(item.id, -1)} className="p-1 text-zinc-500 hover:text-white"><ArrowUp size={12} /></button>
                    <button onClick={() => moveShowcaseMedia(item.id,  1)} className="p-1 text-zinc-500 hover:text-white"><ArrowDown size={12} /></button>
                  </div>
                  {/* Delete */}
                  <button onClick={() => removeShowcaseMedia(item.id)} className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {showcase.mediaItems.length === 0 && (
                <p className="text-sm text-zinc-600 py-4 text-center">Henüz medya eklenmedi</p>
              )}
            </div>
            {/* Upload buttons */}
            <div className="flex gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg cursor-pointer transition-colors">
                <ImageIcon size={14} /> Görsel Ekle
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) addShowcaseMedia(f, "image"); e.target.value=""; }} />
              </label>
              <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg cursor-pointer transition-colors">
                <Video size={14} /> Video Ekle
                <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) addShowcaseMedia(f, "video"); e.target.value=""; }} />
              </label>
            </div>
            <p className="text-xs text-zinc-600 mt-2">Ekledikten sonra "Kaydet" butonuna basmayı unutma!</p>
          </Card>

          {/* Metin İçeriği */}
          <Card title="Metin İçeriği" subtitle="Sağ taraf yazıları" defaultOpen={false}>
            <div className="space-y-4">
              <Field label="Etiket (sol üst küçük yazı)">
                <input value={showcase.label} onChange={(e) => setShowcase({...showcase, label: e.target.value})} className={INPUT} placeholder="01 — Our Commitment" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="🇹🇷 Başlık TR">
                  <textarea value={showcase.title_tr} onChange={(e) => setShowcase({...showcase, title_tr: e.target.value})} rows={3} className={`${INPUT} resize-none`} />
                </Field>
                <Field label="🇬🇧 Başlık EN">
                  <textarea value={showcase.title_en} onChange={(e) => setShowcase({...showcase, title_en: e.target.value})} rows={3} className={`${INPUT} resize-none`} />
                </Field>
                <Field label="🇹🇷 Açıklama TR">
                  <textarea value={showcase.description_tr} onChange={(e) => setShowcase({...showcase, description_tr: e.target.value})} rows={3} className={`${INPUT} resize-none`} />
                </Field>
                <Field label="🇬🇧 Açıklama EN">
                  <textarea value={showcase.description_en} onChange={(e) => setShowcase({...showcase, description_en: e.target.value})} rows={3} className={`${INPUT} resize-none`} />
                </Field>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card title="İstatistikler" subtitle="3 adet rakam göstergesi" defaultOpen={false}>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 mb-1">
                <span className="text-xs text-zinc-600">#</span>
                <span className="text-xs text-zinc-600">Değer</span>
                <span className="text-xs text-zinc-600">🇹🇷 Etiket</span>
                <span className="text-xs text-zinc-600">🇬🇧 Label</span>
              </div>
              {([1,2,3] as const).map((n) => (
                <div key={n} className="grid grid-cols-4 gap-2 items-center">
                  <span className="text-xs text-zinc-500">Stat {n}</span>
                  <input value={(showcase as any)[`stat${n}_value`]} onChange={(e) => setShowcase({...showcase, [`stat${n}_value`]: e.target.value} as ShowcaseContent)} className={INPUT} placeholder="120+" />
                  <input value={(showcase as any)[`stat${n}_label_tr`]} onChange={(e) => setShowcase({...showcase, [`stat${n}_label_tr`]: e.target.value} as ShowcaseContent)} className={INPUT} placeholder="Proje" />
                  <input value={(showcase as any)[`stat${n}_label_en`]} onChange={(e) => setShowcase({...showcase, [`stat${n}_label_en`]: e.target.value} as ShowcaseContent)} className={INPUT} placeholder="Projects" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
      )}

      {/* ══ PROJECTS SECTION ═══════════════════════ */}
      {projects && (
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Projeler Bölümü</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Showcase altındaki proje kartları</p>
          </div>
          <SaveBar onSave={async () => { setProjectsSaving(true); await saveProjectsContent(projects); setProjectsSaving(false); setProjectsSaved(true); setTimeout(() => setProjectsSaved(false), 2500); }} saving={projectsSaving} saved={projectsSaved} />
        </div>

        <div className="space-y-4">
          {/* Başlık & Açıklama */}
          <Card title="Başlık ve Açıklama" subtitle="Bölüm üstü metinler" defaultOpen={false}>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Field label="Etiket (ör: 02)">
                  <input value={projects.label} onChange={(e) => setProjects({...projects, label: e.target.value})} className={INPUT} placeholder="02" />
                </Field>
                <Field label="🇹🇷 Başlık TR">
                  <input value={projects.title_tr} onChange={(e) => setProjects({...projects, title_tr: e.target.value})} className={INPUT} placeholder="Projeler" />
                </Field>
                <Field label="🇬🇧 Title EN">
                  <input value={projects.title_en} onChange={(e) => setProjects({...projects, title_en: e.target.value})} className={INPUT} placeholder="Latest Works" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="🇹🇷 Açıklama TR">
                  <textarea value={projects.description_tr} onChange={(e) => setProjects({...projects, description_tr: e.target.value})} rows={3} className={`${INPUT} resize-none`} />
                </Field>
                <Field label="🇬🇧 Description EN">
                  <textarea value={projects.description_en} onChange={(e) => setProjects({...projects, description_en: e.target.value})} rows={3} className={`${INPUT} resize-none`} />
                </Field>
              </div>
              <Field label="&quot;Tümü Gör&quot; linki">
                <input value={projects.viewAllLink} onChange={(e) => setProjects({...projects, viewAllLink: e.target.value})} className={INPUT} placeholder="/projects" />
              </Field>
            </div>
          </Card>

          {/* Proje Kartları */}
          <Card title="Proje Kartları" subtitle="Her kart: görsel, marka adı, yıl, kategori, link">
            <div className="space-y-3 mb-4">
              {[...projects.projects].sort((a,b)=>a.order-b.order).map((proj) => (
                <div key={proj.id} className="bg-zinc-800 rounded-xl p-4 space-y-3">
                  {/* Thumb + controls row */}
                  <div className="flex items-start gap-3">
                    {/* Thumb */}
                    <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-700">
                      {proj.imageUrl ? <img src={proj.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-zinc-600" /></div>}
                    </div>
                    {/* Image upload */}
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg cursor-pointer transition-colors">
                      <Upload size={12} /> Görsel Değiştir
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0]; if (!f) return;
                        const url = await uploadImage(f, `projects/${Date.now()}_${f.name}`);
                        setProjects(prev => prev ? { ...prev, projects: prev.projects.map(p => p.id === proj.id ? {...p, imageUrl: url} : p) } : prev);
                        e.target.value = "";
                      }} />
                    </label>
                    {/* Order + delete */}
                    <div className="ml-auto flex items-center gap-2">
                      <button onClick={() => setProjects(prev => { if(!prev) return prev; const arr = [...prev.projects].sort((a,b)=>a.order-b.order); const i = arr.findIndex(p=>p.id===proj.id); if(i<=0) return prev; [arr[i],arr[i-1]]=[arr[i-1],arr[i]]; return {...prev, projects: arr.map((p,idx)=>({...p,order:idx}))}; })} className="p-1.5 text-zinc-500 hover:text-white"><ArrowUp size={13}/></button>
                      <button onClick={() => setProjects(prev => { if(!prev) return prev; const arr = [...prev.projects].sort((a,b)=>a.order-b.order); const i = arr.findIndex(p=>p.id===proj.id); if(i>=arr.length-1) return prev; [arr[i],arr[i+1]]=[arr[i+1],arr[i]]; return {...prev, projects: arr.map((p,idx)=>({...p,order:idx}))}; })} className="p-1.5 text-zinc-500 hover:text-white"><ArrowDown size={13}/></button>
                      <button onClick={() => setProjects(prev => prev ? {...prev, projects: prev.projects.filter(p=>p.id!==proj.id).map((p,i)=>({...p,order:i}))} : prev)} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={13}/></button>
                    </div>
                  </div>
                  {/* Fields */}
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Marka Adı">
                      <input value={proj.brandName} onChange={(e) => setProjects(prev => prev ? {...prev, projects: prev.projects.map(p=>p.id===proj.id?{...p,brandName:e.target.value}:p)} : prev)} className={INPUT} placeholder="Urban Glow" />
                    </Field>
                    <Field label="Yıl">
                      <input value={proj.year} onChange={(e) => setProjects(prev => prev ? {...prev, projects: prev.projects.map(p=>p.id===proj.id?{...p,year:e.target.value}:p)} : prev)} className={INPUT} placeholder="2025" />
                    </Field>
                    <Field label="Kategori (hover'da görünür)">
                      <input value={proj.category} onChange={(e) => setProjects(prev => prev ? {...prev, projects: prev.projects.map(p=>p.id===proj.id?{...p,category:e.target.value}:p)} : prev)} className={INPUT} placeholder="Web Design" />
                    </Field>
                    <Field label="Link (opsiyonel)">
                      <input value={proj.link} onChange={(e) => setProjects(prev => prev ? {...prev, projects: prev.projects.map(p=>p.id===proj.id?{...p,link:e.target.value}:p)} : prev)} className={INPUT} placeholder="/projects/urban-glow" />
                    </Field>
                  </div>
                </div>
              ))}
              {projects.projects.length === 0 && (
                <p className="text-sm text-zinc-600 py-4 text-center">Henüz proje eklenmedi</p>
              )}
            </div>
            <button
              onClick={() => setProjects(prev => prev ? {...prev, projects: [...prev.projects, { id: Date.now().toString(), imageUrl: "", brandName: "", year: new Date().getFullYear().toString(), category: "", link: "", order: prev.projects.length }]} : prev)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg transition-colors"
            >
              <Plus size={14} /> Yeni Proje Ekle
            </button>
          </Card>
        </div>
      </section>
      )}

      {/* ══ WHY SECTION ══════════════════════════ */}
      {why && (
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Neden Biz Bölümü</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Medya kutusu ve 4 özellik kartı</p>
          </div>
          <SaveBar onSave={async () => { setWhySaving(true); await saveWhyContent(why); setWhySaving(false); setWhySaved(true); setTimeout(() => setWhySaved(false), 2500); }} saving={whySaving} saved={whySaved} />
        </div>
        <div className="space-y-4">
          {/* Başlık */}
          <Card title="Başlık" subtitle="Sol üst kısım" defaultOpen={false}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Etiket (ör: 03)">
                <input value={why.label} onChange={(e) => setWhy({...why, label: e.target.value})} className={INPUT} placeholder="03" />
              </Field>
              <Field label="🇹🇷 Başlık TR">
                <input value={why.title_tr} onChange={(e) => setWhy({...why, title_tr: e.target.value})} className={INPUT} placeholder="Neden Biz?" />
              </Field>
              <Field label="🇬🇧 Title EN">
                <input value={why.title_en} onChange={(e) => setWhy({...why, title_en: e.target.value})} className={INPUT} placeholder="Why Brog?" />
              </Field>
            </div>
          </Card>

          {/* Medya Kutusu */}
          <Card title="Sağ Medya Kutusu" subtitle="250 × 170 px — görsel veya video">
            <div className="flex items-start gap-4 mb-4">
              {why.mediaUrl ? (
                <div className="w-40 h-24 rounded-lg overflow-hidden bg-zinc-700 flex-shrink-0">
                  {why.mediaType === "video"
                    ? <video src={why.mediaUrl} className="w-full h-full object-cover" muted />
                    : <img src={why.mediaUrl} alt="" className="w-full h-full object-cover" />}
                </div>
              ) : (
                <div className="w-40 h-24 rounded-lg bg-zinc-700 flex-shrink-0 flex items-center justify-center"><ImageIcon size={18} className="text-zinc-500" /></div>
              )}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg cursor-pointer transition-colors">
                  <ImageIcon size={12} /> Görsel Yükle
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f=e.target.files?.[0]; if(!f) return; const url=await uploadImage(f,`why/${Date.now()}_${f.name}`); setWhy({...why, mediaUrl: url, mediaType: "image"}); e.target.value=""; }} />
                </label>
                <label className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg cursor-pointer transition-colors">
                  <Video size={12} /> Video Yükle
                  <input type="file" accept="video/*" className="hidden" onChange={async (e) => { const f=e.target.files?.[0]; if(!f) return; const url=await uploadImage(f,`why/${Date.now()}_${f.name}`); setWhy({...why, mediaUrl: url, mediaType: "video"}); e.target.value=""; }} />
                </label>
                {why.mediaUrl && <button onClick={() => setWhy({...why, mediaUrl: ""})} className="text-xs text-red-400 hover:text-red-300 text-left">Kaldır</button>}
              </div>
            </div>
          </Card>

          {/* Özellik Kartları */}
          <Card title="Özellik Kartları" subtitle="4 adet — ikon, başlık, açıklama">
            <div className="grid grid-cols-2 gap-3">
              {[...why.features].sort((a,b)=>a.order-b.order).map((f) => (
                <div key={f.id} className="bg-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input value={f.icon} onChange={(e) => setWhy(prev => prev ? {...prev, features: prev.features.map(x => x.id===f.id ? {...x, icon: e.target.value} : x)} : prev)} className="w-14 text-center bg-zinc-700 border border-zinc-600 rounded px-2 py-1.5 text-sm text-white" placeholder="✦" />
                    <span className="text-xs text-zinc-500">ikon / emoji</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="🇹🇷 Başlık TR">
                      <textarea value={f.title_tr} onChange={(e) => setWhy(prev => prev ? {...prev, features: prev.features.map(x => x.id===f.id ? {...x, title_tr: e.target.value} : x)} : prev)} rows={2} className={`${INPUT} resize-none text-xs`} />
                    </Field>
                    <Field label="🇬🇧 Title EN">
                      <textarea value={f.title_en} onChange={(e) => setWhy(prev => prev ? {...prev, features: prev.features.map(x => x.id===f.id ? {...x, title_en: e.target.value} : x)} : prev)} rows={2} className={`${INPUT} resize-none text-xs`} />
                    </Field>
                    <Field label="🇹🇷 Açıklama TR">
                      <textarea value={f.description_tr} onChange={(e) => setWhy(prev => prev ? {...prev, features: prev.features.map(x => x.id===f.id ? {...x, description_tr: e.target.value} : x)} : prev)} rows={3} className={`${INPUT} resize-none text-xs`} />
                    </Field>
                    <Field label="🇬🇧 Description EN">
                      <textarea value={f.description_en} onChange={(e) => setWhy(prev => prev ? {...prev, features: prev.features.map(x => x.id===f.id ? {...x, description_en: e.target.value} : x)} : prev)} rows={3} className={`${INPUT} resize-none text-xs`} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
      )}
    </div>
  );
}
