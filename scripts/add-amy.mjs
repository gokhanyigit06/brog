// Amy Kitchen & Cocktail (vogopos.com/amy) QR menü projesini ekler
// Mobil odaklı: telefon mockup'lı bloklar + özel tasarım / panel-Excel anlatımı
import { chromium } from "playwright";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const storage = getStorage(app);
const db = getFirestore(app);
async function withRetry(fn, t=8){for(let i=0;i<t;i++){try{return await fn()}catch(e){if(i===t-1)throw e;await new Promise(r=>setTimeout(r,2500))}}}

async function upload(filePath, name) {
  const buffer = fs.readFileSync(filePath);
  const r = ref(storage, `projects/amy-${name}-${Date.now()}.jpg`);
  await withRetry(() => uploadBytes(r, buffer, { contentType: "image/jpeg" }));
  const url = await withRetry(() => getDownloadURL(r));
  console.log(`✓ ${name}`);
  return url;
}

const browser = await chromium.launch();
const urls = {};

// ── Masaüstü kapak (BrowserMockup için) ──
const d = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await d.goto("https://vogopos.com/amy", { waitUntil: "domcontentloaded", timeout: 60000 });
await d.waitForTimeout(4000);
await d.screenshot({ path: "scripts/amy_hero.jpg", type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/amy_hero.jpg", "hero");

// ── Mobil görünümler (asıl kullanım) ──
const m = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true })).newPage();

// 1) Vitrin — kategori kartları
await m.goto("https://vogopos.com/amy", { waitUntil: "domcontentloaded", timeout: 60000 });
await m.waitForTimeout(4000);
await m.screenshot({ path: "scripts/amy_m1.jpg", type: "jpeg", quality: 92 });
urls.m1 = await upload("scripts/amy_m1.jpg", "mobile-vitrin");

// 2) Yemekler — ürün kartı (fotoğraf + kalori + alerjen + fiyat)
await m.locator("text=FOOD").first().click();
await m.waitForTimeout(3000);
await m.evaluate(() => window.scrollTo(0, 260));
await m.waitForTimeout(1200);
await m.screenshot({ path: "scripts/amy_m2.jpg", type: "jpeg", quality: 92 });
urls.m2 = await upload("scripts/amy_m2.jpg", "mobile-food");

// 3) Kokteyller
await m.goto("https://vogopos.com/amy", { waitUntil: "domcontentloaded", timeout: 60000 });
await m.waitForTimeout(3500);
await m.locator("text=SIGNATURE").first().click();
await m.waitForTimeout(3000);
await m.evaluate(() => window.scrollTo(0, 260));
await m.waitForTimeout(1200);
await m.screenshot({ path: "scripts/amy_m3.jpg", type: "jpeg", quality: 92 });
urls.m3 = await upload("scripts/amy_m3.jpg", "mobile-cocktail");

