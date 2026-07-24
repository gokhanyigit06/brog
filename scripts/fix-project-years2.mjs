// Proje yılları düzeltmesi + Alper (iOS Website) ve VogoPos (Mobil Uygulama) etiketleri
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const db = getFirestore(app);
async function withRetry(fn, t = 10) {
  for (let i = 0; i < t; i++) {
    try { return await fn(); } catch (e) { if (i === t - 1) throw e; await new Promise((r) => setTimeout(r, 3000)); }
  }
}

const FIXES = [
  { rx: /acity/i,      year: "2025" },
  { rx: /alper/i,      year: "2026", addTag: "iOS Website" },
  { rx: /alpfine/i,    year: "2026" },
  { rx: /amy/i,        year: "2026" },
  { rx: /dostlar/i,    year: "2026" },
  { rx: /ergu/i,       year: "2025" },
  { rx: /macc/i,       year: "2026" },
  { rx: /mickey/i,     year: "2025" },
  { rx: /neo maison/i, year: "2026" },
  { rx: /sm motors/i,  year: "2025" },
  { rx: /vogopos/i,    year: "2026", addTag: "Mobil Uygulama" },
];

const snap = await withRetry(() => getDocs(collection(db, "projects")));
console.log("proje sayısı:", snap.docs.length);
let updated = 0;
for (const d of snap.docs) {
  const x = d.data();
  const name = String(x.brandName || x.title || "");
  const fix = FIXES.find((f) => f.rx.test(name));
  if (!fix) continue;
  const patch = { year: fix.year, updatedAt: new Date().toISOString() };
  if (fix.addTag && !(x.tags || []).includes(fix.addTag)) patch.tags = [...(x.tags || []), fix.addTag];
  await withRetry(() => updateDoc(doc(db, "projects", d.id), patch));
  updated++;
  console.log("guncellendi: " + name + " | " + x.year + " -> " + fix.year + (fix.addTag ? " (+" + fix.addTag + ")" : ""));
}
console.log("TOPLAM GUNCELLENEN: " + updated);
process.exit(0);
