"use client";

import { useState, useEffect, useRef } from "react";
import {
  getHeroContent, saveHeroContent, type HeroContent,
  getNavbarContent, saveNavbarContent, type NavbarContent,
  uploadImage,
} from "@/lib/content";
import { Save, Plus, Trash2, RefreshCw, Upload, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react";

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
  const [loading, setLoading] = useState(true);

  const [heroSaving, setHeroSaving] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [navSaving, setNavSaving] = useState(false);
  const [navSaved, setNavSaved] = useState(false);

  useEffect(() => {
    Promise.all([getHeroContent(), getNavbarContent()]).then(([h, n]) => {
      setHero(h); setNavbar(n); setLoading(false);
    });
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

  function updateService(lang: "tr" | "en", idx: number, val: string) {
    if (!hero) return;
    const key = lang === "tr" ? "services_tr" : "services_en";
    const arr = [...hero[key]]; arr[idx] = val;
    setHero({ ...hero, [key]: arr });
  }

  if (loading) {
    return <div className="p-8 flex items-center gap-3 text-zinc-500"><RefreshCw size={16} className="animate-spin" /> Yükleniyor...</div>;
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
    </div>
  );
}
