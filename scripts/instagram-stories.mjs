// Öne çıkanların İÇ görselleri — 1080x1920 story'ler, marka diliyle
// islerimiz: Firestore projelerinden otomatik; digerleri sabit içerik
import { chromium } from "playwright";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import fs from "fs";

const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const db = getFirestore(app);
async function withRetry(fn, t=8){for(let i=0;i<t;i++){try{return await fn()}catch(e){if(i===t-1)throw e;await new Promise(r=>setTimeout(r,2500))}}}

const OUT = "instagram/stories";
const VG = fs.readFileSync("public/vogolab-vg-mark-white.svg", "utf-8").replace(/"/g, "'");

const BASE_CSS = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1920px;background:#080808;font-family:-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#fff;position:relative;overflow:hidden}
  .glow{position:absolute;top:-14%;right:-22%;width:90%;height:56%;background:radial-gradient(circle at center, rgba(37,99,235,0.24) 0%, rgba(0,0,0,0) 66%)}
  .glow2{position:absolute;bottom:-20%;left:-24%;width:80%;height:50%;background:radial-gradient(circle at center, rgba(37,99,235,0.10) 0%, rgba(0,0,0,0) 70%)}
  .wrap{position:relative;z-index:1;height:100%;padding:230px 90px 210px;display:flex;flex-direction:column}
  .brand{display:flex;align-items:center;gap:18px;justify-content:center}
  .brand .mark{height:52px}.brand .mark svg{width:auto;height:100%}
  .brand span{font-size:28px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase}
  .mid{flex:1;display:flex;flex-direction:column;justify-content:center}
  .center{align-items:center;text-align:center}
  .kicker{display:inline-block;background:#2563eb;color:#fff;border-radius:999px;padding:16px 34px;font-size:28px;font-weight:800;width:fit-content;margin-bottom:48px}
  h1{font-size:88px;font-weight:900;line-height:1.04;letter-spacing:-0.03em}
  .body{margin-top:44px;font-size:38px;line-height:1.55;color:rgba(255,255,255,0.82)}
  .body b{color:#fff}
  .pills{margin-top:52px;display:flex;flex-wrap:wrap;gap:16px}
  .pill{border:2px solid rgba(255,255,255,0.28);border-radius:999px;padding:14px 30px;font-size:27px;font-weight:600;color:rgba(255,255,255,0.85)}
  .pill.on{background:#2563eb;border-color:#2563eb;color:#fff}
  .foot{display:flex;justify-content:space-between;font-size:26px;color:rgba(255,255,255,0.5)}
  .foot .a{color:#2563eb;font-weight:700}
  /* proje story */
  .browser{width:100%;border-radius:24px;overflow:hidden;background:#111;border:1px solid rgba(255,255,255,0.12);box-shadow:0 40px 90px -30px rgba(0,0,0,0.8)}
  .chrome{display:flex;align-items:center;gap:12px;background:#1a1a1a;padding:20px 26px}
  .dot{width:16px;height:16px;border-radius:50%;background:#3a3a3a}
  .domain{margin-left:12px;background:#0d0d0d;border-radius:999px;padding:10px 26px;font-size:24px;color:rgba(255,255,255,0.6)}
  .shot{width:100%;aspect-ratio:16/11;object-fit:cover;object-position:top;display:block}
  .pname{margin-top:64px;font-size:72px;font-weight:900;letter-spacing:-0.02em;line-height:1.05}
  .pmeta{margin-top:22px;font-size:30px;color:rgba(255,255,255,0.6)}
  .pmeta b{color:#2563eb;font-weight:700}
  /* yorum */
  .quote{font-size:56px;font-weight:700;line-height:1.4;letter-spacing:-0.01em}
  .qmark{font-size:140px;color:#2563eb;font-weight:900;line-height:0.6;margin-bottom:36px}
  .qwho{margin-top:56px;font-size:32px}.qwho b{color:#fff}.qwho span{color:rgba(255,255,255,0.55)}
  .stars{margin-top:20px;font-size:40px;color:#2563eb;letter-spacing:6px}
`;

function shell(inner, { center = false, footRight = "Ankara, Türkiye" } = {}) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}</style></head><body>
  <div class="glow"></div><div class="glow2"></div>
  <div class="wrap">
    <div class="brand"><div class="mark">${VG}</div><span>Vogolab</span></div>
    <div class="mid${center ? " center" : ""}">${inner}</div>
    <div class="foot"><span>vogolab.com</span><span class="a">${footRight}</span></div>
  </div></body></html>`;
}

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });

async function shoot(html, path, waitImgs = false) {
  await p.setContent(html, { waitUntil: "networkidle" });
  if (waitImgs) {
    await p.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), { timeout: 45000 }).catch(() => {});
    await p.waitForTimeout(400);
  }
  await p.screenshot({ path, type: "jpeg", quality: 92 });
  console.log("✓", path.replace(OUT + "/", ""));
}

/* ── 1) İŞLERİMİZ — Firestore projelerinden ── */
fs.mkdirSync(`${OUT}/islerimiz`, { recursive: true });
const snap = await withRetry(() => getDocs(query(collection(db, "projects"), orderBy("order", "asc"))));
const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((x) => x.imageUrl);
for (const pr of projects) {
  const name = (pr.brandName || pr.title || "").split(/[–—]/)[0].trim();
  const domain = (pr.link || "").replace(/^https?:\/\//, "").replace(/\/$/, "") || "vogolab.com";
  const cat = pr.industry_tr || pr.category || "";
  const slug = (pr.slug && !pr.slug.includes(".")) ? pr.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  // Özel ibareler (iOS Website, Mobil Uygulama) meta satırında görünsün
  const extra = (pr.tags || []).filter((t) => ["iOS Website", "Mobil Uygulama"].includes(t)).join(" · ");
  const inner = `
    <div class="browser">
      <div class="chrome"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="domain">${domain}</div></div>
      <img class="shot" src="${pr.imageUrl}" />
    </div>
    <div class="pname">${name}</div>
    <div class="pmeta"><b>${cat}</b> · ${pr.year || ""}${extra ? " · <b>" + extra + "</b>" : ""} · Vogolab imzalı</div>`;
  await shoot(shell(inner, { footRight: "Detay: vogolab.com/tr/projeler" }), `${OUT}/islerimiz/${slug}.jpg`, true);
}

/* ── 2) HİZMETLER (4) ── */
fs.mkdirSync(`${OUT}/hizmetler`, { recursive: true });
const HIZMETLER = [
  { f: "1-web", k: "Web Tasarım & Geliştirme", h: "İşletmenizin en çok çalışan elemanı: web siteniz.", body: "Markanıza özel tasarlanır, sıfırdan kodlanır, <b>satışa dönüşecek şekilde</b> kurulur.", pills: ["Özel Tasarım", "Mobil Öncelikli", "Yüksek Hız", "Yönetim Paneli"] },
  { f: "2-reklam", k: "Reklam Yönetimi", h: "Bütçeniz gidere değil, yatırıma dönüşsün.", body: "Meta &amp; Google reklamlarınız <b>ROAS odaklı</b> yönetilir: doğru kitle, doğru kreatif, sürekli optimizasyon.", pills: ["Meta Ads", "Google Ads", "Retargeting", "Dönüşüm Takibi"] },
  { f: "3-seo", k: "SEO & Yerel SEO", h: "Reklam durunca kaybolmayın.", body: "Teknik altyapıdan içeriğe uçtan uca SEO. <b>“Ankara + sektörünüz”</b> aramalarında kalıcı görünürlük.", pills: ["Teknik SEO", "Yerel SEO", "İçerik", "Raporlama"] },
  { f: "4-marka", k: "Marka & Kreatif", h: "Her temas noktasında aynı his.", body: "Logodan sosyal medyaya, QR menüden kişisel markaya — <b>tutarlı görsel dil</b>.", pills: ["Marka Kimliği", "Logo", "Sosyal Medya", "QR Menü"] },
];
for (const s of HIZMETLER) {
  const inner = `<div class="kicker">${s.k}</div><h1>${s.h}</h1><div class="body">${s.body}</div>
    <div class="pills">${s.pills.map((x, i) => `<div class="pill${i === 0 ? " on" : ""}">${x}</div>`).join("")}</div>`;
  await shoot(shell(inner, { footRight: "Teklif: vogolab.com/tr/teklif" }), `${OUT}/hizmetler/${s.f}.jpg`);
}

/* ── 3) SÜREÇ (4) ── */
fs.mkdirSync(`${OUT}/surec`, { recursive: true });
const SUREC = [
  { f: "1-kesif", k: "Adım 1 — Keşif & Strateji", h: "Önce dinleriz.", body: "İşinizi, rakiplerinizi ve müşterinizi tanırız. Ankara'daysanız <b>yüz yüze</b> keşif toplantısı yaparız." },
  { f: "2-uretim", k: "Adım 2 — Tasarım & Geliştirme", h: "Markanıza özel üretiriz.", body: "Tasarımı önce konuşur, sonra kodlarız. <b>“Beğenmedim” bu aşamada ucuzdur.</b>" },
  { f: "3-lansman", k: "Adım 3 — Reklam & Lansman", h: "Yayına birlikte çıkarız.", body: "Panel eğitimi, Search Console, dönüşüm takibi… <b>Ölçemediğimiz şeye para harcatmayız.</b>" },
  { f: "4-buyume", k: "Adım 4 — Ölçüm & Büyüme", h: "Rakamla konuşuruz.", body: "Haftalık optimizasyon, aylık net rapor: <b>harcama, talep, satış.</b> Lansmanla bitmez." },
];
for (const s of SUREC) {
  const inner = `<div class="kicker">${s.k}</div><h1>${s.h}</h1><div class="body">${s.body}</div>`;
  await shoot(shell(inner), `${OUT}/surec/${s.f}.jpg`);
}

/* ── 4) SSS (6) ── */
fs.mkdirSync(`${OUT}/sss`, { recursive: true });
const SSS = [
  { f: "1-sure", q: "Web sitesi ne kadar sürede hazır olur?", a: "Kurumsal site <b>4-8 hafta</b>, e-ticaret <b>8-12 hafta</b>. “Üç güne teslim” vaadi genelde şablon demektir." },
  { f: "2-fiyat", q: "Fiyatı ne belirler?", a: "Özel tasarım mı şablon mu, e-ticaret gibi işlevler, içerik ve SEO kapsamı. Teklifleri fiyattan değil <b>kapsam listesinden</b> karşılaştırın." },
  { f: "3-panel", q: "Siteyi kendim güncelleyebilir miyim?", a: "Evet. Her proje <b>size özel yönetim paneliyle</b> ve eğitimiyle teslim edilir — bize bağımlı kalmazsınız." },
  { f: "4-seo", q: "SEO'dan ne zaman sonuç alırım?", a: "Teknik düzeltmeler <b>1-3 ayda</b>, içerik stratejisi <b>3-6 ayda</b> etkisini gösterir. “Bir haftada birinci sayfa” diyenden kaçın." },
  { f: "5-butce", q: "Reklam bütçem ne olmalı?", a: "Sektöre ve hedefe göre değişir. İlk görüşmede işinize özel <b>gerçekçi bir aralık</b> söyleriz — görüşme ücretsiz." },
  { f: "6-hesap", q: "Reklam hesabı kimin üzerine olur?", a: "<b>Sizin.</b> Biz yetkili olarak yönetiriz; ayrılsanız bile geçmiş veriniz sizde kalır." },
];
for (const s of SSS) {
  const inner = `<div class="kicker">Sık Sorulan</div><h1 style="font-size:72px">${s.q}</h1><div class="body">${s.a}</div>`;
  await shoot(shell(inner, { footRight: "Sorun: DM ya da vogolab.com" }), `${OUT}/sss/${s.f}.jpg`);
}

/* ── 5) BİZ (3) ── */
fs.mkdirSync(`${OUT}/biz`, { recursive: true });
const BIZ = [
  { f: "1-merhaba", k: "Merhaba 👋", h: "Ankara'dan markaları dijitalde büyütüyoruz.", body: "Web sitesi, reklam ve SEO — üçü de <b>tek ekipten</b>, tek stratejiyle." },
  { f: "2-masa", k: "Bizi farklı kılan", h: "Üç disiplin, tek masa.", body: "Sitenizi kuran ekip ile reklamınızı yöneten ekip aynı masada oturur. <b>Strateji kopmaz, sonuç hızlanır.</b>" },
  { f: "3-isler", k: "Deneyim", h: "20+ proje, her sektörden.", body: "E-ticaretten kurumsala, otelden restorana. Her projede aynı soru: <b>müşteriye ölçülebilir ne kazandıracak?</b>" },
];
for (const s of BIZ) {
  const inner = `<div class="kicker">${s.k}</div><h1>${s.h}</h1><div class="body">${s.body}</div>`;
  await shoot(shell(inner), `${OUT}/biz/${s.f}.jpg`);
}

/* ── 6) YORUMLAR (1 gerçek + şablon olarak kullanılabilir) ── */
fs.mkdirSync(`${OUT}/yorumlar`, { recursive: true });
const innerQ = `<div class="qmark">“</div>
  <div class="quote">Web sitemizi, reklamlarımızı ve SEO'muzu tek bir ekibe emanet etmek işimizi inanılmaz kolaylaştırdı. Hem tasarım hem de gelen talep sayısı beklentimizin çok üzerinde.</div>
  <div class="stars">★★★★★</div>
  <div class="qwho"><b>Fulya Kale</b> <span>· Neo Maison &amp; Neo Antique</span></div>`;
await shoot(shell(innerQ, { footRight: "Siz de başlayın: vogolab.com/tr/teklif" }), `${OUT}/yorumlar/1-fulya-kale.jpg`);

await b.close();
console.log("✅ Story'ler hazır:", OUT);
process.exit(0);
