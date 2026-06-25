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
  const r = ref(storage, `projects/erguenerji-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  console.log(`✓ ${name}`);
  return url;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const urls = {};

await page.goto("https://erguenerji.com", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
try { await page.click("text=Kabul", { timeout: 2500 }); await page.waitForTimeout(400); } catch {}
try { await page.click("[class*='close'], .cookie-close, #close", { timeout: 2000 }); } catch {}

await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/eg_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/eg_hero.jpg", "hero");

await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/eg_s2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s2 = await upload("scripts/eg_s2.jpg", "s2");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/eg_s3.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s3 = await upload("scripts/eg_s3.jpg", "s3");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/eg_s4.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s4 = await upload("scripts/eg_s4.jpg", "s4");

// ── Ürünler sayfası ──
try {
  await page.goto("https://erguenerji.com/?page_id=9761", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: "scripts/eg_urunler.jpg", fullPage: false, type: "jpeg", quality: 92 });
  urls.urunler = await upload("scripts/eg_urunler.jpg", "urunler");
} catch (e) { console.log("Ürünler:", e.message); }

// ── Projeler sayfası ──
try {
  await page.goto("https://erguenerji.com/?page_id=11841", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: "scripts/eg_projeler.jpg", fullPage: false, type: "jpeg", quality: 92 });
  urls.projeler = await upload("scripts/eg_projeler.jpg", "projeler");
} catch (e) { console.log("Projeler:", e.message); }

await browser.close();

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "Web Sitesi",
    title_tr: "Enerji Sektörüne Kurumsal WordPress Platformu",
    title_en: "Corporate WordPress Platform for the Energy Sector",
    body_tr: "Ergu Enerji, 2018'den bu yana elektrik altyapı ve üstyapı çözümleri sunan Ankara merkezli bir enerji firmasıdır. Enerji dağıtım, petrol-gaz, endüstriyel fabrikalar, GES projeleri, biokütle santralleri ve su tesisleri gibi alanlarda hizmet vermektedir.\n\nMüşterinin talebi doğrultusunda, kolay yönetilebilir bir WordPress altyapısı üzerine kurumsal bir web sitesi kurduk. WPML ile çok dilli (Türkçe/İngilizce) yapı, ürün kataloğu, proje galerisi ve e-katalog bölümleriyle firmanın teknik gücünü dijitale taşıdık.",
    body_en: "Ergu Enerji is an Ankara-based energy company providing electrical infrastructure and superstructure solutions since 2018. It serves areas such as energy distribution, oil & gas, industrial plants, solar power (GES) projects, biomass plants, and water facilities.\n\nPer the client's request, we built a corporate website on an easily manageable WordPress infrastructure. With WPML multilingual support (Turkish/English), a product catalogue, project gallery, and e-catalogue sections, we brought the company's technical strength online.",
  },
  { type: "single_image", url: urls.s2, ratio: "16:9" },
  { type: "single_image", url: urls.s3, ratio: "16:9" },
  ...(urls.urunler ? [{ type: "single_image", url: urls.urunler, ratio: "16:9" }] : []),
  {
    type: "text_block",
    label: "Kapsam",
    title_tr: "Çok Dilli, Kataloglu ve Kolay Yönetilebilir",
    title_en: "Multilingual, Catalogued, and Easy to Manage",
    body_tr: "Çok Dilli (WPML): Türkçe ve İngilizce tam site desteği.\nÜrün Kataloğu: Transformatörler, AG dağıtım sistemleri, elektrik panelleri, araç şarj istasyonları, jeneratörler, UPS ve daha fazlası — 15+ kategori.\nEndüstri Sayfaları: GES, biokütle, enerji dağıtım, petrol-gaz, su tesisleri için ayrı çözüm sayfaları.\nProje Galerisi & E-Katalog: Referans projeler ve indirilebilir katalog.\nKolay Yönetim: WordPress paneliyle firmanın kendi içeriğini güncelleyebildiği esnek altyapı.",
    body_en: "Multilingual (WPML): Full site support in Turkish and English.\nProduct Catalogue: Transformers, LV distribution systems, electrical panels, EV charging stations, generators, UPS, and more — 15+ categories.\nIndustry Pages: Dedicated solution pages for solar, biomass, energy distribution, oil & gas, water facilities.\nProject Gallery & E-Catalogue: Reference projects and a downloadable catalogue.\nEasy Management: A flexible WordPress backend letting the company update its own content.",
  },
  ...(urls.projeler ? [{ type: "single_image", url: urls.projeler, ratio: "16:9" }] : []),
  { type: "single_image", url: urls.s4, ratio: "16:9" },
  {
    type: "text_block",
    label: "Reklam Yönetimi",
    title_tr: "B2B Dijital Reklam & Görünürlük",
    title_en: "B2B Digital Advertising & Visibility",
    body_tr: "Web sitesinin yanı sıra Ergu Enerji için B2B odaklı dijital reklam hizmetleri de veriyoruz. Enerji ve sanayi sektöründeki karar vericilere ulaşmak için:\n\nGoogle Ads: Sektörel anahtar kelime ve arama ağı kampanyaları, ürün bazlı hedefleme.\n\nLinkedIn & Meta: Kurumsal görünürlük ve proje tanıtımı için B2B kampanyalar.\n\nSEO altyapısı ve teknik içerik optimizasyonuyla firmanın nitelikli teklif taleplerini (lead) artırıyoruz.",
    body_en: "Alongside the website, we also provide B2B-focused digital advertising services for Ergu Enerji. To reach decision-makers in the energy and industrial sectors:\n\nGoogle Ads: Industry keyword and search network campaigns, product-based targeting.\n\nLinkedIn & Meta: B2B campaigns for corporate visibility and project promotion.\n\nWith SEO infrastructure and technical content optimization, we increase the company's qualified quote requests (leads).",
  },
  {
    type: "text_block",
    label: "Stack",
    title_tr: "Teknik & Hizmet Özeti",
    title_en: "Technical & Service Overview",
    body_tr: "\nCMS: WordPress\n\nÇoklu Dil: WPML (TR / EN)\n\nİçerik: Ürün kataloğu, proje galerisi, e-katalog, endüstri sayfaları\n\nReklam: Google Ads, LinkedIn & Meta (B2B)\n\nSEO: Teknik içerik optimizasyonu, lead odaklı yapı\n\nYönetim: Müşterinin kendi güncelleyebildiği panel",
    body_en: "\nCMS: WordPress\n\nMultilingual: WPML (TR / EN)\n\nContent: Product catalogue, project gallery, e-catalogue, industry pages\n\nAds: Google Ads, LinkedIn & Meta (B2B)\n\nSEO: Technical content optimization, lead-focused structure\n\nManagement: A self-updatable backend for the client",
  },
];

const docRef = await addDoc(collection(db, "projects"), {
  title: "Ergu Enerji",
  brandName: "Ergu Enerji",
  slug: "ergu-enerji",
  description_tr: "Elektrik altyapı ve enerji çözümleri sunan Ankara merkezli Ergu Enerji için, müşteri talebi doğrultusunda WordPress altyapısında çok dilli kurumsal bir web sitesi kurduk ve B2B dijital reklam hizmetleri sunuyoruz. WPML çoklu dil, ürün kataloğu, proje galerisi ve e-katalog ile firmanın teknik gücünü dijitale taşıdık; Google Ads ve LinkedIn kampanyalarıyla nitelikli lead'ler kazandırıyoruz.",
  description_en: "For Ergu Enerji, an Ankara-based provider of electrical infrastructure and energy solutions, we built a multilingual corporate website on WordPress per the client's request and provide B2B digital advertising services. With WPML multilingual support, a product catalogue, project gallery, and e-catalogue, we brought the company's technical strength online and generate qualified leads through Google Ads and LinkedIn campaigns.",
  industry_tr: "Enerji & Elektrik",
  industry_en: "Energy & Electrical",
  timeline: "",
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  year: "2024",
  category: "WordPress & Digital Ads",
  tags: ["WordPress", "WPML", "Google Ads", "B2B", "Energy"],
  link: "https://erguenerji.com",
  order: 6,
  featured: true,
  blocks,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log("✅ Ergu Enerji eklendi:", docRef.id);
process.exit(0);
