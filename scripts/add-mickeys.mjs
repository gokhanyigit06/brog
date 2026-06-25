import { chromium } from "playwright";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

const app = initializeApp({
  apiKey: "AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k",
  authDomain: "brog-1acb3.firebaseapp.com",
  projectId: "brog-1acb3",
  storageBucket: "brog-1acb3.firebasestorage.app",
  messagingSenderId: "370433122581",
  appId: "1:370433122581:web:9092002ef883d620f3c91c",
});

const storage = getStorage(app);
const db = getFirestore(app);

async function upload(filePath, name) {
  const buffer = fs.readFileSync(filePath);
  const r = ref(storage, `projects/mickeys-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  console.log(`✓ ${name}`);
  return url;
}

const browser = await chromium.launch();
// Mobil görünüm — QR menü mobilde kullanılır
const mobileCtx = await browser.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2 });
const mobilePage = await mobileCtx.newPage();

// Desktop görünüm
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const urls = {};

// ── Desktop hero ──
await page.goto("https://menu.mickeys.com.tr", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/mk_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/mk_hero.jpg", "hero");

// Menü kategori görünümü (scroll)
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
await page.waitForTimeout(1000);
await page.screenshot({ path: "scripts/mk_menu1.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.menu1 = await upload("scripts/mk_menu1.jpg", "menu1");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await page.waitForTimeout(1000);
await page.screenshot({ path: "scripts/mk_menu2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.menu2 = await upload("scripts/mk_menu2.jpg", "menu2");

// ── Mobil görünüm (QR menü asıl kullanım) ──
await mobilePage.goto("https://menu.mickeys.com.tr", { waitUntil: "networkidle" });
await mobilePage.waitForTimeout(3000);
await mobilePage.evaluate(() => window.scrollTo(0, 0));
await mobilePage.waitForTimeout(600);
await mobilePage.screenshot({ path: "scripts/mk_mobile1.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.mobile1 = await upload("scripts/mk_mobile1.jpg", "mobile1");

await mobilePage.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
await mobilePage.waitForTimeout(1000);
await mobilePage.screenshot({ path: "scripts/mk_mobile2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.mobile2 = await upload("scripts/mk_mobile2.jpg", "mobile2");

await mobilePage.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await mobilePage.waitForTimeout(1000);
await mobilePage.screenshot({ path: "scripts/mk_mobile3.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.mobile3 = await upload("scripts/mk_mobile3.jpg", "mobile3");

await browser.close();

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "QR Menü",
    title_tr: "Mickey's Cafe & Bistro için Dijital QR Menü",
    title_en: "Digital QR Menu for Mickey's Cafe & Bistro",
    body_tr: "Mickey's Cafe & Bistro için baştan sona özel, mobil öncelikli bir dijital QR menü geliştirdik. Masadaki QR kodu okutan misafir, telefonundan tüm menüye anında ulaşıyor.\n\n40'tan fazla kategori (çorbalar, atıştırmalıklar, Meksika lezzetleri, burgerler, pizzalar, ana yemekler, tatlılar; ayrıca geniş bir içecek, kokteyl, bira ve şarap kartı), ürün görselleri, açıklamalar, varyasyonlu fiyatlandırma ve alerjen bilgisi tek arayüzde sunuluyor.",
    body_en: "We built a fully custom, mobile-first digital QR menu for Mickey's Cafe & Bistro. Guests scan the QR code at their table and instantly access the entire menu on their phone.\n\nOver 40 categories (soups, snacks, Mexican dishes, burgers, pizzas, main courses, desserts; plus an extensive drinks, cocktail, beer, and wine list), product images, descriptions, variant pricing, and allergen information are all presented in a single interface.",
  },
  { type: "single_image", url: urls.menu1, ratio: "16:9" },
  {
    type: "text_block",
    label: "Özellikler",
    title_tr: "Kolay Yönetilebilir, Çok Dilli ve Hızlı",
    title_en: "Easy to Manage, Multilingual, and Fast",
    body_tr: "Çok Dilli: Türkçe ve İngilizce tam menü desteği.\nAlerjen Bilgisi: Misafirler için ayrı alerjen rehberi.\nKategori Navigasyonu: Açılır-kapanır kategorilerle hızlı gezinme.\nDinamik Fiyatlandırma: Tarih bazlı fiyat güncellemeleri (örn. KDV dahil fiyat geçiş tarihi).\nVaryasyon Desteği: Aynı ürünün peynirli/tavuklu/etli gibi farklı seçenekleri ve fiyatları.\nMobil Öncelikli: QR ile açıldığında telefonda kusursuz görünüm ve hızlı yükleme.",
    body_en: "Multilingual: Full menu support in Turkish and English.\nAllergen Info: A dedicated allergen guide for guests.\nCategory Navigation: Fast browsing with collapsible categories.\nDynamic Pricing: Date-based price updates (e.g., VAT-inclusive pricing transition).\nVariant Support: Different options and prices for the same item (cheese/chicken/beef, etc.).\nMobile-First: Flawless display and fast loading on phones when opened via QR.",
  },
  { type: "single_image", url: urls.mobile1, ratio: "9:16" },
  { type: "single_image", url: urls.mobile2, ratio: "9:16" },
  { type: "single_image", url: urls.mobile3, ratio: "9:16" },
  { type: "single_image", url: urls.menu2, ratio: "16:9" },
  {
    type: "text_block",
    label: "Reklam Yönetimi",
    title_tr: "Dijital Reklam & Sosyal Medya Yönetimi",
    title_en: "Digital Advertising & Social Media Management",
    body_tr: "QR menünün yanı sıra Mickey's için dijital reklam hizmetleri de veriyoruz. Restoran ve bar sektörüne özel, yerel hedefli Meta Ads (Instagram & Facebook) kampanyalarıyla yeni müşteri kazanımı, kampanya duyuruları ve marka bilinirliği çalışmaları yürütüyoruz.\n\nLokasyon bazlı hedefleme, görsel içerik üretimi ve etkileşim odaklı kreatiflerle restoranın dijital trafiğini ve masaya dönüşümünü artırıyoruz.",
    body_en: "Alongside the QR menu, we also provide digital advertising services for Mickey's. We run locally targeted Meta Ads (Instagram & Facebook) campaigns tailored to the restaurant and bar sector for new customer acquisition, campaign announcements, and brand awareness.\n\nWith location-based targeting, visual content production, and engagement-focused creatives, we increase the restaurant's digital traffic and table conversions.",
  },
  {
    type: "text_block",
    label: "Hizmet Özeti",
    title_tr: "Hizmet Kapsamı",
    title_en: "Scope of Services",
    body_tr: "\nÜrün: Özel geliştirilmiş dijital QR menü\n\nDil: Türkçe & İngilizce\n\nİçerik: 40+ kategori, ürün görselleri, alerjen rehberi\n\nReklam: Meta Ads, lokasyon bazlı hedefleme\n\nSosyal Medya: İçerik üretimi & kampanya yönetimi\n\nPlatform: Mobil öncelikli web uygulaması",
    body_en: "\nProduct: Custom-built digital QR menu\n\nLanguage: Turkish & English\n\nContent: 40+ categories, product images, allergen guide\n\nAds: Meta Ads, location-based targeting\n\nSocial Media: Content production & campaign management\n\nPlatform: Mobile-first web application",
  },
];

const docRef = await addDoc(collection(db, "projects"), {
  title: "Mickey's Cafe & Bistro",
  brandName: "Mickey's Cafe & Bistro",
  slug: "mickeys",
  description_tr: "Mickey's Cafe & Bistro için mobil öncelikli, çok dilli dijital QR menü geliştirdik ve dijital reklam hizmetleri sunuyoruz. 40'tan fazla kategori, ürün görselleri, alerjen bilgisi ve varyasyonlu fiyatlandırma içeren QR menünün yanı sıra; restoran sektörüne özel Meta Ads kampanyalarıyla markanın dijital görünürlüğünü artırıyoruz.",
  description_en: "We developed a mobile-first, multilingual digital QR menu for Mickey's Cafe & Bistro and provide digital advertising services. Alongside the QR menu featuring 40+ categories, product images, allergen info, and variant pricing, we boost the brand's digital visibility through Meta Ads campaigns tailored to the restaurant sector.",
  industry_tr: "Restoran & Cafe",
  industry_en: "Restaurant & Cafe",
  timeline: "",
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  year: "2024",
  category: "QR Menu & Digital Ads",
  tags: ["QR Menu", "Web App", "Meta Ads", "Multilingual", "Restaurant"],
  link: "https://menu.mickeys.com.tr",
  order: 5,
  featured: true,
  blocks,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log("✅ Mickey's eklendi:", docRef.id);
process.exit(0);
