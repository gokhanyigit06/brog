import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const db = getFirestore(app);
async function withRetry(fn, t=6){for(let i=0;i<t;i++){try{return await fn()}catch{await new Promise(r=>setTimeout(r,2000))}}throw new Error("fail")}
const snap = await withRetry(() => getDoc(doc(db, "siteContent", "services")));
console.log(snap.exists() ? JSON.stringify(snap.data(), null, 1).slice(0, 3000) : "(doc yok — varsayılanlar kullanılıyor)");
process.exit(0);
