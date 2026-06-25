import { chromium } from "playwright";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
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

// Sadece bizim eklediğimiz portföy projeleri — slug → URL
const TARGETS = {
  "macc-cino": "https://macc-cino.com",
  "macc-cino-shop": "https://shop.macc-cino.com/tr",
  "neo-maison": "https://neomaison.com.tr",
  "neo-antique": "https://www.neoantique.com",
  "sm-motors": "https://smmotorss.com",
  "mickeys": "https://menu.mickeys.com.tr",
  "ergu-enerji": "https://erguenerji.com",
  "luiffart": "https://luiffart.com",
  "nakablu": "https://nakablu.com",
  "vogopos": "https://vogopos.com",
};

async function upload(filePath, name) {
  const buffer = fs.readFileSync(filePath);
  const r = ref(storage, `projects/listing-${name}-${Date.now()}.jpg`);
  await uploadBytes(r, buffer, { contentType: "image/jpeg" });
  return getDownloadURL(r);
}

// Firestore'dan slug → docId eşlemesi
const snap = await getDocs(collection(db, "projects"));
const slugToId = {};
snap.forEach((d) => {
  const data = d.data();
  if (data.slug && TARGETS[data.slug]) slugToId[data.slug] = d.id;
});

const browser = await chromium.launch();
// Telefon oranı (dikey) — kart oranına yakın, hero alanı net görünür
const ctx = await browser.newContext({ viewport: { width: 600, height: 800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

for (const [slug, url] of Object.entries(TARGETS)) {
  const id = slugToId[slug];
  if (!id) { console.log(`⚠ ${slug}: Firestore'da bulunamadı, atlandı`); continue; }
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(3000);
    try { await page.click("text=Kabul Et", { timeout: 2000 }); await page.waitForTimeout(400); } catch {}
    try { await page.click("text=Kabul", { timeout: 1500 }); await page.waitForTimeout(400); } catch {}
    try { await page.click("[class*='close'], .modal__close, button[aria-label*='close']", { timeout: 1500 }); } catch {}
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    const file = `scripts/listing_${slug}.jpg`;
    await page.screenshot({ path: file, fullPage: false, type: "jpeg", quality: 92 });
    const listingUrl = await upload(file, slug);
    await updateDoc(doc(db, "projects", id), { listingImageUrl: listingUrl, updatedAt: new Date().toISOString() });
    console.log(`✓ ${slug} → listingImageUrl güncellendi`);
  } catch (e) {
    console.log(`✗ ${slug}: ${e.message}`);
  }
}

await browser.close();
console.log("✅ Tamamlandı");
process.exit(0);
