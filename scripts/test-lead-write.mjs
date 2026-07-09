import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const db = getFirestore(app);
try {
  const r = await addDoc(collection(db, "leads"), { name: "DNS Test", phone: "0555", service: "web", source: "test-script", status: "new", createdAt: new Date().toISOString() });
  console.log("yazma OK:", r.id);
} catch (e) { console.log("yazma HATA:", e.message?.slice(0, 200)); }
const snap = await getDocs(query(collection(db, "leads"), orderBy("createdAt", "desc"), limit(3)));
snap.docs.forEach(d => console.log("-", d.data().name, d.data().source, d.data().createdAt));
process.exit(0);
