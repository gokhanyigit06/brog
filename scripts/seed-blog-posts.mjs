// İlk 3 blog yazısını yayınlar: kapak görsellerini Playwright ile üretir,
// Storage'a yükler, yazıları blog_posts koleksiyonuna yazar.
import { chromium } from "playwright";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";
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
  throw new Error("firestore/storage erişilemedi");
}

// ── 1) Markalı kapak görselleri (1200×750, koyu + mavi aksan) ──
function coverHtml(kicker, title) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:1200px;height:750px;background:#080808;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#fff;position:relative;overflow:hidden}
    .glow{position:absolute;top:-25%;right:-12%;width:65%;height:95%;background:radial-gradient(circle at center, rgba(37,99,235,0.28) 0%, rgba(0,0,0,0) 70%)}
    .wrap{position:relative;z-index:1;padding:80px 88px;height:100%;display:flex;flex-direction:column;justify-content:space-between}
    .brand{display:flex;align-items:center;gap:14px}
    .mark{width:36px;height:36px}
    .brand span{font-size:24px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase}
    .kicker{display:inline-block;background:#2563eb;color:#fff;border-radius:999px;padding:10px 22px;font-size:20px;font-weight:700;width:fit-content;margin-bottom:28px}
    h1{font-size:72px;font-weight:900;line-height:1.05;letter-spacing:-0.03em;max-width:980px}
    .foot{font-size:20px;color:rgba(255,255,255,0.55)}
  </style></head><body>
    <div class="glow"></div>
    <div class="wrap">
      <div class="brand">
        <svg class="mark" viewBox="0 0 48 48" fill="#fff"><path d="M24 2 L29 19 L46 24 L29 29 L24 46 L19 29 L2 24 L19 19 Z"/></svg>
        <span>Vogolab</span>
      </div>
      <div>
        <div class="kicker">${kicker}</div>
        <h1>${title}</h1>
      </div>
      <div class="foot">vogolab.com/blog</div>
    </div>
  </body></html>`;
}

const COVERS = [
  { key: "web", kicker: "Web Tasarım", title: "Web siteniz neden satış getirmiyor? 7 kritik neden" },
  { key: "ads", kicker: "Dijital Reklam", title: "Google Ads mı, Meta Ads mi? Doğru seçim rehberi" },
  { key: "seo", kicker: "SEO", title: "SEO nedir? İşletmeler için sade bir başlangıç rehberi" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
const coverUrls = {};
for (const c of COVERS) {
  await page.setContent(coverHtml(c.kicker, c.title), { waitUntil: "networkidle" });
  const file = `scripts/blog_cover_${c.key}.jpg`;
  await page.screenshot({ path: file, type: "jpeg", quality: 92 });
  const buffer = fs.readFileSync(file);
  const r = ref(storage, `blog/cover-${c.key}-${Date.now()}.jpg`);
  await withRetry(() => uploadBytes(r, buffer, { contentType: "image/jpeg" }));
  coverUrls[c.key] = await withRetry(() => getDownloadURL(r));
  console.log("✓ kapak:", c.key);
}
await browser.close();

// ── 2) Yazılar ──
const now = new Date().toISOString();
const rt = (id, tr) => ({ type: "rich_text", id, content: { tr, en: "" } });
const quote = (id, tr, author) => ({ type: "quote", id, text: { tr, en: "" }, author });

const POSTS = [
  {
    id: "web-sitesi-satis-getirmiyor",
    slug: "web-siteniz-neden-satis-getirmiyor",
    title: { tr: "Web Siteniz Neden Satış Getirmiyor? 7 Kritik Neden", en: "" },
    excerpt: { tr: "Trafik var ama telefon çalmıyor mu? Yavaş açılış, belirsiz mesaj, mobil deneyim ve güven eksikliği — sitenizi ziyaretçi kaçıran bir broşürden satış makinesine çeviren 7 düzeltmeyi anlattık.", en: "" },
    tags: ["Web Tasarım", "Dönüşüm"],
    cover: coverUrls.web,
    body: [
      rt("b1", "Bir web sitesine sahip olmak ile o siteden müşteri kazanmak arasında büyük bir fark var. Türkiye'de küçük ve orta ölçekli işletmelerin çoğunun bir sitesi var; ama bu sitelerin büyük kısmı yıllardır tek bir teklif talebi bile üretmemiş durumda. Sorun genellikle tek bir yerde değil — birkaç kritik hatanın üst üste binmesinde.\n\nAjans olarak devraldığımız sitelerde en sık gördüğümüz 7 nedeni, çözümleriyle birlikte sıralıyoruz."),
      rt("b2", "<h2>1. Site 3 saniyeden geç açılıyor</h2><p>Ziyaretçilerin yarısı, 3 saniyede açılmayan sayfayı terk eder. Ağır görseller, gereksiz eklentiler ve ucuz hosting birleşince mobilde 8-10 saniyelik açılışlar görüyoruz. Google da yavaş siteleri sıralamada geriye atar — yani hem ziyaretçiyi hem de görünürlüğü aynı anda kaybedersiniz.</p><h2>2. İlk ekranda ne yaptığınız anlaşılmıyor</h2><p>Kullanıcı siteye girdiğinde 5 saniye içinde üç soruya cevap bulmalı: Burası ne yapıyor? Bana ne faydası var? Şimdi ne yapmalıyım? \"Kalite ve güvenin adresi\" gibi genel sloganlar bu soruların hiçbirini cevaplamaz. Net bir başlık + tek bir güçlü buton (teklif al, ara, WhatsApp) çoğu sitede dönüşümü tek başına artırır.</p><h2>3. Mobil deneyim sonradan düşünülmüş</h2><p>Trafiğin %65'ten fazlası mobilden gelir. Masaüstünde güzel görünen ama telefonda kayan, taşan, tıklanamayan bir site; ziyaretçilerin çoğunluğuna kötü deneyim sunuyorsunuz demektir. Tasarıma mobilden başlamak (mobile-first) artık tercih değil, zorunluluk.</p>"),
      rt("b3", "<h2>4. Güven verecek hiçbir şey yok</h2><p>İnsanlar tanımadıkları firmadan alışveriş yapmadan önce kanıt arar: gerçek projeler, müşteri yorumları, rakamlar, ekip. Referanslarınızı saklamayın — ana sayfada gösterin. \"120+ proje\", \"%98 memnuniyet\" gibi somut rakamlar, sayfalarca övgü metninden daha ikna edicidir.</p><h2>5. Tek iletişim yolu: sayfanın en altındaki form</h2><p>Ziyaretçiye tek seçenek sunmayın. Kimi aramak ister, kimi WhatsApp'tan yazmak, kimi form doldurmak. Üçünü de görünür yerde tutun; mobilde sabit bir arama/WhatsApp çubuğu telefonu gerçekten çaldırır.</p><h2>6. Form dolduruluyor ama kimse dönmüyor</h2><p>En acı senaryo: form çalışıyor ama gelen talepler bir e-posta kutusunda kayboluyor — ya da hiç kaydedilmiyor. Taleplerin tek bir panelde toplanması ve aynı gün dönüş yapılması, reklam bütçesinden çok daha ucuz bir büyüme kaldıracıdır.</p><h2>7. Site kurulmuş ve unutulmuş</h2><p>Google, güncellenmeyen siteyi \"terk edilmiş\" sayar. Blog, yeni projeler, güncel kampanyalar — düzenli içerik hem SEO'yu hem güveni besler.</p>"),
      quote("b4", "Web sitesi bir broşür değil, mesai bilmeyen bir satış temsilcisidir. Öyle davranmıyorsa sorun sitededir, pazarda değil.", "Vogolab Ekibi"),
      rt("b5", "<h2>Peki nereden başlamalı?</h2><p>Önce ölçün: siteniz mobilde kaç saniyede açılıyor, ziyaretçiler hangi sayfada ayrılıyor, ayda kaç talep geliyor? Sonra bu listedeki maddeleri tek tek kapatın. Çoğu işletmede ilk üç madde (hız, net mesaj, mobil) düzeltildiğinde talepler görünür şekilde artıyor.</p><p>Sitenizin neden satış getirmediğini birlikte incelememizi isterseniz, <a href=\"/tr/teklif\">ücretsiz teklif sayfamızdan</a> yazın — 24 saat içinde size özel bir değerlendirmeyle dönelim.</p>"),
    ],
  },
  {
    id: "google-ads-mi-meta-ads-mi",
    slug: "google-ads-mi-meta-ads-mi",
    title: { tr: "Google Ads mı, Meta Ads mi? İşletmeniz İçin Doğru Seçim", en: "" },
    excerpt: { tr: "Reklam bütçenizi nereye koymalısınız? Google 'arayan' müşteriyi, Meta 'henüz aramayan' müşteriyi yakalar. Sektörünüze göre doğru kanalı ve bütçe dağılımını net örneklerle anlattık.", en: "" },
    tags: ["Google Ads", "Meta Ads"],
    cover: coverUrls.ads,
    body: [
      rt("b1", "Dijital reklama başlayan her işletmenin ilk sorusu aynı: bütçeyi Google'a mı, Instagram/Facebook'a mı ayırmalı? Doğru cevap \"ikisi de\" değil — doğru cevap, müşterinizin sizi nasıl bulduğuna bağlı. İki platform temelde farklı anlar için çalışır."),
      rt("b2", "<h2>Google Ads: sizi zaten arayan müşteri</h2><p>Google'da reklam, niyetin olduğu yerde görünür. \"Ankara kombi servisi\", \"e-ticaret sitesi fiyatları\" yazan kişi o hizmeti şimdi istiyor. Bu yüzden Google Ads'in gücü, talebi yakalamaktır.</p><ul><li>Acil ihtiyaç hizmetleri (servis, tamir, hukuk, sağlık) için ilk tercih</li><li>Arama hacmi olan ürün/hizmetlerde en hızlı sonuç</li><li>Shopping kampanyalarıyla e-ticarette ürünü doğrudan vitrine koyar</li></ul><p>Zayıf yanı: kimse aramıyorsa gösterilecek kimse yoktur. Yeni ve bilinmeyen bir ürünü Google aramasıyla büyütmek zordur.</p><h2>Meta Ads: henüz aramayan ama alacak müşteri</h2><p>Instagram ve Facebook, talep yaratma platformudur. Kullanıcı bir şey aramıyor; akışında gezerken doğru görselle durduruyorsunuz. Bu yüzden Meta'nın gücü görsel hikaye ve hedeflemedir.</p><ul><li>Moda, dekorasyon, takı, yeme-içme gibi görsel sektörlerde çok güçlü</li><li>Ürün kataloğu reklamlarıyla e-ticarette site ziyaretçisini geri getirir (retargeting)</li><li>Yeni marka ve ürün lansmanlarında bilinirliği hızlı kurar</li></ul><p>Zayıf yanı: alıcı niyeti daha düşüktür; kreatif (görsel/video) kötüyse bütçe hızla erir.</p>"),
      rt("b3", "<h2>Sektörünüze göre pratik başlangıç</h2><p><strong>Yerel hizmet</strong> (klinik, servis, avukat): %70 Google, %30 Meta. Aramayı yakala, bölgesel bilinirliği Meta ile destekle.</p><p><strong>E-ticaret</strong>: %50 Meta (katalog + retargeting), %50 Google Shopping. İkisi birbirini besler — Meta tanıtır, Google satın alma anını yakalar.</p><p><strong>B2B / kurumsal</strong>: %60 Google (sektörel aramalar), %40 LinkedIn/Meta ile karar vericilere görünürlük.</p><p><strong>Restoran / kafe</strong>: %80 Meta. İnsanlar restoranı Instagram'da keşfeder; Google tarafında haritalar (işletme profili) yeterli başlangıçtır.</p>"),
      quote("b4", "Kanal tartışması bütçeyi büyütmez; ölçüm tartışması büyütür. Hangi kanaldan kaç talep geldiğini bilmiyorsanız, hangisinin iyi olduğunu da bilemezsiniz.", "Vogolab Ekibi"),
      rt("b5", "<h2>Hangisini seçerseniz seçin: 3 kural</h2><p>1) <strong>Dönüşüm takibi olmadan reklam açmayın.</strong> Piksel ve dönüşüm eventi kurulmadan harcanan her lira ölçüsüz harcamadır.</p><p>2) <strong>Reklamı iyi bir siteye gönderin.</strong> Yavaş, karışık bir açılış sayfası en iyi kampanyayı bile çöpe çevirir.</p><p>3) <strong>İlk ay test ayıdır.</strong> Küçük bütçeyle 2-3 varyasyon deneyin, veriye göre kazanana yüklenin.</p><p>Reklam hesabınızı ücretsiz değerlendirmemizi isterseniz <a href=\"/tr/teklif\">buradan ulaşın</a> — mevcut kampanyalarınızı inceleyip nerede bütçe kaçtığını gösterelim.</p>"),
    ],
  },
  {
    id: "seo-nedir-baslangic-rehberi",
    slug: "seo-nedir-isletmeler-icin-baslangic-rehberi",
    title: { tr: "SEO Nedir? İşletmeler İçin Sade Bir Başlangıç Rehberi", en: "" },
    excerpt: { tr: "SEO'yu teknik jargona boğmadan anlattık: Google nasıl sıralar, teknik SEO–içerik–otorite üçlüsü ne demek, ilk 90 günde ne yapılır ve ajanstan ne beklemelisiniz.", en: "" },
    tags: ["SEO", "Rehber"],
    cover: coverUrls.seo,
    body: [
      rt("b1", "SEO (arama motoru optimizasyonu), insanlar sizinle ilgili bir şey aradığında Google'da reklamsız görünmenizi sağlayan çalışmaların tamamıdır. Reklamdan farkı şu: reklam bütçe bittiği an durur, SEO ise doğru yapıldığında yıllarca çalışan bir varlığa dönüşür.\n\nBu rehber, teknik bilgisi olmayan işletme sahipleri için yazıldı."),
      rt("b2", "<h2>Google sizi nasıl sıralıyor?</h2><p>Basitleştirirsek Google üç soru sorar:</p><ul><li><strong>Siteni okuyabiliyor muyum?</strong> (Teknik SEO — hız, mobil uyum, doğru başlık yapısı, site haritası)</li><li><strong>Aranan soruya gerçekten cevap veriyor musun?</strong> (İçerik — doğru anahtar kelimelerde, doyurucu sayfalar)</li><li><strong>Sana güvenebilir miyim?</strong> (Otorite — başka sitelerden aldığın bağlantılar, marka sinyalleri, kullanıcı deneyimi)</li></ul><p>Üçü birden gerekir. Teknik olarak kusursuz ama içeriği boş bir site de, harika içerikli ama 10 saniyede açılan bir site de sıralanmaz.</p><h2>İşletmeler için en sık yanılgılar</h2><p><strong>\"SEO bir kere yapılır, biter.\"</strong> Hayır — rakipler ve Google sürekli değişir; SEO düzenli bakım ister.</p><p><strong>\"Ne kadar çok anahtar kelime, o kadar iyi.\"</strong> Aynı sayfaya 30 kelime doldurmak 2010'da kaldı; bugün her önemli konu için ayrı, kaliteli bir sayfa gerekir.</p><p><strong>\"Birinci sıra garantisi.\"</strong> Kimse garanti veremez. Garanti vaat eden ajanstan uzak durun.</p>"),
      rt("b3", "<h2>İlk 90 günde ne yapılır?</h2><p><strong>1. Ay — Teknik temel:</strong> hız optimizasyonu, mobil uyum, site haritası ve robots dosyası, sayfa başlıkları/açıklamaları, yapılandırılmış veri (schema).</p><p><strong>2. Ay — İçerik iskeleti:</strong> hizmet sayfalarının aranan kelimelere göre yeniden yazılması, ilk blog içerikleri, Google İşletme Profili'nin düzenlenmesi (yerel arama için kritik).</p><p><strong>3. Ay — Ölçüm ve genişleme:</strong> Search Console verisiyle hangi kelimelerde göründüğünüzü izleyip içerik takvimini buna göre büyütmek.</p><p>Gerçekçi beklenti: ilk anlamlı hareketler 2-3 ayda, belirgin trafik artışı 4-6 ayda gelir. SEO maraton; ama kazandığı pozisyonu reklam gibi her ay yeniden satın almazsınız.</p>"),
      quote("b4", "Reklam kiralık evdir, SEO tapulu ev. İkisi birlikte en güçlüsü — ama uzun vadede sizi rakiplerinizden ayıran, tapulu olandır.", "Vogolab Ekibi"),
      rt("b5", "<h2>Ajanstan ne beklemelisiniz?</h2><p>Şeffaf raporlama (hangi kelimede kaçıncı sıradasınız, organik trafik nereye gidiyor), yapılan işlerin net listesi ve gerçekçi hedefler. \"Her şey yolunda\" diyen ama rakam göstermeyen rapor, rapor değildir.</p><p>Sitenizin mevcut SEO durumunu merak ediyorsanız <a href=\"/tr/teklif\">ücretsiz ön analiz</a> için yazın — teknik durumunuzu ve en hızlı kazanım fırsatlarınızı çıkaralım.</p>"),
    ],
  },
];

for (const p of POSTS) {
  await withRetry(() => setDoc(doc(db, "blog_posts", p.id), {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverMedia: { type: "image", url: p.cover },
    body: p.body,
    tags: p.tags,
    author: "Vogolab",
    published: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  }));
  console.log("✓ yazı yayında:", p.slug);
}

console.log("✅ 3 blog yazısı yayınlandı");
process.exit(0);
