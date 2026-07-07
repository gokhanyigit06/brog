import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const db = getFirestore(app);
const snap = await getDocs(collection(db, "leads"));
let n = 0;
for (const d of snap.docs) {
  if ((d.data().name || "").startsWith("Form Test")) { await deleteDoc(doc(db, "leads", d.id)); n++; }
}
console.log(`✅ ${n} test lead silindi`);
process.exit(0);
