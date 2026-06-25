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

// Bizim eklediğimiz, dikey listing görseliyle bozulan projeler
const SLUGS = [
  "macc-cino", "macc-cino-shop", "neo-maison", "neo-antique", "sm-motors",
  "mickeys", "ergu-enerji", "luiffart", "nakablu", "vogopos",
];

const snap = await getDocs(collection(db, "projects"));
for (const d of snap.docs) {
  const data = d.data();
  if (!SLUGS.includes(data.slug)) continue;
  // listingImageUrl'i temizle → kartlar landscape imageUrl (hero) kullanır
  await updateDoc(doc(db, "projects", d.id), {
    listingImageUrl: "",
    updatedAt: new Date().toISOString(),
  });
  console.log(`✓ ${data.slug} → listingImageUrl temizlendi (landscape hero kullanılacak)`);
}
console.log("✅ Tamamlandı");
process.exit(0);
