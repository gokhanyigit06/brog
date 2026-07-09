// Woodiko, Dostlar Yol Yardım, Alpfine Otel, Alper Arabacı projelerini ekler.
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

async function withRetry(fn, tries = 8) {
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } catch { await new Promise(r => setTimeout(r, 2500)); }
  }
  throw new Error("firebase erişilemedi");
}

async function upload(file, key) {
  const buffer = fs.readFileSync(file);
  const r = ref(storage, `projects/${key}-${Date.now()}.jpg`);
  await withRetry(() => uploadBytes(r, buffer, { contentType: "image/jpeg" }));
  const url = await withRetry(() => getDownloadURL(r));
  console.log("✓", key);
  return url;
}

const browser = await chromium.launch();
const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dp = await dctx.newPage();
const mctx = await browser.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2, isMobile: true });
const mp = await mctx.newPage();

async function closePopups(page) {
  for (const sel of ["text=Kabul Et", "text=Kabul", "text=Accept", "[aria-label*='close' i]", ".modal__close", "button[aria-label='Close dialog']"]) {
    try { await page.click(sel, { timeout: 1200 }); await page.waitForTimeout(300); } catch {}
  }
  await page.keyboard.press("Escape").catch(() => {});
}

async function capture(site, slug) {
  const urls = {};
  await dp.goto(site, { waitUntil: "domcontentloaded", timeout: 60000 });
  await dp.waitForTimeout(3500);
  await closePopups(dp);
  // lazy load
  await dp.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 550) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 160)); } window.scrollTo(0, 0); });
  await dp.waitForTimeout(1500);

  await dp.evaluate(() => window.scrollTo(0, 0));
  await dp.waitForTimeout(800);
  await dp.screenshot({ path: `scripts/np_${slug}_hero.jpg`, type: "jpeg", quality: 92 });
  urls.hero = await upload(`scripts/np_${slug}_hero.jpg`, `${slug}-hero`);

  for (let i = 1; i <= 3; i++) {
    await dp.evaluate((n) => window.scrollTo(0, window.innerHeight * n), i);
    await dp.waitForTimeout(1000);
    await dp.screenshot({ path: `scripts/np_${slug}_s${i}.jpg`, type: "jpeg", quality: 90 });
    urls[`s${i}`] = await upload(`scripts/np_${slug}_s${i}.jpg`, `${slug}-s${i}`);
  }

  // mobil
  await mp.goto(site, { waitUntil: "domcontentloaded", timeout: 60000 });
  await mp.waitForTimeout(3200);
  await closePopups(mp);
  await mp.evaluate(() => window.scrollTo(0, 0));
  await mp.waitForTimeout(700);
  await mp.screenshot({ path: `scripts/np_${slug}_m1.jpg`, type: "jpeg", quality: 92 });
  urls.m1 = await upload(`scripts/np_${slug}_m1.jpg`, `${slug}-m1`);
  await mp.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
  await mp.waitForTimeout(900);
  await mp.screenshot({ path: `scripts/np_${slug}_m2.jpg`, type: "jpeg", quality: 90 });
  urls.m2 = await upload(`scripts/np_${slug}_m2.jpg`, `${slug}-m2`);

  return urls;
}

const tb = (label, title_tr, body_tr) => ({ type: "text_block", label, title_tr, title_en: "", body_tr, body_en: "" });
const img = (url, ratio = "16:9") => ({ type: "single_image", url, ratio });
const phones = (u, link) => ({ type: "mobile_preview", count: 2, phones: [{ imageUrl: u.m1, url: link }, { imageUrl: u.m2, url: link }] });

