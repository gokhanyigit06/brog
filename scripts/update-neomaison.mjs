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
const PROJECT_ID = "sKHyiDunIwnOK1Ryty8b";

async function upload(file, name) {
  const buffer = fs.readFileSync(file);
  const r = ref(storage, `projects/neomaison-v2-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  console.log("✓", name);
  return url;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const mctx = await browser.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2 });
const mpage = await mctx.newPage();

const urls = {};

await page.goto("https://neomaison.com.tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3500);
// Popup / newsletter kapat
for (const sel of ["text=Kapat", "[aria-label*='close' i]", "[aria-label*='Kapat' i]", ".modal__close", ".klaviyo-close-form", "button[aria-label='Close dialog']"]) {
  try { await page.click(sel, { timeout: 1500 }); await page.waitForTimeout(400); break; } catch {}
}
await page.keyboard.press("Escape").catch(() => {});
await page.waitForTimeout(500);

// Lazy-load tetikle
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 180)); }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1500);

// Hero
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);
await page.screenshot({ path: "scripts/nmv_hero.jpg", type: "jpeg", quality: 92 });
urls.hero = await upload("scripts/nmv_hero.jpg", "hero");

// Bölüm offsetleri
const offsets = await page.evaluate(() => {
  const seen = new Set(); const res = [];
  document.querySelectorAll("section, div[class*='section'], main > div").forEach(el => {
    const top = Math.round(window.scrollY + el.getBoundingClientRect().top);
    const h = Math.round(el.getBoundingClientRect().height);
    if (h > 420 && top > 100 && !seen.has(top)) { seen.add(top); res.push(top); }
  });
  return res.sort((a, b) => a - b);
});

let idx = 2; const taken = new Set([0]);
for (const off of offsets) {
  if ([...taken].some(t => Math.abs(t - off) < 500)) continue;
  taken.add(off);
  await page.evaluate(y => window.scrollTo(0, y), off);
  await page.waitForTimeout(900);
  const f = `scripts/nmv_s${idx}.jpg`;
  await page.screenshot({ path: f, type: "jpeg", quality: 90 });
  urls[`s${idx}`] = await upload(f, `s${idx}`);
  idx++;
  if (idx > 6) break;
}

// Koleksiyon sayfası
for (const path of ["/collections/love-birds-1", "/collections/all", "/collections/royal-1"]) {
  try {
    await page.goto("https://neomaison.com.tr" + path, { waitUntil: "domcontentloaded", timeout: 40000 });
    await page.waitForTimeout(2500);
    await page.keyboard.press("Escape").catch(() => {});
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
    await page.screenshot({ path: "scripts/nmv_collection.jpg", type: "jpeg", quality: 90 });
    urls.collection = await upload("scripts/nmv_collection.jpg", "collection");
    break;
  } catch {}
}

// Mobil
await mpage.goto("https://neomaison.com.tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await mpage.waitForTimeout(3000);
await mpage.keyboard.press("Escape").catch(() => {});
await mpage.evaluate(() => window.scrollTo(0, 0));
await mpage.waitForTimeout(600);
await mpage.screenshot({ path: "scripts/nmv_m1.jpg", type: "jpeg", quality: 92 });
urls.m1 = await upload("scripts/nmv_m1.jpg", "m1");
await mpage.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
await mpage.waitForTimeout(800);
await mpage.screenshot({ path: "scripts/nmv_m2.jpg", type: "jpeg", quality: 90 });
urls.m2 = await upload("scripts/nmv_m2.jpg", "m2");

await browser.close();

const sKeys = Object.keys(urls).filter(k => /^s\d/.test(k));
const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "Yeniden Tasarım",
    title_tr: "Sektörüne Özel, Premium Editoryal Yeniden Tasarım",
    title_en: "",
    body_tr: "Neo Maison, dünyanın seçkin ev ve sofra markalarını (Pip Studio, Chiara Alessi, Ladenac Milano, Cristina Re, Pols Potten, Roses Atelier) Türkiye'ye taşıyan bir e-ticaret markasıdır. Markanın büyümesiyle birlikte siteyi baştan sona yeniden tasarladık.\n\nHazır şablon görünümünden uzaklaşıp; serif tipografi, sıcak krem paleti ve editoryal bölümlerden oluşan, markanın premium konumlandırmasına yakışan tamamen özel bir Shopify teması kurguladık. Her marka için ayrı hikâye anlatan hero'lar, koleksiyon vitrinleri ve 'çok sevilenler' bölümleriyle alışverişi bir dergi deneyimine dönüştürdük.",
    body_en: "",
  },
  ...(sKeys[0] ? [{ type: "single_image", url: urls[sKeys[0]], ratio: "16:9" }] : []),
  ...(sKeys[1] ? [{ type: "single_image", url: urls[sKeys[1]], ratio: "16:9" }] : []),
  {
    type: "text_block",
    label: "Marka Mimarisi",
    title_tr: "Marka & Koleksiyon Mimarisi",
    title_en: "",
    body_tr: "Onlarca koleksiyonu (Love Birds, Royal, Flower Festival, Amore, Capri, Romance ve daha fazlası) düzenli, gezinmesi kolay bir yapıya oturttuk. Her markanın kendi kimliğini koruyan ama Neo Maison çatısı altında bütünlük hisseden bir vitrin sistemi kurduk.\n\nÜrün sayfaları, koleksiyon filtreleri ve marka açılış sayfaları; hem estetik hem de dönüşüm odaklı olacak şekilde yeniden düzenlendi.",
    body_en: "",
  },
  ...(urls.collection ? [{ type: "single_image", url: urls.collection, ratio: "16:9" }] : []),
  ...(sKeys[2] ? [{ type: "single_image", url: urls[sKeys[2]], ratio: "16:9" }] : []),
  {
    type: "text_block",
    label: "Mobil",
    title_tr: "Mobil Öncelikli Alışveriş Deneyimi",
    title_en: "",
    body_tr: "Ev dekorasyonu alışverişinin büyük kısmı mobilde gerçekleşiyor. Yeni tasarımda mobil deneyimi merkeze alarak; hızlı yüklenen, tek elle gezilebilen ve satın almayı kolaylaştıran bir arayüz kurguladık.",
    body_en: "",
  },
  ...(urls.m1 ? [{ type: "single_image", url: urls.m1, ratio: "9:16" }] : []),
  ...(urls.m2 ? [{ type: "single_image", url: urls.m2, ratio: "9:16" }] : []),
  {
    type: "text_block",
    label: "Reklam & Büyüme",
    title_tr: "Reklam Yönetimi & Sürekli Büyüme",
    title_en: "",
    body_tr: "Yeni sitenin yanı sıra Neo Maison'ın dijital reklam ekosistemini de yönetiyoruz. Meta (Instagram & Facebook) ve Google Shopping kampanyalarıyla ürün kataloğu bazlı dinamik reklamlar, retargeting ve yeni müşteri kazanımı yürütüyoruz.\n\nYenilenen premium tasarım, reklamlardan gelen trafiğin dönüşüm oranını da belirgin şekilde artıran bir temel oluşturdu.",
    body_en: "",
  },
  ...(sKeys[3] ? [{ type: "single_image", url: urls[sKeys[3]], ratio: "16:9" }] : []),
  {
    type: "text_block",
    label: "Stack",
    title_tr: "Teknik & Hizmet Özeti",
    title_en: "",
    body_tr: "\nPlatform: Shopify\n\nTema: Markaya özel Liquid tema (editoryal, custom section'lar)\n\nTasarım: Serif tipografi, premium krem paleti, marka bazlı hero'lar\n\nReklam: Meta Ads, Google Shopping\n\nAnalitik: Meta Pixel, Google Analytics 4\n\nOptimizasyon: Mobil öncelikli UX, dönüşüm odaklı koleksiyon yapısı",
    body_en: "",
  },
];

async function withRetry(fn, tries = 5) {
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } catch (e) { console.log("dene", i + 1, "hata:", e.code || e.message); await new Promise(r => setTimeout(r, 2500)); }
  }
  throw new Error("güncelleme başarısız");
}

await withRetry(() => updateDoc(doc(db, "projects", PROJECT_ID), {
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  blocks,
  updatedAt: new Date().toISOString(),
}));

console.log("✅ Neo Maison güncellendi:", PROJECT_ID);
process.exit(0);
