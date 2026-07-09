// 1) ServicesContent'i site konumlandırmasıyla (Web/Reklam/SEO/Marka) hizalar
// 2) Ankara odaklı yerel SEO blog yazısını yayınlar (kapak dahil)
import { chromium } from "playwright";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const storage = getStorage(app);
const db = getFirestore(app);
async function withRetry(fn, t=8){for(let i=0;i<t;i++){try{return await fn()}catch{await new Promise(r=>setTimeout(r,2500))}}throw new Error("fail")}

// ── 1) Hizmetler ──
const services = {
  label: "04",
  title_tr: "Hizmetler",
  title_en: "Services",
  items: [
    {
      id: "1", order: 0,
      title_tr: "Web Tasarım & Geliştirme", title_en: "Web Design & Development",
      description_tr: "Hazır şablon değil — markanıza özel tasarlanıp kodlanan, hızlı ve dönüşüm odaklı web siteleri. Kurumsal siteden e-ticarete, rezervasyon sisteminden özel panellere kadar uçtan uca geliştirme.",
      description_en: "Custom-designed and coded websites — fast and conversion-focused. From corporate sites to e-commerce, booking systems and custom panels.",
      pills: ["Özel Tasarım", "Next.js & Shopify", "Mobil Öncelikli", "Yönetim Paneli", "Yüksek Hız"],
      pills_tr: ["Özel Tasarım", "Next.js & Shopify", "Mobil Öncelikli", "Yönetim Paneli", "Yüksek Hız"],
      pills_en: ["Custom Design", "Next.js & Shopify", "Mobile-First", "Admin Panel", "High Performance"],
      matchTags: ["Web Tasarım", "Web Design", "Next.js", "Shopify", "E-Commerce", "Astro", "Rezervasyon"],
    },
    {
      id: "2", order: 1,
      title_tr: "Reklam Yönetimi", title_en: "Ads Management",
      description_tr: "Meta ve Google reklamlarınızı ROAS odaklı yönetiriz: doğru kitle, doğru kreatif, sürekli optimizasyon. Bütçeniz tıklamaya değil, satışa ve talebe dönüşür.",
      description_en: "ROAS-focused Meta & Google ads management: right audience, right creative, continuous optimization.",
      pills: ["Meta Ads", "Google Ads", "Retargeting", "A/B Test", "Dönüşüm Takibi"],
      pills_tr: ["Meta Ads", "Google Ads", "Retargeting", "A/B Test", "Dönüşüm Takibi"],
      pills_en: ["Meta Ads", "Google Ads", "Retargeting", "A/B Testing", "Conversion Tracking"],
      matchTags: ["Meta Ads", "Google Ads", "Digital Ads", "Reklam"],
    },
    {
      id: "3", order: 2,
      title_tr: "SEO", title_en: "SEO",
      description_tr: "Teknik altyapıdan içeriğe uçtan uca SEO ile Google'da kalıcı organik görünürlük. Ankara ve çevresi için yerel SEO'da uzmanız: harita, semt ve sektör aramalarında öne çıkın.",
      description_en: "End-to-end SEO from technical foundation to content. Local SEO expertise for Ankara and the region.",
      pills: ["Teknik SEO", "Yerel SEO", "İçerik Stratejisi", "Anahtar Kelime", "Raporlama"],
      pills_tr: ["Teknik SEO", "Yerel SEO", "İçerik Stratejisi", "Anahtar Kelime", "Raporlama"],
      pills_en: ["Technical SEO", "Local SEO", "Content Strategy", "Keyword Research", "Reporting"],
      matchTags: ["SEO", "Yerel SEO"],
    },
    {
      id: "4", order: 3,
      title_tr: "Marka & Kreatif", title_en: "Brand & Creative",
      description_tr: "Logo ve kurumsal kimlikten sosyal medya içeriğine, QR menüden kişisel marka sitelerine — markanızın her temas noktasında tutarlı ve akılda kalıcı bir görsel dil kurarız.",
      description_en: "From logo and corporate identity to social content, QR menus and personal brand sites — a consistent visual language at every touchpoint.",
      pills: ["Marka Kimliği", "Logo Tasarımı", "Sosyal Medya", "İçerik Üretimi", "QR Menü"],
      pills_tr: ["Marka Kimliği", "Logo Tasarımı", "Sosyal Medya", "İçerik Üretimi", "QR Menü"],
      pills_en: ["Brand Identity", "Logo Design", "Social Media", "Content Production", "QR Menu"],
      matchTags: ["Branding", "Marka", "Kişisel Marka", "QR Menu", "Design", "Multilingual"],
    },
  ],
};