await browser.close();

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "Butik QR Menü",
    title_tr: "Amy Kitchen & Cocktail için Markaya Özel QR Menü",
    title_en: "A Brand-Tailored QR Menu for Amy Kitchen & Cocktail",
    body_tr: "Amy Kitchen & Cocktail için hazır bir tema uyarlamadık — menü, müşterinin talebi doğrultusunda markanın kimliğine göre sıfırdan tasarlandı. El yazısı logosu, koyu zemin üzerine amber vurguları ve zarif tipografisiyle menü, mekânın atmosferini telefona taşıyor.\n\nMasadaki QR kodu okutan misafir; yemekler, imza kokteyller ve içecekler arasında profesyonel ürün fotoğrafları eşliğinde geziniyor. Her ürün kalori bilgisi, içerik açıklaması ve alerjen rozetleriyle sunuluyor.",
    body_en: "We didn't adapt an off-the-shelf theme for Amy Kitchen & Cocktail — the menu was designed from scratch around the brand's identity, exactly as the client requested. With its signature handwritten logo, amber accents on a dark canvas and refined typography, the menu carries the venue's atmosphere onto the phone.\n\nGuests scanning the QR code at their table browse foods, signature cocktails and drinks alongside professional product photography. Every item is presented with calorie info, ingredient descriptions and allergen badges.",
  },
  {
    type: "mobile_preview",
    count: 3,
    phones: [{ url: urls.m1 }, { url: urls.m2 }, { url: urls.m3 }],
  },
  {
    type: "text_block",
    label: "Yazılım & Panel",
    title_tr: "Tam Yönetim Paneliyle Teslim: Excel ile Toplu Ürün Yönetimi",
    title_en: "Delivered with a Full Admin Panel: Bulk Product Management via Excel",
    body_tr: "Bu proje sadece bir arayüz değil; arkasında VogoPos altyapısının tüm gücü bulunan eksiksiz bir yazılım teslimi. İşletmeye, menüsünü uçtan uca yönetebildiği bir panel kurduk:\n\nExcel ile Toplu Yönetim: Yüzlerce ürün; fiyat, açıklama, kalori ve alerjen bilgileriyle birlikte tek Excel dosyasından içe/dışa aktarılıyor. Sezonluk menü değişimi dakikalar sürüyor.\nQR Özellikleri: Çok dilli menü (TR/EN), alerjen rehberi, kalori gösterimi, ürün arama, misafir geri bildirim modülü ve anlık fiyat güncellemeleri.\nKategori & Varyasyon: Sınırsız kategori, alt menü ve ürün varyasyonu desteği.\n\nİşletme hiçbir güncelleme için bize bağımlı değil — panel tamamen kendilerine teslim edildi.",
    body_en: "This project isn't just an interface; it's a complete software delivery powered by the full VogoPos infrastructure. We set up a panel that lets the venue manage its menu end to end:\n\nBulk Management via Excel: Hundreds of products — with prices, descriptions, calories and allergens — imported/exported from a single Excel file. A seasonal menu change takes minutes.\nQR Features: Multilingual menu (TR/EN), allergen guide, calorie display, product search, guest feedback module and instant price updates.\nCategories & Variants: Unlimited categories, submenus and product variants.\n\nThe venue depends on no one for updates — the panel was handed over entirely to them.",
  },
  {
    type: "text_block",
    label: "Hizmet Özeti",
    title_tr: "Hizmet Kapsamı",
    title_en: "Scope of Services",
    body_tr: "\nÜrün: Markaya özel tasarlanmış dijital QR menü\n\nYazılım: VogoPos altyapılı tam yönetim paneli teslimi\n\nYönetim: Excel ile toplu ürün içe/dışa aktarma\n\nÖzellikler: Çok dilli menü, kalori & alerjen rozetleri, ürün arama, geri bildirim\n\nTasarım: Müşteri talebine göre sıfırdan, marka kimliğine uygun\n\nPlatform: Mobil öncelikli web uygulaması",
    body_en: "\nProduct: Digital QR menu custom-designed for the brand\n\nSoftware: Full admin panel delivery on VogoPos infrastructure\n\nManagement: Bulk product import/export via Excel\n\nFeatures: Multilingual menu, calorie & allergen badges, product search, feedback\n\nDesign: From scratch per client request, true to the brand identity\n\nPlatform: Mobile-first web application",
  },
];

const docRef = await withRetry(() => addDoc(collection(db, "projects"), {
  title: "Amy Kitchen & Cocktail",
  brandName: "Amy Kitchen & Cocktail",
  slug: "amy-qr-menu",
  description_tr: "Amy Kitchen & Cocktail için müşteri talebine göre sıfırdan tasarlanmış, markaya özel bir dijital QR menü geliştirdik. Proje; VogoPos altyapısının tüm QR özelliklerini taşıyan eksiksiz bir yönetim paneliyle teslim edildi — ürünler Excel ile toplu yönetiliyor, menü çok dilli, kalori ve alerjen bilgileri her üründe.",
  description_en: "We built a brand-tailored digital QR menu for Amy Kitchen & Cocktail, designed from scratch per the client's request. The project was delivered with a complete admin panel carrying all VogoPos QR features — products are bulk-managed via Excel, the menu is multilingual, with calorie and allergen info on every item.",
  industry_tr: "Restoran & Cocktail Bar",
  industry_en: "Restaurant & Cocktail Bar",
  timeline: "",
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  year: "2025",
  category: "QR Menu & Software",
  tags: ["QR Menu", "Custom Design", "Admin Panel", "Excel Import", "Multilingual"],
  link: "https://vogopos.com/amy",
  order: 6,
  featured: false,
  blocks,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));
console.log("✅ Amy eklendi:", docRef.id);
process.exit(0);
