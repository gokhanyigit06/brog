// Demo vitrini dosyalarını Firebase Storage'a yükler → gs://<kova>/demolar/...
//
// Kullanım:
//   node scripts/demolari-yukle.mjs <yerel-klasor>
//   (ör. node scripts/demolari-yukle.mjs ~/Desktop/ares/deploy/demolar-yayin/site)
//
// Yerel klasör `demo_vitrin.py --yayina-kopyala` ile üretilir; içinde index.html
// ve kayıtlı her demo klasörü bulunur.
//
// KİMLİK: Admin SDK — FIREBASE_SERVICE_ACCOUNT_B64 gerekir (.env.local'da olan
// değişkenin aynısı). İstemci SDK'sı KULLANILAMAZ: storage.rules artık demolar/
// yolunu istemciye tamamen kapatıyor. Bu bilinçli — demoların tek erişim yolu
// vogolab.com/demolar şifre kapısı olmalı.

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import fs from "fs";
import path from "path";

const KOVA = process.env.FIREBASE_STORAGE_BUCKET || "brog-1acb3.firebasestorage.app";
const ONEK = "demolar";
const ESZAMANLI = 8;

const TURLER = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif",
  ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2",
  ".ttf": "font/ttf", ".otf": "font/otf", ".mp4": "video/mp4", ".webm": "video/webm",
};

const kaynak = process.argv[2];
if (!kaynak || !fs.existsSync(path.join(kaynak, "index.html"))) {
  console.error("Kullanım: node scripts/demolari-yukle.mjs <yerel-klasor>");
  console.error("(klasörde index.html bulunmalı — demo_vitrin.py --yayina-kopyala çıktısı)");
  process.exit(1);
}

const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
if (!b64) {
  console.error("FIREBASE_SERVICE_ACCOUNT_B64 tanımlı değil.");
  console.error("Örnek:  export $(grep FIREBASE_SERVICE_ACCOUNT_B64 .env.local | xargs)");
  process.exit(1);
}
const hesap = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: hesap.project_id,
        clientEmail: hesap.client_email,
        privateKey: hesap.private_key,
      }),
    });
const kova = getStorage(app).bucket(KOVA);

function dosyalariTopla(kok, taban = kok) {
  return fs.readdirSync(kok, { withFileTypes: true }).flatMap((g) => {
    const tam = path.join(kok, g.name);
    if (g.isDirectory()) return dosyalariTopla(tam, taban);
    if (g.name === ".DS_Store") return [];
    return [{ tam, bagil: path.relative(taban, tam).split(path.sep).join("/") }];
  });
}

async function tekrarla(fn, kez = 4) {
  for (let i = 0; i < kez; i++) {
    try { return await fn(); }
    catch (e) { if (i === kez - 1) throw e; await new Promise((r) => setTimeout(r, 1500 * (i + 1))); }
  }
}

const dosyalar = dosyalariTopla(kaynak);
const toplamMb = dosyalar.reduce((t, d) => t + fs.statSync(d.tam).size, 0) / 1e6;
console.log(`→ ${dosyalar.length} dosya · ${toplamMb.toFixed(1)} MB → gs://${KOVA}/${ONEK}/`);

let bitti = 0, hata = 0;
for (let i = 0; i < dosyalar.length; i += ESZAMANLI) {
  const kume = dosyalar.slice(i, i + ESZAMANLI);
  await Promise.all(kume.map(async (d) => {
    try {
      await tekrarla(() =>
        kova.upload(d.tam, {
          destination: `${ONEK}/${d.bagil}`,
          metadata: {
            contentType: TURLER[path.extname(d.bagil).toLowerCase()] || "application/octet-stream",
            // "private": kapı arkasındaki içerik ara önbelleklerde paylaşılmasın.
            cacheControl: d.bagil.includes("/_v/")
              ? "private, max-age=31536000, immutable"
              : "private, no-store",
          },
        })
      );
      bitti++;
    } catch (e) {
      hata++;
      console.error(`  ✗ ${d.bagil}: ${e.message}`);
    }
  }));
  if (bitti % 80 < ESZAMANLI) console.log(`   ${bitti}/${dosyalar.length}`);
}
console.log(`✅ yüklendi: ${bitti} · hata: ${hata}`);

// Yerelde olmayan uzak dosyaları sil — kayıttan çıkarılan demo Storage'da kalmasın.
const yereldeVar = new Set(dosyalar.map((d) => `${ONEK}/${d.bagil}`));
const [uzaktakiler] = await kova.getFiles({ prefix: `${ONEK}/` });
let silinen = 0;
for (const nesne of uzaktakiler) {
  if (!yereldeVar.has(nesne.name)) {
    await nesne.delete().catch(() => {});
    console.log(`   − silindi (artık yok): ${nesne.name}`);
    silinen++;
  }
}
console.log(`temizlik tamam · silinen: ${silinen}`);
process.exit(hata > 0 ? 1 : 0);
