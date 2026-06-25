import { chromium } from "playwright-core";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

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

async function uploadFile(filePath, storagePath) {
  const buffer = fs.readFileSync(filePath);
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, buffer, { contentType: "image/jpeg" });
  return getDownloadURL(storageRef);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const shots = [];

// 1. Ana sayfa — tam sayfa (kapak)
console.log("📸 Ana sayfa...");
await page.goto("https://macc-cino.com", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "scripts/shot_cover.jpg", fullPage: false, type: "jpeg", quality: 90 });
shots.push({ file: "scripts/shot_cover.jpg", label: "cover" });

// 2. Ana sayfa — tam scroll
await page.screenshot({ path: "scripts/shot_hero.jpg", fullPage: true, type: "jpeg", quality: 85 });
shots.push({ file: "scripts/shot_hero.jpg", label: "hero_full" });

// 3. Admin paneli (giriş sayfası)
console.log("📸 Admin paneli...");
await page.goto("https://macc-cino.com/admin", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "scripts/shot_admin_login.jpg", fullPage: false, type: "jpeg", quality: 90 });
shots.push({ file: "scripts/shot_admin_login.jpg", label: "admin_login" });

// 4. Admin giriş yap
try {
  await page.fill('input[type="text"], input[name="username"], input[placeholder*="kullanıcı"], input[placeholder*="user"]', "admin");
  await page.fill('input[type="password"]', "admin");
  await page.click('button[type="submit"], input[type="submit"]');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scripts/shot_admin_dashboard.jpg", fullPage: false, type: "jpeg", quality: 90 });
  shots.push({ file: "scripts/shot_admin_dashboard.jpg", label: "admin_dashboard" });

  // Admin tam sayfa
  await page.screenshot({ path: "scripts/shot_admin_full.jpg", fullPage: true, type: "jpeg", quality: 85 });
  shots.push({ file: "scripts/shot_admin_full.jpg", label: "admin_full" });
} catch (e) {
  console.log("Admin giriş yapılamadı:", e.message);
}

await browser.close();

// Firebase'e yükle
console.log("☁️  Firebase'e yükleniyor...");
const urls = {};
for (const shot of shots) {
  if (!fs.existsSync(shot.file)) continue;
  const ts = Date.now();
  const url = await uploadFile(shot.file, `projects/macc-cino-${shot.label}-${ts}.jpg`);
  urls[shot.label] = url;
  console.log(`✓ ${shot.label}: ${url.substring(0, 80)}...`);
}

// Firestore güncelle
const blocks = [
  {
    type: "single_image",
    url: urls["hero_full"] || urls["cover"] || "",
    ratio: "16:9",
  },
  {
    type: "text_block",
    label: "Web Sitesi",
    title_tr: "Kurumsal Kimliğe Uygun, Sade ve Güçlü Web Sitesi",
    title_en: "Clean and Powerful Website Aligned with Corporate Identity",
    body_tr: "Macc-cino, Ankara merkezli profesyonel kahve makineleri ve barista konsepti sunan bir B2B markasıdır. 25+ yıllık deneyim ve 500+ işletme referansıyla sektörün lider firması için;\n\nKurumsal kimliğe uygun minimal ve premium bir tasarım oluşturuldu. Restoran, otel, ofis, fitness merkezi ve benzeri sektörlere özel hizmet sayfaları kurgulandı. Mobil uyumlu, hızlı yüklenen ve SEO dostu bir altyapı inşa edildi.",
    body_en: "Macc-cino is an Ankara-based B2B brand offering professional coffee machines and barista concepts. With 25+ years of experience and 500+ business clients, we delivered:\n\nA minimal, premium design aligned with the corporate identity. Service pages tailored for restaurants, hotels, offices, fitness centers, and more. A mobile-friendly, fast-loading, SEO-optimized infrastructure.",
  },
  ...(urls["admin_dashboard"] || urls["admin_full"] ? [{
    type: "single_image",
    url: urls["admin_full"] || urls["admin_dashboard"] || "",
    ratio: "16:9",
  }] : []),
  {
    type: "text_block",
    label: "Admin Panel",
    title_tr: "Çok Dilli Özel Yönetim Paneli",
    title_en: "Multilingual Custom Admin Panel",
    body_tr: "Macc-cino ekibinin içerikleri kolayca yönetebilmesi için baştan sona özel bir admin paneli geliştirildi:\n\nÜrün Yönetimi: Espresso, Otomatik ve Vending kategorilerinde ürün ekleme/düzenleme.\nHero Slider: Ana sayfadaki slider içeriklerini görsel/video olarak yönetme.\nBlog & Trendler: Kahve sektörü haberleri ve trend içeriklerini yönetme.\nÇok Dilli Destek: Türkçe, İngilizce ve Almanca içerik girişi.\nMesajlar: İletişim formundan gelen mesajları panelde takip etme.\nSite Ayarları: Logo, renk ve section görünürlük kontrolü.",
    body_en: "A fully custom admin panel was built for the Macc-cino team:\n\nProduct Management: Add/edit products across Espresso, Automatic, and Vending categories.\nHero Slider: Manage homepage slider content with image/video uploads.\nBlog & Trends: Manage coffee industry news and trend content.\nMultilingual Support: Turkish, English, and German content entry.\nMessages: Track contact form submissions in the panel.\nSite Settings: Control logo, colors, and section visibility.",
  },
  ...(urls["admin_login"] ? [{
    type: "single_image",
    url: urls["admin_login"],
    ratio: "16:9",
  }] : []),
  {
    type: "text_block",
    label: "Stack",
    title_tr: "Teknik Stack Özeti",
    title_en: "Technical Stack Overview",
    body_tr: "\nFrontend: HTML5, CSS3, JavaScript (Vanilla)\n\nBackend & Database: Firebase (Firestore, Storage, Auth)\n\nAdmin Panel: Özel CRUD altyapısı\n\nDil Desteği: TR / EN / DE\n\nHosting: Firebase Hosting\n\nSEO: Semantic HTML, meta tags, Open Graph",
    body_en: "\nFrontend: HTML5, CSS3, JavaScript (Vanilla)\n\nBackend & Database: Firebase (Firestore, Storage, Auth)\n\nAdmin Panel: Custom CRUD infrastructure\n\nLanguage Support: TR / EN / DE\n\nHosting: Firebase Hosting\n\nSEO: Semantic HTML, meta tags, Open Graph",
  },
];

await updateDoc(doc(db, "projects", PROJECT_ID), {
  imageUrl: urls["cover"] || "",
  listingImageUrl: urls["cover"] || "",
  videoUrl: "",
  blocks,
  updatedAt: new Date().toISOString(),
});

console.log("✅ Proje güncellendi!");
process.exit(0);
