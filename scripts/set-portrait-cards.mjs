import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k",
  authDomain: "brog-1acb3.firebaseapp.com",
  projectId: "brog-1acb3",
  storageBucket: "brog-1acb3.firebasestorage.app",
  messagingSenderId: "370433122581",
  appId: "1:370433122581:web:9092002ef883d620f3c91c",
});
const db = getFirestore(app);

// brandName içinde bu ifadelerden biri geçen projeler → portrait (eski dikey kart)
const PORTRAIT_MATCH = ["Base", "Cihangir", "Çilingir", "Cilingir", "Fouramour"];

const snap = await getDocs(collection(db, "projects"));
for (const d of snap.docs) {
  const data = d.data();
  const name = (data.brandName || data.title || "");
  const isPortrait = PORTRAIT_MATCH.some((m) => name.includes(m));
  if (isPortrait) {
    await updateDoc(doc(db, "projects", d.id), { cardRatio: "portrait", updatedAt: new Date().toISOString() });
    console.log(`✓ portrait: ${name}`);
  }
}
console.log("✅ Tamamlandı");
process.exit(0);
