// X/Dribbble/LinkedIn hesapları mevcut değil (404) — sadece gerçek Instagram kalsın
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const db = getFirestore(app);
async function withRetry(fn, t=10){for(let i=0;i<t;i++){try{return await fn()}catch(e){if(i===t-1)throw e;await new Promise(r=>setTimeout(r,3000))}}}
const patch = { social_x: "", social_dribbble: "", social_linkedin: "", updatedAt: new Date().toISOString() };
await withRetry(() => updateDoc(doc(db, "siteContent", "navbar"), patch));
await withRetry(() => updateDoc(doc(db, "siteContent", "settings"), patch));
console.log("✅ Olmayan sosyal hesaplar temizlendi (Instagram kaldı)");
process.exit(0);
