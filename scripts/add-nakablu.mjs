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
  const r = ref(storage, `projects/nakablu-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  console.log(`✓ ${name}`);
  return url;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const urls = {};

await page.goto("https://nakablu.com", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
try { await page.click("text=Accept", { timeout: 2000 }); } catch {}
try { await page.click("[class*='close'], .modal__close, button[aria-label*='close']", { timeout: 2000 }); } catch {}

await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/nk_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/nk_hero.jpg", "hero");

await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/nk_s2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s2 = await upload("scripts/nk_s2.jpg", "s2");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/nk_s3.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s3 = await upload("scripts/nk_s3.jpg", "s3");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/nk_s4.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s4 = await upload("scripts/nk_s4.jpg", "s4");

for (const path of ["/collections/necklaces", "/collections/all", "/collections/chains"]) {
  try {
    await page.goto("https://nakablu.com" + path, { waitUntil: "domcontentloaded", timeout: 40000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: "scripts/nk_collection.jpg", fullPage: false, type: "jpeg", quality: 92 });
    urls.collection = await upload("scripts/nk_collection.jpg", "collection");
    break;
  } catch {}
}

await browser.close();

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "Marka",
    title_tr: "\"Made for Moments\" — Lüks Takı E-Ticareti",
    title_en: "\"Made for Moments\" — Luxury Jewelry E-Commerce",
    body_tr: "Nakablu, \"Made for Moments\" sloganıyla tasarımcı takı sunan lüks bir e-ticaret markasıdır. Altın kaplama zincirler, kolyeler, küpeler, yüzükler, bilezikler ve özel parçalardan oluşan geniş bir koleksiyona sahiptir.\n\nShopify altyapısı üzerinde markanın premium kimliğine uygun, dönüşüm odaklı bir alışveriş deneyimi için web sitesini sürekli geliştiriyor ve düzenliyoruz. Stil danışmanlığı (Styling Appointment), hediye paketleme ve hediye kartı gibi katma değerli özellikler satış akışına entegre edildi.",
    body_en: "Nakablu is a luxury e-commerce brand offering designer jewelry under the slogan \"Made for Moments.\" It features a wide collection of gold-plated chains, necklaces, earrings, rings, bracelets, and special pieces.\n\nOn the Shopify platform, we continuously develop and refine the website for a premium, conversion-focused shopping experience aligned with the brand's identity. Value-added features like Styling Appointments, gift packaging, and gift cards were integrated into the sales flow.",
  },
  { type: "single_image", url: urls.s2, ratio: "16:9" },
  { type: "single_image", url: urls.s3, ratio: "16:9" },
  ...(urls.collection ? [{ type: "single_image", url: urls.collection, ratio: "16:9" }] : []),
  {
    type: "text_block",
    label: "Reklam Yönetimi",
    title_tr: "Meta & Google Reklam + Sürekli Site Optimizasyonu",
    title_en: "Meta & Google Ads + Ongoing Site Optimization",
    body_tr: "Nakablu için iki koldan ilerliyoruz:\n\nReklam: Meta Ads (Instagram & Facebook) ile takı ve moda meraklısı kitleye yönelik dinamik ürün kataloğu reklamları, retargeting ve yeni müşteri kazanım kampanyaları. Google Shopping ve arama ağı yönetimi.\n\nSite Geliştirme: Mevcut Shopify temasının sürekli düzenlenmesi, sezonsal kampanya sayfaları, dönüşüm optimizasyonu (CRO) ve mobil deneyim iyileştirmeleri.\n\nLüks bir markanın hak ettiği premium dijital deneyimi koruyarak satış performansını büyütüyoruz.",
    body_en: "We work on two fronts for Nakablu:\n\nAds: Dynamic product catalogue ads, retargeting, and new customer acquisition campaigns via Meta Ads (Instagram & Facebook) targeting jewelry and fashion enthusiasts. Google Shopping and search network management.\n\nSite Development: Ongoing refinement of the existing Shopify theme, seasonal campaign pages, conversion rate optimization (CRO), and mobile experience improvements.\n\nWe grow sales performance while preserving the premium digital experience a luxury brand deserves.",
  },
  { type: "single_image", url: urls.s4, ratio: "16:9" },
  {
    type: "text_block",
    label: "Hizmet Özeti",
    title_tr: "Hizmet Kapsamı",
    title_en: "Scope of Services",
    body_tr: "\nPlatform: Shopify\n\nReklam: Meta Ads, Google Shopping & Arama Ağı\n\nWeb: Sürekli tema düzenleme & CRO\n\nAnalitik: Meta Pixel, Google Analytics 4\n\nOptimizasyon: Mobil deneyim, sezonsal kampanya sayfaları\n\nEk: Stil danışmanlığı & hediye akışı entegrasyonu",
    body_en: "\nPlatform: Shopify\n\nAds: Meta Ads, Google Shopping & Search Network\n\nWeb: Ongoing theme editing & CRO\n\nAnalytics: Meta Pixel, Google Analytics 4\n\nOptimization: Mobile experience, seasonal campaign pages\n\nExtra: Styling appointment & gift flow integration",
  },
];

const docRef = await addDoc(collection(db, "projects"), {
  title: "Nakablu",
  brandName: "Nakablu",
  slug: "nakablu",
  description_tr: "\"Made for Moments\" sloganıyla tasarımcı takı sunan lüks e-ticaret markası Nakablu için reklam hizmetleri ve sürekli web sitesi geliştirme/düzenleme çalışmaları yürütüyoruz. Shopify altyapısı üzerinde Meta Ads ve Google Shopping kampanyaları, dönüşüm optimizasyonu ve premium alışveriş deneyimi iyileştirmeleriyle markanın satışlarını büyütüyoruz.",
  description_en: "For Nakablu, a luxury e-commerce jewelry brand with the slogan \"Made for Moments,\" we provide advertising services and ongoing website development/refinement. On the Shopify platform, we grow the brand's sales through Meta Ads and Google Shopping campaigns, conversion optimization, and premium shopping experience improvements.",
  industry_tr: "Takı & E-Ticaret",
  industry_en: "Jewelry & E-Commerce",
  timeline: "",
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  year: "2024",
  category: "Digital Ads & E-Commerce",
  tags: ["Shopify", "Meta Ads", "Google Ads", "CRO", "Jewelry"],
  link: "https://nakablu.com",
  order: 8,
  featured: true,
  blocks,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log("✅ Nakablu eklendi:", docRef.id);
process.exit(0);
