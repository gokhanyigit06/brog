import { chromium } from "playwright";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Mevcut proje kaydını bul
const app = initializeApp({
  apiKey: "AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k",
  authDomain: "brog-1acb3.firebaseapp.com",
  projectId: "brog-1acb3",
  storageBucket: "brog-1acb3.firebasestorage.app",
  messagingSenderId: "370433122581",
  appId: "1:370433122581:web:9092002ef883d620f3c91c",
});
const db = getFirestore(app);
const snap = await getDocs(collection(db, "projects"));
snap.forEach((d) => {
  const data = d.data();
  if ((data.slug === "neo-maison") || /neo\s*maison/i.test(data.brandName || "")) {
    console.log("=== MEVCUT KAYIT ===");
    console.log("id:", d.id);
    console.log("brandName:", data.brandName);
    console.log("slug:", data.slug);
    console.log("link:", data.link);
    console.log("blok sayısı:", (data.blocks || []).length);
  }
});

// Yeni siteyi incele
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("https://neomaison.com.tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3500);

const text = await page.evaluate(() => document.body.innerText);
console.log("\n=== SAYFA METNİ (ilk 1800) ===");
console.log(text.slice(0, 1800));

const links = await page.$$eval("a", (els) =>
  [...new Set(els.map((e) => e.getAttribute("href")).filter(Boolean).filter((h) => !h.startsWith("#")))].slice(0, 35)
);
console.log("\n=== LİNKLER ===");
console.log(links.join("\n"));

await page.screenshot({ path: "scripts/nm_new_hero.jpg", type: "jpeg", quality: 88 });
console.log("\nhero screenshot: scripts/nm_new_hero.jpg");
await browser.close();
process.exit(0);