const PROJECTS = [
  {
    site: "https://woodiko.com", slug: "woodiko", brand: "Woodiko", year: "2025",
    category: "Web · Ads · SEO",
    industry_tr: "Mobilya & Dekorasyon", industry_en: "Furniture",
    tags: ["Web Tasarım", "Google Ads", "Yerel SEO", "Next.js"],
    desc_tr: "1982'den beri üreten Ankara'nın köklü mobilya ustası Yıldırım Mobilya'nın yeni markası Woodiko için uçtan uca dijital dönüşüm: Next.js ile sıfırdan web sitesi, Google reklam yönetimi ve 'ankara özel mobilya' aramalarına yönelik yerel SEO. Ücretsiz keşif randevusu akışıyla site, talep üreten bir satış kanalına dönüştü.",
    blocks: (u) => [
      img(u.hero),
      tb("Web Sitesi", "40 Yıllık Ustalığa Yeni Nesil Dijital Vitrin",
        "Woodiko, 1982'den beri Ankara'da özel mobilya üreten Yıldırım Mobilya'nın yeni nesil markası. Mutfak, yatak odası, giyinme odası ve banyo dolaplarında kişiye özel üretim yapıyor.\n\nMarka yenilenirken dijital kimliğini de sıfırdan kurduk: Next.js tabanlı, hızlı, mobil öncelikli bir site; hizmet sayfaları, proje galerisi, blog ve mağaza bölümleri. 'Ücretsiz keşif randevusu' odaklı dönüşüm akışıyla ziyaretçiyi doğrudan talebe yönlendiriyor."),
      img(u.s1), img(u.s2),
      tb("Reklam & SEO", "Ankara'nın Premium Semtlerine Hedefli Büyüme",
        "Google Ads: 'ankara mutfak dolabı', 'çayyolu özel mobilya' gibi yüksek niyetli aramalarda arama ağı kampanyaları; Yaşamkent, Çayyolu, Ümitköy gibi hedef semtlere coğrafi odaklama.\n\nYerel SEO: hizmet-semt bazlı açılış sayfaları, Google İşletme Profili optimizasyonu ve blog içerikleriyle organik görünürlük. Keşif randevusu talepleri ölçülebilir şekilde takip ediliyor."),
      phones(u, "https://woodiko.com"),
      tb("Stack", "Teknik Özet", "\nFrontend: Next.js\n\nHizmetler: Web tasarım & geliştirme, Google Ads, Yerel SEO\n\nDönüşüm: Ücretsiz keşif randevusu + teklif formu\n\nİçerik: Hizmet sayfaları, galeri, blog, mağaza"),
      img(u.s3),
    ],
  },
  {
    site: "https://dostlaryolyardim.com", slug: "dostlar-yol-yardim", brand: "Dostlar Yol Yardım", year: "2025",
    category: "Web · Ads · SEO",
    industry_tr: "Otomotiv & Yol Yardım", industry_en: "Automotive",
    tags: ["Web Tasarım", "Google Ads", "Yerel SEO", "Astro"],
    desc_tr: "Ankara'da 7/24 çekici ve yol yardımı hizmeti veren Dostlar Yol Yardım için acil-arama odaklı web sitesi, Google reklam yönetimi ve yerel SEO. 'Yolda kalan değil, çözüm bulan kazanır' mottosuyla; telefon ve WhatsApp'a tek dokunuşla ulaşılan, saniyeler içinde açılan bir site kurduk.",
    blocks: (u) => [
      img(u.hero),
      tb("Web Sitesi", "Acil Anda 3 Saniyede Açılan, Tek Dokunuşla Aratan Site",
        "Yol yardımında müşteri panik hâlindedir ve mobildedir — sitenin işi 3 saniyede açılıp telefonu tek dokunuşla çaldırmaktır. Astro ile ultra hafif, statik ve mobil öncelikli bir site kurduk.\n\nHizmetler (kayar kasa çekici, kaza/arıza kurtarma, şehirlerarası nakil), hizmet bölgeleri (Batıkent, Etimesgut, Eryaman, Çayyolu...) ve şeffaf fiyat vurgusu net bölümlerle sunuldu. Telefon ve WhatsApp butonları her ekranda sabit."),
      img(u.s1), img(u.s2),
      tb("Reklam & SEO", "'Ankara Yol Yardım' Aramalarında Zirve Hedefi",
        "Bu sektörde iş, arama anında döner: Google Ads arama kampanyaları 'ankara çekici', 'yol yardım ankara' gibi acil aramalarda tıklama-ara uzantılarıyla çalışıyor.\n\nYerel SEO tarafında semt bazlı hizmet bölgesi içerikleri ve Google İşletme Profili düzenlemesiyle organik + harita görünürlüğü büyütülüyor. Gece-gündüz gelen çağrılar ölçümleniyor."),
      phones(u, "https://dostlaryolyardim.com"),
      tb("Stack", "Teknik Özet", "\nFrontend: Astro (statik, ultra hızlı)\n\nHizmetler: Web tasarım & geliştirme, Google Ads, Yerel SEO\n\nDönüşüm: Tıkla-ara + WhatsApp\n\nOdak: Mobil hız, acil arama anı"),
      img(u.s3),
    ],
  },
  {
    site: "https://alpfineotel.com", slug: "alpfine-otel", brand: "Alpfine Otel", year: "2025",
    category: "Web · SEO",
    industry_tr: "Otel & Konaklama", industry_en: "Hospitality",
    tags: ["Web Tasarım", "SEO", "Rezervasyon", "Next.js"],
    desc_tr: "Ankara Çankaya'da, Atakule'nin yanındaki butik otel Alpfine için rezervasyon entegrasyonlu web sitesi ve otel aramalarına yönelik SEO. Butik konseptin sıcaklığını yansıtan tasarım; odalar, çatı restoranı ve etkinlik alanlarını sergileyip ziyaretçiyi doğrudan rezervasyona taşıyor.",
    blocks: (u) => [
      img(u.hero),
      tb("Web Sitesi", "Butik Otelin Ruhunu Taşıyan Rezervasyon Odaklı Site",
        "Alpfine, 'büyük otellerin soğukluğundan uzak' kişiye özel misafirperverlik sunan bir Çankaya butik oteli. Web sitesini bu konsepte uygun kurduk: zamansız, sıcak ve sade bir tasarım.\n\nOdalar, panoramik çatı restoranı, kahvaltı ve etkinlik alanları ayrı bölümlerle sergileniyor; Next.js altyapısı ve Firebase görsel yönetimiyle otel ekibi içerikleri kolayca güncelliyor. Rezervasyon akışı, telefon ve WhatsApp her sayfadan tek adım uzakta."),
      img(u.s1), img(u.s2),
      tb("SEO", "Başkent Otel Aramalarında Görünürlük",
        "'Çankaya butik otel', 'Atakule yakını otel' gibi konum bazlı aramalar için sayfa yapısı ve içerik SEO'ya göre kurgulandı: semantik başlıklar, otel şeması (structured data), hızlı yüklenen görseller ve Google İşletme Profili uyumu.\n\nOrganik aramadan gelen doğrudan rezervasyon, komisyonlu platformlara bağımlılığı azaltıyor."),
      phones(u, "https://alpfineotel.com"),
      tb("Stack", "Teknik Özet", "\nFrontend: Next.js + Firebase Storage\n\nHizmetler: Web tasarım & geliştirme, SEO\n\nDönüşüm: Rezervasyon + telefon + WhatsApp\n\nİçerik: Odalar, restoran, galeri, blog"),
      img(u.s3),
    ],
  },
  {
    site: "https://alperarabaci.com", slug: "alper-arabaci", brand: "Alper Arabacı", year: "2025",
    category: "Web · Branding",
    industry_tr: "Kişisel Portföy", industry_en: "Personal Portfolio",
    tags: ["Web Tasarım", "Kişisel Marka", "Konsept Tasarım", "Next.js"],
    desc_tr: "Video editörü Alper Arabacı için sıradan bir portföy yerine 'AlperOS' konseptini tasarladık: masaüstü işletim sistemi arayüzünde gezilen, Finder'ıyla, uygulamalarıyla ve galerisiyle tamamen etkileşimli bir kişisel site. Kişisel marka kimliğiyle birlikte akılda kalan bir dijital kartvizit.",
    blocks: (u) => [
      img(u.hero),
      tb("Konsept", "Portföy Değil, İşletim Sistemi: AlperOS",
        "Video editörünün işi zaten ekranda hikâye anlatmak — portföyü de öyle olmalıydı. Klasik 'hakkımda + işlerim' sayfası yerine, ziyaretçinin bir masaüstü işletim sistemi gibi gezdiği AlperOS'u tasarladık.\n\nFinder'da projeler, galeri uygulamasında fotoğraflar, dock'ta iletişim kanalları (WhatsApp, Telegram, Instagram, Mail)... DaVinci Resolve, After Effects ve Premiere Pro yetkinlikleri de arayüzün doğal parçası olarak sunuluyor."),
      img(u.s1), img(u.s2),
      tb("Kişisel Marka", "Akılda Kalan Bir Dijital Kartvizit",
        "Yaratıcı sektörde portföyün kendisi bir iş örneğidir. AlperOS konsepti; tipografisi, ikonografisi ve mikro etkileşimleriyle kişisel marka kimliği olarak da çalışıyor.\n\nSiteyi gören potansiyel müşteri, daha ilk saniyede 'bu kişi işini farklı yapıyor' mesajını alıyor — ki bir video editörü için en iyi satış konuşması tam olarak bu."),
      phones(u, "https://alperarabaci.com"),
      tb("Stack", "Teknik Özet", "\nFrontend: Next.js (tamamen özel OS arayüzü)\n\nHizmetler: Web tasarım & geliştirme, kişisel marka kimliği\n\nEtkileşim: Pencere yönetimi, dock, uygulama konsepti\n\nİletişim: WhatsApp, Telegram, Instagram, Mail entegre"),
      img(u.s3),
    ],
  },
];

let order = 10;
for (const P of PROJECTS) {
  console.log(`\n— ${P.brand} —`);
  const u = await capture(P.site, P.slug);
  const docData = {
    title: P.brand,
    brandName: P.brand,
    slug: P.slug,
    description_tr: P.desc_tr,
    description_en: "",
    industry_tr: P.industry_tr,
    industry_en: P.industry_en,
    timeline: "",
    imageUrl: u.hero,
    listingImageUrl: "",
    videoUrl: "",
    listingVideoUrl: "",
    year: P.year,
    category: P.category,
    tags: P.tags,
    link: P.site,
    order: order++,
    featured: true,
    blocks: P.blocks(u),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const refDoc = await withRetry(() => addDoc(collection(db, "projects"), docData));
  console.log(`✅ ${P.brand} eklendi: ${refDoc.id}`);
}

await browser.close();
console.log("\n✅ 4 proje tamamlandı");
process.exit(0);
