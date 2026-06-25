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
  const r = ref(storage, `projects/neoantique-${name}-${Date.now()}.jpg`);
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
await page.goto("https://www.neoantique.com", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
// Cookie / popup kapat dene
try { await page.click("text=Kabul", { timeout: 2500 }); await page.waitForTimeout(400); } catch {}
try { await page.click("[class*='close'], [class*='kapat'], .modal-close", { timeout: 2000 }); } catch {}

// Lazy load tetikle
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/na_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/na_hero.jpg", "hero");

await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/na_s2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s2 = await upload("scripts/na_s2.jpg", "s2");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/na_s3.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s3 = await upload("scripts/na_s3.jpg", "s3");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/na_s4.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s4 = await upload("scripts/na_s4.jpg", "s4");

// ── Kategori: Mekanik ──
await page.goto("https://www.neoantique.com/kategori/mekanik", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/na_mekanik.jpg", fullPage: false, type: "jpeg", quality: 92 });
urls.mekanik = await upload("scripts/na_mekanik.jpg", "kategori-mekanik");

// ── Ürün detay ──
try {
  await page.goto("https://www.neoantique.com/urun/erken-donem-facit-hesap-makinesi", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: "scripts/na_urun.jpg", fullPage: false, type: "jpeg", quality: 92 });
  urls.urun = await upload("scripts/na_urun.jpg", "urun-detay");
} catch (e) { console.log("Ürün sayfası:", e.message); }

await browser.close();

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "Marka",
    title_tr: "Antikanın Dijital Vitrini — Neo Antique",
    title_en: "The Digital Showcase of Antiques — Neo Antique",
    body_tr: "Neo Antique, 19. yüzyıl sonu ve 20. yüzyıl başına ait mekanik ve endüstriyel antikaları koleksiyonerlerle buluşturan İstanbul Sarıyer merkezli bir antika platformudur. Facit, Odhner, Brunsviga hesap makineleri; Singer ve Pfaff dikiş makineleri; antika daktilolar, teraziler, aydınlatmalar ve dekoratif parçalar koleksiyonun öne çıkanlarıdır.\n\nIdeaSoft e-ticaret altyapısı üzerine kurulu site, fiziksel showroom deneyimini dijitale taşıyor.",
    body_en: "Neo Antique is an Istanbul-based (Sarıyer) antique platform connecting collectors with mechanical and industrial antiques from the late 19th and early 20th centuries. Facit, Odhner, and Brunsviga calculating machines; Singer and Pfaff sewing machines; vintage typewriters, scales, lighting, and decorative pieces are collection highlights.\n\nBuilt on the IdeaSoft e-commerce infrastructure, the site brings the physical showroom experience online.",
  },
  { type: "single_image", url: urls.s2, ratio: "16:9" },
  { type: "single_image", url: urls.s3, ratio: "16:9" },
  {
    type: "text_block",
    label: "Reklam Yönetimi",
    title_tr: "Meta & Google Reklam Hizmetleri",
    title_en: "Meta & Google Advertising Services",
    body_tr: "Neo Antique için niş bir koleksiyoner kitlesine hitap eden hedefli dijital reklam kampanyaları yönetiyoruz:\n\nMeta Ads (Instagram & Facebook): Antika ve koleksiyon meraklılarına yönelik ilgi alanı bazlı kampanyalar, ürün kataloğu reklamları ve retargeting.\n\nGoogle Ads: Yüksek niyetli arama trafiği için arama ağı, antika ürün adlarına özel anahtar kelime stratejisi ve Shopping kampanyaları.\n\nİçerik üretimi, görsel yönetimi ve sürekli optimizasyonla markanın dijital görünürlüğünü ve satışlarını artırıyoruz.",
    body_en: "We manage targeted digital ad campaigns for Neo Antique, reaching a niche collector audience:\n\nMeta Ads (Instagram & Facebook): Interest-based campaigns for antique and collection enthusiasts, product catalogue ads, and retargeting.\n\nGoogle Ads: Search network for high-intent traffic, keyword strategy tailored to antique product names, and Shopping campaigns.\n\nWith content production, creative management, and continuous optimization, we grow the brand's digital visibility and sales.",
  },
  { type: "single_image", url: urls.mekanik, ratio: "16:9" },
  ...(urls.urun ? [{ type: "single_image", url: urls.urun, ratio: "16:9" }] : []),
  { type: "single_image", url: urls.s4, ratio: "16:9" },
  {
    type: "text_block",
    label: "Hizmet Özeti",
    title_tr: "Hizmet Kapsamı",
    title_en: "Scope of Services",
    body_tr: "\nReklam: Meta Ads, Google Ads & Shopping\n\nHedefleme: Niş koleksiyoner kitlesi, ilgi alanı segmentasyonu\n\nİçerik: Reklam görselleri ve metin üretimi\n\nAnalitik: Meta Pixel, Google Analytics 4, dönüşüm takibi\n\nOptimizasyon: A/B test, ROAS odaklı sürekli iyileştirme\n\nPlatform: IdeaSoft e-ticaret altyapısı",
    body_en: "\nAds: Meta Ads, Google Ads & Shopping\n\nTargeting: Niche collector audience, interest-based segmentation\n\nContent: Ad creative and copy production\n\nAnalytics: Meta Pixel, Google Analytics 4, conversion tracking\n\nOptimization: A/B testing, ROAS-focused continuous improvement\n\nPlatform: IdeaSoft e-commerce infrastructure",
  },
];

const docRef = await addDoc(collection(db, "projects"), {
  title: "Neo Antique",
  brandName: "Neo Antique",
  slug: "neo-antique",
  description_tr: "19. ve 20. yüzyıl mekanik antikalarını koleksiyonerlerle buluşturan İstanbul merkezli Neo Antique için dijital reklam hizmetleri sunuyoruz. Niş koleksiyoner kitlesine yönelik Meta Ads ve Google Ads kampanyaları, ürün kataloğu reklamları ve hedefli içerik stratejisiyle markanın dijital görünürlüğünü ve satışlarını büyütüyoruz.",
  description_en: "We provide digital advertising services for Neo Antique, an Istanbul-based platform connecting collectors with 19th and 20th-century mechanical antiques. Through Meta Ads and Google Ads campaigns targeting a niche collector audience, product catalogue ads, and targeted content strategy, we grow the brand's digital visibility and sales.",
  industry_tr: "Antika & E-Ticaret",
  industry_en: "Antiques & E-Commerce",
  timeline: "",
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  year: "2024",
  category: "Digital Ads",
  tags: ["Meta Ads", "Google Ads", "E-Commerce", "Antiques", "IdeaSoft"],
  link: "https://www.neoantique.com",
  order: 3,
  featured: true,
  blocks,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log("✅ Neo Antique eklendi:", docRef.id);
process.exit(0);
