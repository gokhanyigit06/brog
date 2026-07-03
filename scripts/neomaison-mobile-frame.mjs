import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k",
  authDomain: "brog-1acb3.firebaseapp.com",
  projectId: "brog-1acb3",
  storageBucket: "brog-1acb3.firebasestorage.app",
  messagingSenderId: "370433122581",
  appId: "1:370433122581:web:9092002ef883d620f3c91c",
});
const db = getFirestore(app);
const PROJECT_ID = "sKHyiDunIwnOK1Ryty8b";
const SITE = "https://neomaison.com.tr";

async function withRetry(fn, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } catch (e) { console.log("dene", i + 1, e.code || e.message); await new Promise(r => setTimeout(r, 2500)); }
  }
  throw new Error("başarısız");
}

const snap = await withRetry(() => getDoc(doc(db, "projects", PROJECT_ID)));
const data = snap.data();
const blocks = data.blocks || [];

// 9:16 tek görselleri (mobil) topla, yerlerine tek mobile_preview koy
const mobileUrls = [];
let insertAt = -1;
const out = [];
blocks.forEach((b) => {
  if (b.type === "single_image" && b.ratio === "9:16") {
    if (insertAt === -1) insertAt = out.length;
    if (b.url) mobileUrls.push(b.url);
  } else {
    out.push(b);
  }
});

if (mobileUrls.length === 0) {
  console.log("9:16 mobil görsel bulunamadı — değişiklik yok.");
  process.exit(0);
}

const mp = {
  type: "mobile_preview",
  count: Math.min(mobileUrls.length, 3),
  phones: mobileUrls.slice(0, 3).map((u) => ({ imageUrl: u, url: SITE })),
};
out.splice(insertAt === -1 ? out.length : insertAt, 0, mp);

await withRetry(() => updateDoc(doc(db, "projects", PROJECT_ID), { blocks: out, updatedAt: new Date().toISOString() }));
console.log(`✅ ${mobileUrls.length} mobil görsel telefon çerçevesine alındı (mobile_preview, count=${mp.count})`);
process.exit(0);