await withRetry(() => setDoc(doc(db, "siteContent", "services"), { ...services, updatedAt: new Date().toISOString() }));
console.log("✅ Hizmetler güncellendi (Web/Reklam/SEO/Marka)");

// ── 2) Ankara blog yazısı ──
const coverHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:750px;background:#080808;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#fff;position:relative;overflow:hidden}
  .glow{position:absolute;top:-25%;right:-12%;width:65%;height:95%;background:radial-gradient(circle at center, rgba(37,99,235,0.28) 0%, rgba(0,0,0,0) 70%)}
  .wrap{position:relative;z-index:1;padding:80px 88px;height:100%;display:flex;flex-direction:column;justify-content:space-between}
  .brand{display:flex;align-items:center;gap:14px}
  .mark{width:36px;height:36px}
  .brand span{font-size:24px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase}
  .kicker{display:inline-block;background:#2563eb;color:#fff;border-radius:999px;padding:10px 22px;font-size:20px;font-weight:700;width:fit-content;margin-bottom:28px}
  h1{font-size:66px;font-weight:900;line-height:1.06;letter-spacing:-0.03em;max-width:1000px}
  .foot{font-size:20px;color:rgba(255,255,255,0.55)}
</style></head><body>
  <div class="glow"></div>
  <div class="wrap">
    <div class="brand"><svg class="mark" viewBox="0 0 48 48" fill="#fff"><path d="M24 2 L29 19 L46 24 L29 29 L24 46 L19 29 L2 24 L19 19 Z"/></svg><span>Vogolab</span></div>
    <div><div class="kicker">Ankara · Rehber</div><h1>Ankara'da web sitesi yaptırmak: süreç, süre ve doğru ajans seçimi</h1></div>
    <div class="foot">vogolab.com/blog</div>
  </div>
</body></html>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 750 } });
await p.setContent(coverHtml, { waitUntil: "networkidle" });
await p.screenshot({ path: "scripts/blog_cover_ankara.jpg", type: "jpeg", quality: 92 });
await b.close();
const buf = fs.readFileSync("scripts/blog_cover_ankara.jpg");
const r = ref(storage, `blog/cover-ankara-${Date.now()}.jpg`);
await withRetry(() => uploadBytes(r, buf, { contentType: "image/jpeg" }));
const coverUrl = await withRetry(() => getDownloadURL(r));
console.log("✓ kapak yüklendi");

const now = new Date().toISOString();
const rt = (id, tr) => ({ type: "rich_text", id, content: { tr, en: "" } });
const quote = (id, tr, author) => ({ type: "quote", id, text: { tr, en: "" }, author });

