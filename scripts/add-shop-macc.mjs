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
  const r = ref(storage, `projects/shop-macc-cino-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  console.log(`✓ ${name}`);
  return url;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto("https://shop.macc-cino.com", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

// Lazy load tetikle
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1500);

const urls = {};

// 1. Hero
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/shop_s1_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/shop_s1_hero.jpg", "hero");

// Section offset'leri bul
const offsets = await page.evaluate(() => {
  const seen = new Set();
  const results = [];
  document.querySelectorAll("section, main > div, main > section").forEach(el => {
    const top = Math.round(window.scrollY + el.getBoundingClientRect().top);
    const h = Math.round(el.getBoundingClientRect().height);
    if (h > 300 && !seen.has(top) && top > 100) {
      seen.add(top);
      results.push(top);
    }
  });
  return results.sort((a, b) => a - b);
});

console.log("Section offsetleri:", offsets);

let idx = 2;
const taken = new Set([0]);
for (const offset of offsets) {
  if ([...taken].some(t => Math.abs(t - offset) < 500)) continue;
  taken.add(offset);
  await page.evaluate(y => window.scrollTo(0, y), offset);
  await page.waitForTimeout(800);
  const file = `scripts/shop_s${idx}.jpg`;
  await page.screenshot({ path: file, fullPage: false, type: "jpeg", quality: 90 });
  urls[`section${idx}`] = await upload(file, `section${idx}`);
  idx++;
  if (idx > 7) break;
}

// Matcha ürün sayfasına git
try {
  await page.goto("https://shop.macc-cino.com/matcha", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: "scripts/shop_matcha1.jpg", fullPage: false, type: "jpeg", quality: 93 });
  urls.matcha1 = await upload("scripts/shop_matcha1.jpg", "matcha1");

  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scripts/shop_matcha2.jpg", fullPage: false, type: "jpeg", quality: 90 });
  urls.matcha2 = await upload("scripts/shop_matcha2.jpg", "matcha2");
} catch (e) { console.log("Matcha sayfası:", e.message); }

// Ürün detay sayfası
try {
  const links = await page.$$eval("a[href*='matcha'], a[href*='urun'], a[href*='product']", els =>
    els.map(e => e.href).filter(h => h.includes("shop.macc-cino")).slice(0, 1)
  );
  if (links[0]) {
    await page.goto(links[0], { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "scripts/shop_product.jpg", fullPage: false, type: "jpeg", quality: 92 });
    urls.product = await upload("scripts/shop_product.jpg", "product");
  }
} catch {}

await browser.close();

const sectionKeys = Object.keys(urls).filter(k => k.startsWith("section"));

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "E-Ticaret",
    title_tr: "Macc-cino Kahve Ekosistemine Entegre Shop Altyapısı",
    title_en: "Shop Infrastructure Integrated into the Macc-cino Coffee Ecosystem",
    body_tr: "shop.macc-cino.com, macc-cino.com'un ana kurumsal sitesine entegre çalışan bağımsız bir e-ticaret platformudur. Sitenin öne çıkan kategorisi, Almanya'dan getirtilen ceremonial grade matcha konsantreleridir.\n\nPlatform; 250ml, 500ml ve 1000ml (pompalı dahil) seçenekleriyle profesyonel kullanıma yönelik standartlaştırılmış ürünler sunmaktadır. Karıştırma gerektirmez, ekipman ihtiyacı yoktur, mükemmel dozaj ve topaklanmama garantisiyle B2B kullanıcılara hitap etmektedir.",
    body_en: "shop.macc-cino.com is a standalone e-commerce platform operating as part of the macc-cino.com ecosystem. Its flagship category is ceremonial grade matcha concentrate sourced from Germany.\n\nThe platform offers 250ml, 500ml, and 1000ml (including pump) options for professional use — no mixing required, no equipment needed, perfect dosage, zero clumping.",
  },
  ...sectionKeys.slice(0, 2).map(k => ({ type: "single_image", url: urls[k], ratio: "16:9" })),
  {
    type: "text_block",
    label: "Matcha",
    title_tr: "Öne Çıkan Kategori: Ceremonial Grade Matcha Konsantresi",
    title_en: "Featured Category: Ceremonial Grade Matcha Concentrate",
    body_tr: "Sitedeki matcha kategorisi, özellikle kafe ve restoran işletmecilerine yönelik tasarlandı. Almanya üretimi sertifikalı ceremonial grade matcha konsantresi; hazır ve standart formülüyle her bardakta aynı kaliteyi sunar.\n\nÖzellikler:\n– Karıştırma gerektirmez\n– Ekipman ihtiyacı yok\n– Mükemmel ve sabit dozaj\n– Topaklanmaz\n– Ekonomik ve ölçeklenebilir\n– White label sipariş seçeneği",
    body_en: "The matcha category is designed specifically for café and restaurant operators. The German-certified ceremonial grade matcha concentrate delivers consistent quality in every cup — ready to use, no whisking, no equipment.\n\nFeatures:\n– No mixing required\n– No equipment needed\n– Perfect, consistent dosage\n– Zero clumping\n– Economical and scalable\n– White label ordering available",
  },
  ...(urls.matcha1 ? [{ type: "single_image", url: urls.matcha1, ratio: "16:9" }] : []),
  ...(urls.matcha2 ? [{ type: "single_image", url: urls.matcha2, ratio: "16:9" }] : []),
  ...(urls.product ? [{ type: "single_image", url: urls.product, ratio: "16:9" }] : []),
  ...sectionKeys.slice(2).map(k => ({ type: "single_image", url: urls[k], ratio: "16:9" })),
  {
    type: "text_block",
    label: "Stack",
    title_tr: "Teknik Stack Özeti",
    title_en: "Technical Stack Overview",
    body_tr: "\nFrontend: Next.js (App Router), Tailwind CSS\n\nGörsel Optimizasyonu: Next.js Image Optimization\n\nDil Desteği: TR / EN\n\nAltyapı: Bağımsız subdomain (shop.macc-cino.com)\n\nSEO: Semantic HTML, meta tags, Open Graph\n\nEkosistem: macc-cino.com ana sitesiyle entegre çalışır",
    body_en: "\nFrontend: Next.js (App Router), Tailwind CSS\n\nImage Optimization: Next.js Image Optimization\n\nLanguage Support: TR / EN\n\nInfrastructure: Independent subdomain (shop.macc-cino.com)\n\nSEO: Semantic HTML, meta tags, Open Graph\n\nEcosystem: Runs integrated with macc-cino.com main site",
  },
];

const docRef = await addDoc(collection(db, "projects"), {
  title: "Macc-cino Shop",
  brandName: "Macc-cino Shop",
  slug: "macc-cino-shop",
  description_tr: "macc-cino.com ekosistemiyle entegre çalışan bağımsız e-ticaret platformu. Almanya'dan getirtilen ceremonial grade matcha konsantresi başta olmak üzere profesyonel kahve ürünleri sunan Next.js tabanlı shop sitesi. TR/EN çoklu dil desteği ve B2B odaklı ürün altyapısıyla donatıldı.",
  description_en: "Standalone e-commerce platform integrated with the macc-cino.com ecosystem. A Next.js-based shop site offering professional coffee products, headlined by German-certified ceremonial grade matcha concentrate. Built with TR/EN multilingual support and B2B-focused product infrastructure.",
  industry_tr: "Yiyecek & İçecek",
  industry_en: "Food & Beverage",
  timeline: "",
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  year: "2024",
  category: "E-Commerce",
  tags: ["Next.js", "E-Commerce", "Matcha", "Coffee", "Multilingual"],
  link: "https://shop.macc-cino.com",
  order: 1,
  featured: true,
  blocks,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log("✅ Proje eklendi:", docRef.id);
process.exit(0);
