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
  const r = ref(storage, `projects/luiffart-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  console.log(`✓ ${name}`);
  return url;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const urls = {};

await page.goto("https://luiffart.com", { waitUntil: "networkidle" });
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
await page.screenshot({ path: "scripts/lf_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/lf_hero.jpg", "hero");

await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/lf_s2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s2 = await upload("scripts/lf_s2.jpg", "s2");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/lf_s3.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s3 = await upload("scripts/lf_s3.jpg", "s3");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/lf_s4.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s4 = await upload("scripts/lf_s4.jpg", "s4");

// Koleksiyon sayfası dene
for (const path of ["/collections/all", "/collections/posters", "/collections/styles"]) {
  try {
    await page.goto("https://luiffart.com" + path, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: "scripts/lf_collection.jpg", fullPage: false, type: "jpeg", quality: 92 });
    urls.collection = await upload("scripts/lf_collection.jpg", "collection");
    break;
  } catch {}
}

await browser.close();

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "Marka Kimliği",
    title_tr: "Sıfırdan Marka Kimliği ve Özel Web Tasarımı",
    title_en: "Brand Identity from Scratch & Custom Web Design",
    body_tr: "LuiffArt, müze kalitesinde çerçeveli poster ve duvar sanatı satan, küratörlü bir sanat e-ticaret markasıdır. \"Timeless Art Designed to Live Beautifully in Modern Homes\" vizyonuyla yola çıkan markanın tüm dijital varlığını biz inşa ettik.\n\nMarka kimliğinden başlayarak; logo, tipografi, renk paleti ve görsel dil oluşturuldu. Bunun üzerine markanın estetik çizgisini yansıtan, dönüşüm odaklı özel bir web sitesi tasarlandı. Ancient Whispers, Dark Academia, Botanical & Nature gibi temalı koleksiyonlar ve oda bazlı (yatak odası, oturma odası, ofis) kategorilerle zengin bir alışveriş deneyimi kurgulandı.",
    body_en: "LuiffArt is a curated art e-commerce brand selling museum-quality framed posters and wall art. We built the brand's entire digital presence, starting from its vision: \"Timeless Art Designed to Live Beautifully in Modern Homes.\"\n\nBeginning with brand identity — logo, typography, color palette, and visual language — we then designed a conversion-focused custom website reflecting the brand's aesthetic. We crafted a rich shopping experience with themed collections (Ancient Whispers, Dark Academia, Botanical & Nature) and room-based categories (bedroom, living room, office).",
  },
  { type: "single_image", url: urls.s2, ratio: "16:9" },
  { type: "single_image", url: urls.s3, ratio: "16:9" },
  ...(urls.collection ? [{ type: "single_image", url: urls.collection, ratio: "16:9" }] : []),
  {
    type: "text_block",
    label: "360° Medya",
    title_tr: "Uçtan Uca Dijital Ajans Hizmeti",
    title_en: "End-to-End Digital Agency Service",
    body_tr: "LuiffArt için tüm medya ve pazarlama operasyonunu tek elden yönetiyoruz:\n\nMarka & Kurumsal Kimlik: Logo, görsel dil, marka rehberi.\nWeb Tasarımı: Özel, dönüşüm odaklı e-ticaret sitesi.\nSEO: Teknik SEO, içerik stratejisi ve organik trafik büyütme.\nSosyal Medya: İçerik üretimi, topluluk yönetimi, kreatif tasarım.\nReklam: Meta Ads & Google Ads ile satış kampanyaları.\nMedya Prodüksiyon: Ürün görselleri, kampanya görselleri ve tüm dijital içerik.",
    body_en: "We manage LuiffArt's entire media and marketing operation under one roof:\n\nBrand & Corporate Identity: Logo, visual language, brand guidelines.\nWeb Design: A custom, conversion-focused e-commerce site.\nSEO: Technical SEO, content strategy, and organic traffic growth.\nSocial Media: Content production, community management, creative design.\nAds: Sales campaigns via Meta Ads & Google Ads.\nMedia Production: Product imagery, campaign visuals, and all digital content.",
  },
  { type: "single_image", url: urls.s4, ratio: "16:9" },
  {
    type: "text_block",
    label: "Hizmet Özeti",
    title_tr: "Hizmet Kapsamı",
    title_en: "Scope of Services",
    body_tr: "\nMarka Kimliği: Logo, tipografi, renk, görsel dil\n\nWeb: Özel e-ticaret tasarımı & geliştirme\n\nSEO: Teknik + içerik optimizasyonu\n\nSosyal Medya: İçerik & topluluk yönetimi\n\nReklam: Meta Ads, Google Ads\n\nMedya: Görsel prodüksiyon & kampanya kreatifleri",
    body_en: "\nBrand Identity: Logo, typography, color, visual language\n\nWeb: Custom e-commerce design & development\n\nSEO: Technical + content optimization\n\nSocial Media: Content & community management\n\nAds: Meta Ads, Google Ads\n\nMedia: Visual production & campaign creatives",
  },
];

const docRef = await addDoc(collection(db, "projects"), {
  title: "LuiffArt",
  brandName: "LuiffArt",
  slug: "luiffart",
  description_tr: "Müze kalitesinde çerçeveli poster ve duvar sanatı satan LuiffArt için marka kimliğinden web tasarımına, SEO'dan sosyal medyaya ve reklama kadar tüm dijital varlığı sıfırdan inşa ettik. Markanın 360° medya operasyonunu — kurumsal kimlik, özel e-ticaret sitesi, içerik üretimi, reklam yönetimi ve görsel prodüksiyon — tek elden yürütüyoruz.",
  description_en: "For LuiffArt, a curated brand selling museum-quality framed posters and wall art, we built the entire digital presence from scratch — brand identity, web design, SEO, social media, and advertising. We run the brand's full 360° media operation — corporate identity, custom e-commerce, content production, ad management, and visual production — under one roof.",
  industry_tr: "Sanat & E-Ticaret",
  industry_en: "Art & E-Commerce",
  timeline: "",
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  year: "2024",
  category: "Branding & Full Media",
  tags: ["Branding", "Web Design", "SEO", "Social Media", "Digital Ads"],
  link: "https://luiffart.com",
  order: 7,
  featured: true,
  blocks,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log("✅ LuiffArt eklendi:", docRef.id);
process.exit(0);
