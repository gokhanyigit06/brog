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
  const r = ref(storage, `projects/vogopos-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  const url = await getDownloadURL(r);
  console.log(`✓ ${name}`);
  return url;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const mobileCtx = await browser.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2 });
const mobilePage = await mobileCtx.newPage();

const urls = {};

await page.goto("https://vogopos.com", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
try { await page.click("text=Kabul", { timeout: 2000 }); } catch {}
try { await page.click("[class*='close'], .modal__close", { timeout: 2000 }); } catch {}

await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: "scripts/vp_hero.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.hero = await upload("scripts/vp_hero.jpg", "hero");

await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/vp_s2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s2 = await upload("scripts/vp_s2.jpg", "s2");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/vp_s3.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s3 = await upload("scripts/vp_s3.jpg", "s3");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/vp_s4.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s4 = await upload("scripts/vp_s4.jpg", "s4");

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 4.5));
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/vp_s5.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.s5 = await upload("scripts/vp_s5.jpg", "s5");

// Mobil görünüm
await mobilePage.goto("https://vogopos.com", { waitUntil: "domcontentloaded", timeout: 60000 });
await mobilePage.waitForTimeout(2500);
await mobilePage.evaluate(() => window.scrollTo(0, 0));
await mobilePage.waitForTimeout(600);
await mobilePage.screenshot({ path: "scripts/vp_mobile1.jpg", fullPage: false, type: "jpeg", quality: 93 });
urls.mobile1 = await upload("scripts/vp_mobile1.jpg", "mobile1");

await mobilePage.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
await mobilePage.waitForTimeout(800);
await mobilePage.screenshot({ path: "scripts/vp_mobile2.jpg", fullPage: false, type: "jpeg", quality: 90 });
urls.mobile2 = await upload("scripts/vp_mobile2.jpg", "mobile2");

await browser.close();

const blocks = [
  { type: "single_image", url: urls.hero, ratio: "16:9" },
  {
    type: "text_block",
    label: "Ürün",
    title_tr: "Vogo Lab'in Restoran Teknolojisi Platformu",
    title_en: "Vogo Lab's Restaurant Technology Platform",
    body_tr: "VogoPos, Vogo Lab tarafından geliştirilen, restoranların operasyonunu uçtan uca dijitalleştiren bir QR menü ve POS yönetim platformudur. Ankara merkezli ekibimizin kendi ürünü olan VogoPos için web sitesi, dijital reklam ve mobil uygulama geliştirmesini biz yaptık.\n\nDijital menü oluşturma, QR ile masadan sipariş, gerçek zamanlı sipariş takibi, ekip içi iletişim, satış analitiği ve çok dilli menü çevirisi tek platformda toplanıyor. 500+ beş yıldızlı yorum ve %98.5 müşteri memnuniyetiyle büyüyen restoranların tercihi.",
    body_en: "VogoPos is a QR menu and POS management platform developed by Vogo Lab that fully digitizes restaurant operations. We built the website, digital advertising, and mobile application for VogoPos — our own Ankara-based team's product.\n\nDigital menu creation, QR table ordering, real-time order tracking, in-team communication, sales analytics, and multilingual menu translation are unified in a single platform. The choice of growing restaurants, with 500+ five-star reviews and 98.5% customer satisfaction.",
  },
  { type: "single_image", url: urls.s2, ratio: "16:9" },
  { type: "single_image", url: urls.s3, ratio: "16:9" },
  {
    type: "text_block",
    label: "Özellikler",
    title_tr: "Menüden Analitiğe, Uçtan Uca Yönetim",
    title_en: "End-to-End Management, from Menu to Analytics",
    body_tr: "Menü Yönetimi: Excel/CSV yükleme, yapay zeka destekli PDF tanıma veya hazır şablonlarla dakikalar içinde menü oluşturma; anlık fiyat ve ürün güncellemeleri.\nOperasyon: Garson-mutfak arası uygulama içi iletişim, masa ve rezervasyon yönetimi, görev atama ve performans takibi.\nAnalitik: Ürün ve zaman bazlı satış performansı, dönüşüm metrikleri, gelir takibi.\nÖzelleştirme: Restoran temalı şablonlar (tavern, burger, steakhouse, cafe) ve kurumsal müşteriler için white-label.\nMobil Uygulama: İşletme sahibi ve personel için mobil yönetim ve sipariş takibi.",
    body_en: "Menu Management: Create menus in minutes via Excel/CSV upload, AI-powered PDF recognition, or pre-built templates; instant price and product updates.\nOperations: In-app server-kitchen communication, table and reservation management, task assignment, and performance tracking.\nAnalytics: Sales performance by product and time, conversion metrics, revenue tracking.\nCustomization: Restaurant-themed templates (tavern, burger, steakhouse, café) and white-label for enterprise clients.\nMobile App: Mobile management and order tracking for owners and staff.",
  },
  { type: "single_image", url: urls.mobile1, ratio: "9:16" },
  { type: "single_image", url: urls.mobile2, ratio: "9:16" },
  { type: "single_image", url: urls.s4, ratio: "16:9" },
  {
    type: "text_block",
    label: "Kapsam",
    title_tr: "Web, Reklam ve Mobil Uygulama",
    title_en: "Web, Advertising, and Mobile App",
    body_tr: "VogoPos için sunduğumuz hizmetler:\n\nWeb Sitesi: Ürünü tanıtan, dönüşüm odaklı kurumsal pazarlama sitesi; abonelik planları, özellik vitrini ve demo akışı.\n\nMobil Uygulama: Restoran personeli ve yöneticiler için sipariş yönetimi ve operasyon uygulaması.\n\nDijital Reklam: Restoran ve kafe işletmecilerine yönelik Meta & Google Ads kampanyaları, SaaS kullanıcı kazanımı ve dönüşüm odaklı pazarlama.",
    body_en: "Services we provide for VogoPos:\n\nWebsite: A conversion-focused corporate marketing site presenting the product; subscription plans, feature showcase, and demo flow.\n\nMobile App: An order management and operations app for restaurant staff and managers.\n\nDigital Advertising: Meta & Google Ads campaigns targeting restaurant and café operators, SaaS user acquisition, and conversion-focused marketing.",
  },
  { type: "single_image", url: urls.s5, ratio: "16:9" },
  {
    type: "text_block",
    label: "Stack",
    title_tr: "Teknik & Hizmet Özeti",
    title_en: "Technical & Service Overview",
    body_tr: "\nÜrün: VogoPos — QR menü & restoran POS platformu (Vogo Lab)\n\nWeb: Kurumsal SaaS pazarlama sitesi\n\nMobil: iOS / Android yönetim uygulaması\n\nReklam: Meta Ads, Google Ads (SaaS kullanıcı kazanımı)\n\nÖzellikler: AI PDF tanıma, çok dilli menü, analitik, white-label\n\nReferans: 500+ 5 yıldız, %98.5 memnuniyet",
    body_en: "\nProduct: VogoPos — QR menu & restaurant POS platform (Vogo Lab)\n\nWeb: Corporate SaaS marketing site\n\nMobile: iOS / Android management app\n\nAds: Meta Ads, Google Ads (SaaS user acquisition)\n\nFeatures: AI PDF recognition, multilingual menu, analytics, white-label\n\nReference: 500+ 5-star reviews, 98.5% satisfaction",
  },
];

const docRef = await addDoc(collection(db, "projects"), {
  title: "VogoPos",
  brandName: "VogoPos",
  slug: "vogopos",
  description_tr: "Vogo Lab'in kendi ürünü olan restoran QR menü ve POS yönetim platformu VogoPos için web sitesi, dijital reklam ve mobil uygulama geliştirdik. Yapay zeka destekli menü oluşturma, masadan QR sipariş, gerçek zamanlı takip ve satış analitiği sunan platformun kurumsal pazarlama sitesini, SaaS kullanıcı kazanım reklamlarını ve mobil yönetim uygulamasını uçtan uca hayata geçirdik.",
  description_en: "We developed the website, digital advertising, and mobile application for VogoPos, Vogo Lab's own restaurant QR menu and POS management platform. We delivered end-to-end the corporate marketing site, SaaS user acquisition campaigns, and mobile management app for the platform offering AI-powered menu creation, QR table ordering, real-time tracking, and sales analytics.",
  industry_tr: "SaaS & Restoran Teknolojisi",
  industry_en: "SaaS & Restaurant Tech",
  timeline: "",
  imageUrl: urls.hero,
  listingImageUrl: urls.hero,
  videoUrl: "",
  listingVideoUrl: "",
  year: "2024",
  category: "Web · Mobile App · Digital Ads",
  tags: ["SaaS", "Web Design", "Mobile App", "Digital Ads", "Restaurant Tech"],
  link: "https://vogopos.com",
  order: 9,
  featured: true,
  blocks,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log("✅ VogoPos eklendi:", docRef.id);
process.exit(0);
