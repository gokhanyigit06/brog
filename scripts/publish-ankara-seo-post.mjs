// "Ankara'da SEO: Yerel İşletmeler İçin Uçtan Uca Rehber" blog yazısını yayınlar (kapak dahil)
import { chromium } from "playwright";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const storage = getStorage(app);
const db = getFirestore(app);
async function withRetry(fn, t=8){for(let i=0;i<t;i++){try{return await fn()}catch{await new Promise(r=>setTimeout(r,2500))}}throw new Error("fail")}

// ── Kapak (markalı şablon) ──
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
    <div><div class="kicker">Ankara · SEO</div><h1>Ankara'da SEO: yerel işletmeler için uçtan uca rehber</h1></div>
    <div class="foot">vogolab.com/blog</div>
  </div>
</body></html>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 750 } });
await p.setContent(coverHtml, { waitUntil: "networkidle" });
await p.screenshot({ path: "scripts/blog_cover_ankara_seo.jpg", type: "jpeg", quality: 92 });
await b.close();
const buf = fs.readFileSync("scripts/blog_cover_ankara_seo.jpg");
const r = ref(storage, `blog/cover-ankara-seo-${Date.now()}.jpg`);
await withRetry(() => uploadBytes(r, buf, { contentType: "image/jpeg" }));
const coverUrl = await withRetry(() => getDownloadURL(r));
console.log("✓ kapak yüklendi");

const now = new Date().toISOString();
const rt = (id, tr) => ({ type: "rich_text", id, content: { tr, en: "" } });
const quote = (id, tr, author) => ({ type: "quote", id, text: { tr, en: "" }, author });

await withRetry(() => setDoc(doc(db, "blog_posts", "ankara-seo-rehberi"), {
  id: "ankara-seo-rehberi",
  slug: "ankara-seo-rehberi",
  title: { tr: "Ankara'da SEO: Yerel İşletmeler İçin Uçtan Uca Rehber", en: "" },
  excerpt: { tr: "Ankara'daki bir işletme Google'da nasıl öne çıkar? İşletme Profili'nden semt bazlı anahtar kelimelere, teknik altyapıdan yorum yönetimine — yerel SEO'nun her adımını sırasıyla anlatıyoruz.", en: "" },
  coverMedia: { type: "image", url: coverUrl },
  tags: ["Ankara", "SEO"],
  author: "Vogolab",
  published: true,
  publishedAt: now,
  createdAt: now,
  updatedAt: now,
  body: [
    rt("b1", "\"Ankara diş kliniği\", \"çayyolu emlak\", \"kızılay avukat\" — müşterileriniz her gün böyle arıyor. O aramalarda ilk sayfada değilseniz, telefonu rakibiniz açıyor demektir.\n\nİyi haber: yerel SEO, genel SEO'ya göre çok daha kazanılabilir bir oyun. Rakipleriniz dünyadaki herkes değil, Ankara'daki birkaç işletme. Bu rehberde sıfırdan, sırasıyla ne yapmanız gerektiğini anlatıyoruz."),
    rt("b2", "<h2>1. Google İşletme Profili: en hızlı kazanç</h2><p>Yerel aramalarda sonuçların en üstünde çıkan harita kutusu (local pack), tıklamaların büyük kısmını alır. Oraya girmenin yolu <strong>Google İşletme Profili</strong>:</p><ul><li>Profili sahiplenin, kategoriyi doğru seçin (birincil kategori sıralamada en etkili sinyaldir).</li><li>Ad, adres, telefon (NAP) bilgilerinin sitenizle <strong>birebir aynı</strong> olduğundan emin olun.</li><li>Gerçek fotoğraflar yükleyin: dış cephe, iç mekân, ekip, işler. Stok görsel değil.</li><li>Haftada bir gönderi paylaşın; soruları cevaplayın. Aktif profil, pasif profili geçer.</li></ul><p>Bu adım ücretsizdir ve çoğu sektörde tek başına gözle görülür fark yaratır.</p>"),
    rt("b3", "<h2>2. Semt ve ilçe bazlı anahtar kelimeler</h2><p>Ankara'da \"web tasarım\" ile \"ankara web tasarım\" farklı yarışlardır; \"çankaya kurumsal web sitesi\" ise bambaşka. Strateji:</p><ul><li><strong>Ana sayfa:</strong> şehir + ana hizmet (\"Ankara web tasarım ajansı\").</li><li><strong>Hizmet sayfaları:</strong> her hizmet için ayrı sayfa, şehirle harmanlanmış başlık ve açıklama.</li><li><strong>İçerik:</strong> semt/ilçe + sektör kombinasyonları için blog yazıları ve SSS'ler. Kızılay, Çankaya, Çayyolu, Etimesgut, Keçiören... her biri ayrı arama hacmi taşır.</li></ul><p>Bir püf noktası: Ankara'nın çevre illeri — Kırıkkale, Bolu, Eskişehir, Konya — çoğu sektörde Ankara'dan hizmet alır. areaServed yapılandırılmış verinizde ve içeriğinizde bu illere de yer verin.</p>"),
    quote("b4", "Yerel SEO'da kazanan, en büyük bütçeli değil; en tutarlı olan işletmedir. Doğru kurulmuş profil + hızlı site + düzenli içerik, altı ayda tablonun tamamını değiştirir.", "Vogolab Ekibi"),
    rt("b5", "<h2>3. Teknik altyapı: hız ve yapılandırılmış veri</h2><p>Google, yavaş ve mobilde bozuk siteleri yerel sonuçlarda da cezalandırır. Kontrol listesi:</p><ul><li>Mobilde 3 saniyenin altında açılış (görselleri optimize edin, gereksiz eklentilerden kurtulun).</li><li><strong>LocalBusiness yapılandırılmış verisi:</strong> adres, telefon, çalışma saatleri, hizmet bölgesi kodda işaretli olsun.</li><li>Her sayfada tekil title/description; şehir adı doğal biçimde geçsin.</li><li>SSL, temiz URL yapısı, XML sitemap ve Search Console kaydı.</li></ul><h2>4. Yorumlar ve itibar</h2><p>Yorum sayısı ve ortalaması, hem sıralama sinyali hem dönüşüm silahıdır. Memnun her müşteriden yorum isteyin — en kolay yöntem, işlem sonrası gönderilen kısa bir mesajla profil linkini paylaşmak. Olumsuz yorumlara sakin ve çözüm odaklı cevap verin; cevabınızı yorumu yazan kişi değil, sonraki 500 potansiyel müşteri okur.</p>"),
    rt("b6", "<h2>5. Ne zaman sonuç alırım?</h2><p>Gerçekçi takvim: İşletme Profili düzenlemeleri 2-4 haftada, site içi iyileştirmeler 1-3 ayda, içerik stratejisi 3-6 ayda etkisini gösterir. SEO bileşik faizle çalışır — reklamın aksine, durduğunuzda birikim kaybolmaz.</p><p>Bu işleri kendi başınıza da yapabilirsiniz; ama teknik altyapı, içerik üretimi ve takibi tek elden yürütecek bir ekip isterseniz <a href=\"/tr/teklif\">ücretsiz teklif sayfamızdan</a> ulaşın. Sürecin nasıl işlediğini merak ediyorsanız <a href=\"/tr/blog/ankara-web-sitesi-yaptirma-rehberi\">Ankara'da web sitesi yaptırma rehberimize</a>, hizmet kapsamına <a href=\"/tr/hizmetler\">hizmetler sayfamıza</a> göz atabilirsiniz.</p>"),
  ],
}));
console.log("✅ Yayında: /tr/blog/ankara-seo-rehberi");
process.exit(0);
