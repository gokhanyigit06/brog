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

const snap = await getDocs(collection(db, "projects"));
let id = null;
snap.forEach((d) => { if (d.data().slug === "luiffart") id = d.id; });
if (!id) { console.log("luiffart bulunamadı"); process.exit(1); }

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 600, height: 800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

await page.goto("https://luiffart.com", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(4000); // popup'ın açılmasını bekle
// Popup kapatma — birden fazla yöntem
for (const sel of ["text=No thanks", "text=No, thanks", "[aria-label*='close' i]", "[aria-label*='Close' i]", "button.close", ".modal__close", "[class*='popup'] [class*='close']"]) {
  try { await page.click(sel, { timeout: 1500 }); await page.waitForTimeout(500); break; } catch {}
}
await page.keyboard.press("Escape").catch(() => {});
await page.waitForTimeout(1000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);

await page.screenshot({ path: "scripts/listing_luiffart.jpg", fullPage: false, type: "jpeg", quality: 92 });

const buffer = fs.readFileSync("scripts/listing_luiffart.jpg");
const r = ref(storage, `projects/listing-luiffart-${Date.now()}.jpg`);
await uploadBytes(r, buffer, { contentType: "image/jpeg" });
const url = await getDownloadURL(r);
await updateDoc(doc(db, "projects", id), { listingImageUrl: url, updatedAt: new Date().toISOString() });

await browser.close();
console.log("✓ luiffart listingImageUrl güncellendi");
process.exit(0);
