import { chromium } from "playwright";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
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
const PROJECT_ID = "7Z2gUZxoXfBdPN4ih6Mq";

async function upload(filePath, name) {
  const buffer = fs.readFileSync(filePath);
  const r = ref(storage, `projects/shop-macc-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  console.log(`✓ ${name}`);
  return url;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const urls = {};

// ── Ana sayfa scroll section'ları ──
await page.goto("https://shop.macc-cino.com/tr", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
// Lazy load tetikle
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1000);

// Hero
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({ path: "scripts/sh1_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/sh1_hero.jpg", "hero");

// Section 2
await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/sh2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s2 = await upload("scripts/sh2.jpg", "s2");

// Section 3
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/sh3.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s3 = await upload("scripts/sh3.jpg", "s3");

// ── Matcha kategori ──
await page.goto("https://shop.macc-cino.com/tr/kategori/matcha", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/sh_matcha.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.matcha = await upload("scripts/sh_matcha.jpg", "matcha");

await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/sh_matcha2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.matcha2 = await upload("scripts/sh_matcha2.jpg", "matcha2");

// ── Ürün detay: 1000ml ──
await page.goto("https://shop.macc-cino.com/tr/urunler/matcha-konsantre-1000ml", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/sh_product.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.product = await upload("scripts/sh_product.jpg", "product");

// ── İletişim ──
await page.goto("https://shop.macc-cino.com/tr/iletisim", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/sh_contact.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.contact = await upload("scripts/sh_contact.jpg", "contact");

await browser.close();

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "E-Ticaret",
    title_tr: "Macc-cino Ekosistemiyle Entegre Shop Altyapısı",
    title_en: "Shop Infrastructure Integrated into the Macc-cino Ecosystem",
    body_tr: "shop.macc-cino.com, macc-cino.com'un ana kurumsal sitesine entegre çalışan bağımsız bir e-ticaret platformudur. Next.js (App Router) ile inşa edilen platform, TR/EN çift dil desteği ve tam responsive yapısıyla B2B kahve işletmelerine hitap etmektedir.\n\nSitede ürün kataloğu, kategori filtreleme, ürün detay sayfaları ve toplu sipariş / white label iletişim formu bulunmaktadır.",
    body_en: "shop.macc-cino.com is a standalone e-commerce platform integrated with the macc-cino.com main corporate site. Built with Next.js (App Router), the platform supports TR/EN bilingual content and fully responsive design, targeting B2B coffee businesses.\n\nThe site features a product catalogue, category filtering, product detail pages, and a bulk order / white label contact form.",
  },
  { type: "single_image", url: urls.s2, ratio: "16:9" },
  { type: "single_image", url: urls.s3, ratio: "16:9" },
  {
    type: "text_block",
    label: "Matcha",
    title_tr: "Öne Çıkan Kategori: Ceremonial Grade Matcha Konsantresi",
    title_en: "Featured Category: Ceremonial Grade Matcha Concentrate",
    body_tr: "Sitenin ana kategorisi, Almanya üretimi sertifikalı ceremonial grade matcha konsantresidir. Kafe ve restoran işletmecilerine yönelik tasarlanan ürün; 250ml, 500ml, 1000ml ve 1000ml pompalı seçenekleriyle sunulmaktadır.\n\nÖzellikler:\n– Karıştırma gerektirmez\n– Ekipman ihtiyacı yok\n– Mükemmel ve sabit dozaj\n– Topaklanmaz, barista gerektirmez\n– 100+ porsiyon / şişe · 4× daha hızlı · 12 ay raf ömrü\n– White label sipariş seçeneği",
    body_en: "The platform's flagship category is German-certified ceremonial grade matcha concentrate, designed for café and restaurant operators. Available in 250ml, 500ml, 1000ml, and 1000ml pump options.\n\nFeatures:\n– No mixing required\n– No equipment needed\n– Perfect, consistent dosage\n– Zero clumping, no barista needed\n– 100+ servings/bottle · 4× faster · 12-month shelf life\n– White label ordering available",
  },
  { type: "single_image", url: urls.matcha, ratio: "16:9" },
  { type: "single_image", url: urls.matcha2, ratio: "16:9" },
  { type: "single_image", url: urls.product, ratio: "16:9" },
  {
    type: "text_block",
    label: "Stack",
    title_tr: "Teknik Stack Özeti",
    title_en: "Technical Stack Overview",
    body_tr: "\nFrontend: Next.js (App Router), Tailwind CSS\n\nGörsel Optimizasyonu: Next.js Image Optimization\n\nDil Desteği: TR / EN\n\nURL Yapısı: /tr/kategori/:slug · /tr/urunler/:slug\n\nSEO: Semantic HTML, meta tags, Open Graph\n\nEkosistem: macc-cino.com ana sitesiyle entegre subdomain",
    body_en: "\nFrontend: Next.js (App Router), Tailwind CSS\n\nImage Optimization: Next.js Image Optimization\n\nLanguage Support: TR / EN\n\nURL Structure: /tr/kategori/:slug · /tr/urunler/:slug\n\nSEO: Semantic HTML, meta tags, Open Graph\n\nEcosystem: Integrated subdomain of macc-cino.com",
  },
  { type: "single_image", url: urls.contact, ratio: "16:9" },
];

await updateDoc(doc(db, "projects", PROJECT_ID), {
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  blocks,
  updatedAt: new Date().toISOString(),
});

console.log("✅ Güncellendi!");
process.exit(0);
