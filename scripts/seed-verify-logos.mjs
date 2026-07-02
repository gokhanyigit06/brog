import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDocs, query, orderBy } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k",
  authDomain: "brog-1acb3.firebaseapp.com",
  projectId: "brog-1acb3",
  storageBucket: "brog-1acb3.firebasestorage.app",
  messagingSenderId: "370433122581",
  appId: "1:370433122581:web:9092002ef883d620f3c91c",
});
const db = getFirestore(app);

const mode = process.argv[2]; // "seed" | "clear"

if (mode === "clear") {
  await setDoc(doc(db, "siteContent", "clientLogos"), { logos: [], updatedAt: new Date().toISOString() });
  console.log("✅ logolar temizlendi (boş)");
  process.exit(0);
}

// Geçici doğrulama: mevcut proje kapak görsellerini logo gibi kullan
const snap = await getDocs(query(collection(db, "projects"), orderBy("order", "asc")));
const logos = snap.docs.slice(0, 6).map((d, i) => {
  const p = d.data();
  return { id: "t" + i, name: (p.brandName || p.title || "").split(/[–—]/)[0].trim(), logoUrl: p.imageUrl || "", order: i };
}).filter((l) => l.logoUrl);

await setDoc(doc(db, "siteContent", "clientLogos"), { logos, updatedAt: new Date().toISOString() });
console.log(`✅ ${logos.length} test logo eklendi`);
process.exit(0);
