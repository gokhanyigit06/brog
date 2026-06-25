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
  const r = ref(storage, `projects/neomaison-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  console.log(`✓ ${name}`);
  return url;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const urls = {};

// ── Ana sayfa ──
await page.goto("http://neomaison.com.tr", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

// Lazy load tetikle
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

// 1. Hero
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/nm_s1_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/nm_s1_hero.jpg", "hero");

// 2. Section 2
await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/nm_s2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s2 = await upload("scripts/nm_s2.jpg", "s2");

// 3. Section 3
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/nm_s3.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s3 = await upload("scripts/nm_s3.jpg", "s3");

// 4. Section 4
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/nm_s4.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s4 = await upload("scripts/nm_s4.jpg", "s4");

// ── Koleksiyon sayfası: Pip Studio ──
await page.goto("http://neomaison.com.tr/collections/pip-studio", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/nm_pip.jpg", fullPage: false, type: "jpeg", quality: 92 });
urls.pip = await upload("scripts/nm_pip.jpg", "pip-studio");

// ── Koleksiyon: Yeni Gelenler ──
await page.goto("http://neomaison.com.tr/collections/yeni-gelenler", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/nm_new.jpg", fullPage: false, type: "jpeg", quality: 92 });
urls.new = await upload("scripts/nm_new.jpg", "yeni-gelenler");

// ── Hakkımızda ──
await page.goto("http://neomaison.com.tr/pages/hakkimizda", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/nm_about.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.about = await upload("scripts/nm_about.jpg", "hakkimizda");

await browser.close();

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "E-Ticaret",
    title_tr: "Ulaşılabilir Lüksün Tek Adresi — Shopify E-Ticaret",
    title_en: "The Only Address for Accessible Luxury — Shopify E-Commerce",
    body_tr: "Neo Maison, ev dekorasyon ve sofra ürünlerinde premium Avrupa markalarını Türk tüketicisiyle buluşturan bir e-ticaret platformudur. Shopify altyapısı üzerine kurulu olan platform; Pip Studio, Chiara Alessi, Ladenac Milano, Cristina Re ve Pols Potten gibi dünyaca tanınan markaların Türkiye distribütörüdür.\n\nUlusal kargo entegrasyonu, SSL güvenlikli ödeme sistemi, 14 gün koşulsuz iade ve 7/24 müşteri desteği standart altyapı olarak sunulmaktadır.",
    body_en: "Neo Maison is an e-commerce platform connecting premium European home décor and tableware brands with Turkish consumers. Built on Shopify, the platform is the Turkish distributor for globally recognized brands including Pip Studio, Chiara Alessi, Ladenac Milano, Cristina Re, and Pols Potten.\n\nNationwide shipping integration, SSL-secured payment, unconditional 14-day returns, and 24/7 customer support are standard.",
  },
  { type: "single_image", url: urls.s2, ratio: "16:9" },
  { type: "single_image", url: urls.s3, ratio: "16:9" },
  {
    type: "text_block",
    label: "Markalar",
    title_tr: "Premium Avrupa Markaları — Koleksiyon Yönetimi",
    title_en: "Premium European Brands — Collection Management",
    body_tr: "Platform, her biri farklı bir tasarım diline sahip beş ana marka koleksiyonunu barındırmaktadır:\n\nPip Studio — Hollanda'nın ikonik desenli sofra ve ev tekstili markası.\nChiara Alessi — İtalyan tasarımcının Amore, Capri, Romance koleksiyonları.\nLadenac Milano — İtalyan premium sofra ve aksesuar markası.\nCristina Re — Avustralya'nın şık çay ve kahve servis koleksiyonu.\nPols Potten — Hollanda'nın yaratıcı ev dekor markası.",
    body_en: "The platform hosts five major brand collections, each with a distinct design language:\n\nPip Studio — The iconic Dutch patterned tableware and home textile brand.\nChiara Alessi — Italian designer's Amore, Capri, Romance collections.\nLadenac Milano — Italian premium tableware and accessories brand.\nCristina Re — Australia's elegant tea and coffee service collection.\nPols Potten — The Netherlands' creative home décor brand.",
  },
  { type: "single_image", url: urls.pip, ratio: "16:9" },
  { type: "single_image", url: urls.new, ratio: "16:9" },
  {
    type: "text_block",
    label: "Reklam Yönetimi",
    title_tr: "Meta & Google Reklam Yönetimi",
    title_en: "Meta & Google Ads Management",
    body_tr: "Web sitesi geliştirmenin ötesinde Neo Maison'ın dijital reklam ekosistemini de yönetiyoruz. Marka için:\n\nMeta Ads (Facebook & Instagram): Ürün kataloğu bazlı dinamik reklamlar, retargeting kampanyaları ve yeni müşteri kazanım (prospecting) stratejileri.\n\nGoogle Ads: Shopping kampanyaları, arama ağı ve görüntülü reklam yönetimi.\n\nHedef kitle segmentasyonu, A/B test süreçleri ve ROAS optimizasyonuyla sürekli büyüyen bir dijital satış kanalı oluşturuldu.",
    body_en: "Beyond website development, we also manage Neo Maison's digital advertising ecosystem:\n\nMeta Ads (Facebook & Instagram): Dynamic product catalogue ads, retargeting campaigns, and new customer acquisition (prospecting) strategies.\n\nGoogle Ads: Shopping campaigns, search network, and display ad management.\n\nThrough audience segmentation, A/B testing, and ROAS optimization, a continuously growing digital sales channel was established.",
  },
  { type: "single_image", url: urls.s4, ratio: "16:9" },
  { type: "single_image", url: urls.about, ratio: "16:9" },
  {
    type: "text_block",
    label: "Stack",
    title_tr: "Teknik Stack Özeti",
    title_en: "Technical Stack Overview",
    body_tr: "\nE-Ticaret Altyapısı: Shopify\n\nÖdeme: SSL güvenlikli çoklu ödeme yöntemi\n\nKargo: Ulusal entegrasyon\n\nReklam: Meta Ads, Google Shopping\n\nAnalitik: Meta Pixel, Google Analytics 4\n\nSEO: Ürün bazlı meta etiketleri, Open Graph",
    body_en: "\nE-Commerce Infrastructure: Shopify\n\nPayment: SSL-secured multi-payment methods\n\nShipping: Nationwide integration\n\nAds: Meta Ads, Google Shopping\n\nAnalytics: Meta Pixel, Google Analytics 4\n\nSEO: Product-level meta tags, Open Graph",
  },
];

const docRef = await addDoc(collection(db, "projects"), {
  title: "Neo Maison",
  brandName: "Neo Maison",
  slug: "neo-maison",
  description_tr: "Ev dekorasyon ve sofra ürünlerinde premium Avrupa markalarını Türkiye'ye taşıyan Neo Maison için Shopify tabanlı e-ticaret platformu geliştirdik ve dijital reklam yönetimini üstlendik. Pip Studio, Chiara Alessi, Ladenac Milano gibi dünyaca tanınan markaların distribütörü olan firmaya Meta Ads ve Google Shopping kampanyalarıyla sürekli büyüyen bir dijital satış kanalı oluşturduk.",
  description_en: "We built a Shopify-based e-commerce platform for Neo Maison, the Turkish distributor of premium European home décor brands including Pip Studio, Chiara Alessi, and Ladenac Milano, and took over their digital ad management. Through Meta Ads and Google Shopping campaigns, we established a continuously growing digital sales channel.",
  industry_tr: "Ev Dekorasyon & E-Ticaret",
  industry_en: "Home Décor & E-Commerce",
  timeline: "",
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  year: "2024",
  category: "E-Commerce & Digital Ads",
  tags: ["Shopify", "E-Commerce", "Meta Ads", "Google Ads", "Home Décor"],
  link: "https://neomaison.com.tr",
  order: 2,
  featured: true,
  blocks,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log("✅ Neo Maison eklendi:", docRef.id);
process.exit(0);