await withRetry(() => setDoc(doc(db, "blog_posts", "ankara-web-sitesi-rehberi"), {
  id: "ankara-web-sitesi-rehberi",
  slug: "ankara-web-sitesi-yaptirma-rehberi",
  title: { tr: "Ankara'da Web Sitesi Yaptırmak: Süreç, Süre ve Doğru Ajans Seçimi", en: "" },
  excerpt: { tr: "Ankara'da web sitesi yaptıracaksanız: süreç nasıl işler, ne kadar sürer, fiyatı ne belirler ve ajansa hangi soruları sormalısınız? Yerel bir ajansla çalışmanın avantajlarıyla birlikte, adım adım pratik rehber.", en: "" },
  coverMedia: { type: "image", url: coverUrl },
  tags: ["Ankara", "Web Tasarım"],
  author: "Vogolab",
  published: true,
  publishedAt: now,
  createdAt: now,
  updatedAt: now,
  body: [
    rt("b1", "Ankara'da faaliyet gösteren bir işletmeyseniz ve web sitesi yaptırmayı düşünüyorsanız, karşınızda iki uç seçenek var: birkaç bin liraya hazır şablon dolduran freelancer'lar ile kurumsal bütçe isteyen büyük ajanslar. Doğru cevap genelde ikisinin arasında — ama neye para verdiğinizi bilmeden karar vermek zor.\n\nBu rehberde süreci, süreleri, fiyatı belirleyen faktörleri ve bir ajansa sormanız gereken soruları; Ankara'da onlarca site teslim etmiş bir ekip olarak anlatıyoruz."),
    rt("b2", "<h2>Süreç nasıl işler?</h2><p>Sağlıklı bir web projesi dört aşamadan geçer:</p><ul><li><strong>Keşif (1. hafta):</strong> İşinizi, rakiplerinizi ve hedef kitlenizi anlamak. Ankara'da yüz yüze bir keşif toplantısı bu aşamayı ciddi hızlandırır — yerel ajansla çalışmanın ilk somut avantajı.</li><li><strong>Tasarım (1-2 hafta):</strong> Sayfa yapısı ve görsel dil. Bu aşamada 'beğenmedim'leri konuşmak, kodlamadan sonra konuşmaktan on kat ucuzdur.</li><li><strong>Geliştirme (2-4 hafta):</strong> Tasarımın koda dökülmesi, içeriklerin girilmesi, mobil ve hız optimizasyonu.</li><li><strong>Yayın & teslim:</strong> Alan adı/hosting kurulumu, Google Search Console kaydı, yönetim paneli eğitimi.</li></ul><p>Kurumsal bir site için gerçekçi toplam süre <strong>4-8 hafta</strong>; e-ticaret veya rezervasyon sistemli projelerde 8-12 hafta. 'Üç güne teslim' vaadi genelde şablon demektir.</p>"),
    rt("b3", "<h2>Fiyatı ne belirler?</h2><p>Ankara'da web sitesi fiyatları çok geniş bir aralıkta geziyor; farkı yaratan başlıca kalemler şunlar:</p><ul><li><strong>Özel tasarım mı, şablon mu?</strong> Şablon ucuzdur ama rakibinizle aynı görünürsünüz ve esneklik sınırlıdır.</li><li><strong>İşlevler:</strong> E-ticaret, rezervasyon, çoklu dil, özel yönetim paneli — her biri işi büyütür.</li><li><strong>İçerik:</strong> Metinleri ve görselleri siz mi vereceksiniz, ajans mı üretecek?</li><li><strong>SEO altyapısı:</strong> Hız, semantik yapı, structured data baştan kurulursa ucuz; sonradan eklenirse pahalıdır.</li><li><strong>Teslim sonrası destek:</strong> Bakım, güncelleme ve küçük revizyonların kapsamı.</li></ul><p>Teklifleri karşılaştırırken fiyata değil, <strong>kapsam listesine</strong> bakın: iki 'aynı fiyatlı' teklif arasında dağlar kadar fark olabilir.</p>"),
    quote("b4", "Ucuz site pahalıdır: yavaş açılır, Google'da görünmez, telefon çaldırmaz. Maliyeti fiyat etiketi değil, kaçan müşteri belirler.", "Vogolab Ekibi"),
    rt("b5", "<h2>Ajansa sormanız gereken 6 soru</h2><ul><li>Canlı referanslarınızı gezebilir miyim? (Ekran görüntüsü değil, çalışan site)</li><li>Site kimin üzerine kayıtlı olacak — alan adı ve hosting bana mı ait?</li><li>Mobilde hız skoru kaç hedefleniyor?</li><li>İçerikleri kendim güncelleyebilecek miyim, panel eğitimi var mı?</li><li>SEO altyapısı neleri kapsıyor?</li><li>Teslimden sonra revizyon ve destek nasıl işliyor?</li></ul><p>Bu soruların net cevabı yoksa, düşünmek için en meşru sebebe sahipsiniz.</p><h2>Neden Ankara'dan bir ajans?</h2><p>Uzaktan da iyi iş çıkar; ama yerel ajansla keşif toplantısını yüz yüze yapar, gerektiğinde ofise gider, işinizi bilen biriyle aynı saat diliminde çalışırsınız. Üstelik Ankara pazarını tanıyan ekip, 'çayyolu mobilya' ile 'kızılay avukat' aramasının farklı dünyalar olduğunu bilir — SEO ve reklamda bu fark paradır.</p><p>Projenizi konuşmak isterseniz <a href=\"/tr/teklif\">ücretsiz teklif sayfamızdan</a> yazın; <a href=\"/tr/projeler\">Ankara'daki işlerimize</a> de göz atabilirsiniz.</p>"),
  ],
}));
console.log("✅ Ankara rehberi yayında: ankara-web-sitesi-yaptirma-rehberi");
process.exit(0);
