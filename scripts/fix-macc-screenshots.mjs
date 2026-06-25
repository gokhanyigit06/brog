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
const PROJECT_ID = "m24rMHba4wtmc556rh2Y";

async function upload(filePath, name) {
  const buffer = fs.readFileSync(filePath);
  const storageRef = ref(storage, `projects/macc-cino-${name}-${Date.now()}.jpg`);
  await uploadBytes(storageRef, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(storageRef);
  console.log(`✓ ${name}`);
  return url;
}

// Sayfadaki tüm section'ların top offsetlerini döndürür
async function getSectionOffsets(page) {
  return await page.evaluate(() => {
    const selectors = ["section", "div[class*='section']", "div[id]", "main > div", "main > section"];
    const seen = new Set();
    const results = [];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        const rect = el.getBoundingClientRect();
        const top = Math.round(window.scrollY + rect.top);
        const h = Math.round(rect.height);
        if (h > 300 && !seen.has(top)) {
          seen.add(top);
          results.push(top);
        }
      });
    }
    return results.sort((a, b) => a - b);
  });
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// ─── ANA SAYFA ───
await page.goto("https://macc-cino.com", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

// Cookie kapat
try { await page.click("text=Kabul Et", { timeout: 3000 }); await page.waitForTimeout(500); } catch {}

// Tüm lazy content'i tetikle
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 200));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1500);

const offsets = await getSectionOffsets(page);
console.log("Section offsetleri:", offsets);

const shots = [];

// 1. Hero — en tepeden
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/s1_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
shots.push({ file: "scripts/s1_hero.jpg", key: "hero" });

// Her bulduğu section başına git, screenshot çek
let shotIdx = 2;
const taken = new Set([0]);
for (const offset of offsets) {
  if (offset < 100) continue;
  if ([...taken].some(t => Math.abs(t - offset) < 400)) continue;
  taken.add(offset);
  await page.evaluate((y) => window.scrollTo(0, y), offset);
  await page.waitForTimeout(800);
  const file = `scripts/s${shotIdx}_section.jpg`;
  await page.screenshot({ path: file, fullPage: false, type: "jpeg", quality: 90 });
  shots.push({ file, key: `section${shotIdx}` });
  shotIdx++;
  if (shotIdx > 6) break;
}

// ─── ADMİN PANELİ ───
await page.goto("https://macc-cino.com/admin", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
try {
  await page.fill('input[type="text"], input[name="username"]', "admin");
  await page.fill('input[type="password"]', "admin");
  await page.click('button[type="submit"], input[type="submit"]');
  await page.waitForTimeout(3000);
} catch {}

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/s_admin1.jpg", fullPage: false, type: "jpeg", quality: 93 });
shots.push({ file: "scripts/s_admin1.jpg", key: "admin1" });

await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/s_admin2.jpg", fullPage: false, type: "jpeg", quality: 90 });
shots.push({ file: "scripts/s_admin2.jpg", key: "admin2" });

await browser.close();

// ─── UPLOAD ───
console.log("\n☁️  Yükleniyor...");
const urls = {};
for (const { file, key } of shots) {
  if (fs.existsSync(file)) urls[key] = await upload(file, key);
}

// ─── FIRESTORE ───
const sectionKeys = Object.keys(urls).filter(k => k.startsWith("section"));

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "Web Sitesi",
    title_tr: "Kurumsal Kimliğe Uygun, Premium Web Sitesi",
    title_en: "Premium Website Aligned with Corporate Identity",
    body_tr: "Macc-cino, Ankara merkezli profesyonel kahve makineleri ve barista konsepti sunan bir B2B markasıdır. 25+ yıllık deneyim ve 500+ işletme referansıyla sektörün lider firması için:\n\nKurumsal kimliğe uygun premium ve etkileyici bir tasarım oluşturuldu. Restoran, otel, ofis, fitness merkezi gibi sektörlere özel hizmet akışı kurgulandı. Türkçe, İngilizce ve Almanca çoklu dil desteği entegre edildi. Mobil uyumlu, hızlı yüklenen ve SEO dostu altyapı inşa edildi.",
    body_en: "Macc-cino is an Ankara-based B2B brand offering professional coffee machines and barista concepts. With 25+ years of experience and 500+ business clients:\n\nA premium design aligned with the corporate identity. Service flows tailored for restaurants, hotels, offices, fitness centers. Turkish, English, and German multilingual support. Mobile-friendly, fast-loading, SEO-optimized infrastructure.",
  },
  ...sectionKeys.slice(0, 2).map(k => ({ type: "single_image", url: urls[k], ratio: "16:9" })),
  {
    type: "text_block",
    label: "Admin Panel",
    title_tr: "Çok Dilli Özel Yönetim Paneli",
    title_en: "Multilingual Custom Admin Panel",
    body_tr: "Macc-cino ekibinin içerikleri kolayca yönetebilmesi için baştan sona özel bir admin paneli geliştirildi:\n\nÜrün Yönetimi: Espresso, Otomatik ve Vending kategorilerinde ürün ekleme/düzenleme.\nHero Slider: Görsel/video olarak slider içerikleri yönetme.\nBlog & Trendler: Kahve sektörü haberleri ve trend içerikleri.\nÇok Dilli Destek: TR / EN / DE içerik girişi.\nMesajlar: İletişim formundan gelen mesajlar.\nSite Ayarları: Logo, renk ve section görünürlük kontrolü.",
    body_en: "A fully custom admin panel was built from scratch:\n\nProduct Management: Espresso, Automatic, and Vending categories.\nHero Slider: Image/video slider management.\nBlog & Trends: Coffee industry news and trends.\nMultilingual: TR / EN / DE content.\nMessages: Contact form inbox.\nSite Settings: Logo, colors, section visibility.",
  },
  { type: "single_image", url: urls.admin1, ratio: "16:9" },
  { type: "single_image", url: urls.admin2, ratio: "16:9" },
  ...sectionKeys.slice(2).map(k => ({ type: "single_image", url: urls[k], ratio: "16:9" })),
  {
    type: "text_block",
    label: "Stack",
    title_tr: "Teknik Stack Özeti",
    title_en: "Technical Stack Overview",
    body_tr: "\nFrontend: HTML5, CSS3, JavaScript\n\nBackend & Database: Firebase (Firestore, Storage, Auth)\n\nAdmin Panel: Özel CRUD altyapısı\n\nDil Desteği: TR / EN / DE\n\nHosting: Firebase Hosting\n\nSEO: Semantic HTML, meta tags, Open Graph",
    body_en: "\nFrontend: HTML5, CSS3, JavaScript\n\nBackend & Database: Firebase (Firestore, Storage, Auth)\n\nAdmin Panel: Custom CRUD\n\nLanguage Support: TR / EN / DE\n\nHosting: Firebase Hosting\n\nSEO: Semantic HTML, meta tags, Open Graph",
  },
];

await updateDoc(doc(db, "projects", PROJECT_ID), {
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  blocks,
  updatedAt: new Date().toISOString(),
});

console.log("✅ Tamamlandı!");
process.exit(0);
