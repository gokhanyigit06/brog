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
  const r = ref(storage, `projects/smmotors-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  console.log(`✓ ${name}`);
  return url;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const urls = {};

await page.goto("https://smmotorss.com", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
try { await page.click("text=Kabul", { timeout: 2500 }); await page.waitForTimeout(400); } catch {}
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
await page.screenshot({ path: "scripts/sm_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/sm_hero.jpg", "hero");

await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/sm_s2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s2 = await upload("scripts/sm_s2.jpg", "s2");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/sm_s3.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s3 = await upload("scripts/sm_s3.jpg", "s3");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/sm_s4.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s4 = await upload("scripts/sm_s4.jpg", "s4");

// ── Koleksiyon: Femex LED ──
await page.goto("https://smmotorss.com/collections/femex-led-ampul-serileri", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/sm_femex.jpg", fullPage: false, type: "jpeg", quality: 92 });
urls.femex = await upload("scripts/sm_femex.jpg", "koleksiyon-femex");

// ── Araç aydınlatma koleksiyonu ──
await page.goto("https://smmotorss.com/collections/arac-aydinlatma-urunleri%CC%87", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/sm_aydinlatma.jpg", fullPage: false, type: "jpeg", quality: 92 });
urls.aydinlatma = await upload("scripts/sm_aydinlatma.jpg", "koleksiyon-aydinlatma");

await browser.close();

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "Marka",
    title_tr: "Oto Aksesuar & Aydınlatmada Güçlü Bir Dijital Vitrin",
    title_en: "A Strong Digital Storefront for Auto Accessories & Lighting",
    body_tr: "SM Motors (Strong Motors), Ankara merkezli bir otomotiv aksesuar ve aydınlatma markasıdır. Femex LED ampul serileri (H7 Pro, GT Nano Pro), far ampulleri, modüller, çakar sistemleri, iç-dış aksesuar ve oto bakım ürünleri sunmaktadır.\n\nMarka aynı zamanda Trendyol, Hepsiburada, PTT AVM ve Pazarama gibi pazaryerlerinde de faaliyet göstermektedir. Kendi Shopify mağazasını güçlü ve performanslı bir satış kanalı haline getirdik.",
    body_en: "SM Motors (Strong Motors) is an Ankara-based automotive accessories and lighting brand. It offers Femex LED bulb series (H7 Pro, GT Nano Pro), headlight bulbs, modules, strobe systems, interior/exterior accessories, and car care products.\n\nThe brand also operates on marketplaces like Trendyol, Hepsiburada, PTT AVM, and Pazarama. We turned their own Shopify store into a powerful, high-performance sales channel.",
  },
  { type: "single_image", url: urls.s2, ratio: "16:9" },
  {
    type: "text_block",
    label: "Tema",
    title_tr: "Shopify Tema Özelleştirme & Tasarım",
    title_en: "Shopify Theme Customization & Design",
    body_tr: "SM Motors'un Shopify mağazasını markanın kimliğine uygun şekilde baştan sona özelleştirdik. Liquid tema üzerinde özel section'lar, kampanya bannerları, kategori vitrinleri ve ürün sayfası düzenlemeleri yaptık.\n\nMobil öncelikli, hızlı yüklenen ve dönüşüm odaklı bir arayüz kurguladık. '1000 TL üzeri ücretsiz kargo' ve indirim vurgularını satış akışına entegre ettik.",
    body_en: "We fully customized SM Motors' Shopify store to match the brand identity. We built custom sections on the Liquid theme, campaign banners, category showcases, and product page layouts.\n\nWe crafted a mobile-first, fast-loading, conversion-focused interface, integrating 'free shipping over 1000 TL' and discount highlights into the sales flow.",
  },
  { type: "single_image", url: urls.s3, ratio: "16:9" },
  { type: "single_image", url: urls.femex, ratio: "16:9" },
  {
    type: "text_block",
    label: "Reklam Yönetimi",
    title_tr: "Meta & Google Reklam Hizmetleri",
    title_en: "Meta & Google Advertising Services",
    body_tr: "Tema çalışmasının yanı sıra SM Motors'un dijital reklam ekosistemini de yönetiyoruz:\n\nMeta Ads (Instagram & Facebook): Araç sahibi ve modifiye meraklısı kitleye yönelik ürün kataloğu reklamları, retargeting ve yeni müşteri kazanım kampanyaları.\n\nGoogle Ads: LED ampul ve oto aksesuar aramalarına yönelik Shopping kampanyaları ve arama ağı yönetimi.\n\nROAS odaklı optimizasyon, A/B test ve kampanya bazlı raporlamayla sürekli büyüyen bir satış kanalı oluşturduk.",
    body_en: "Alongside the theme work, we also manage SM Motors' digital advertising ecosystem:\n\nMeta Ads (Instagram & Facebook): Product catalogue ads, retargeting, and new customer acquisition campaigns targeting car owners and modification enthusiasts.\n\nGoogle Ads: Shopping campaigns and search network management for LED bulb and auto accessory searches.\n\nWith ROAS-focused optimization, A/B testing, and campaign-level reporting, we built a continuously growing sales channel.",
  },
  { type: "single_image", url: urls.aydinlatma, ratio: "16:9" },
  { type: "single_image", url: urls.s4, ratio: "16:9" },
  {
    type: "text_block",
    label: "Stack",
    title_tr: "Teknik & Hizmet Özeti",
    title_en: "Technical & Service Overview",
    body_tr: "\nE-Ticaret Altyapısı: Shopify (Liquid tema özelleştirme)\n\nReklam: Meta Ads, Google Shopping & Arama Ağı\n\nPazaryeri: Trendyol, Hepsiburada, PTT AVM, Pazarama\n\nAnalitik: Meta Pixel, Google Analytics 4, dönüşüm takibi\n\nOptimizasyon: Mobile-first UX, A/B test, ROAS odaklı yönetim\n\nÖdeme: Visa, Mastercard, PayPal entegrasyonları",
    body_en: "\nE-Commerce Infrastructure: Shopify (Liquid theme customization)\n\nAds: Meta Ads, Google Shopping & Search Network\n\nMarketplaces: Trendyol, Hepsiburada, PTT AVM, Pazarama\n\nAnalytics: Meta Pixel, Google Analytics 4, conversion tracking\n\nOptimization: Mobile-first UX, A/B testing, ROAS-focused management\n\nPayment: Visa, Mastercard, PayPal integrations",
  },
];

const docRef = await addDoc(collection(db, "projects"), {
  title: "SM Motors",
  brandName: "SM Motors",
  slug: "sm-motors",
  description_tr: "Ankara merkezli otomotiv aksesuar ve aydınlatma markası SM Motors için Shopify tema özelleştirmesi yaptık ve dijital reklam yönetimini üstlendik. Femex LED ampul serileri ve oto aksesuar ürünleri için markaya özel Liquid tema, mobil öncelikli dönüşüm odaklı arayüz; Meta Ads ve Google Shopping kampanyalarıyla büyüyen bir satış kanalı oluşturduk.",
  description_en: "We customized the Shopify theme and managed digital advertising for SM Motors, an Ankara-based automotive accessories and lighting brand. We delivered a brand-tailored Liquid theme and a mobile-first, conversion-focused interface for Femex LED bulb series and auto accessories, plus a growing sales channel through Meta Ads and Google Shopping campaigns.",
  industry_tr: "Otomotiv & E-Ticaret",
  industry_en: "Automotive & E-Commerce",
  timeline: "",
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  year: "2024",
  category: "Shopify Theme & Digital Ads",
  tags: ["Shopify", "Theme Design", "Meta Ads", "Google Ads", "Automotive"],
  link: "https://smmotorss.com",
  order: 4,
  featured: true,
  blocks,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log("✅ SM Motors eklendi:", docRef.id);
process.exit(0);
