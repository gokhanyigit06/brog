import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const db = getFirestore(app);
async function withRetry(fn, t=8){for(let i=0;i<t;i++){try{return await fn()}catch{await new Promise(r=>setTimeout(r,2500))}}throw new Error("fail")}

const items = [
  { id: "v1", projectId: "Vjy0XLBslCccmq5iK09L", coverUrl: "", order: 0 }, // Acity
  { id: "v2", projectId: "1Y8FRNNOJPq8VuXFnmSA", coverUrl: "", order: 1 }, // Alpfine
  { id: "v3", projectId: "hiqy5TZdTVLnTpv8XIuu", coverUrl: "", order: 2 }, // Woodiko
  { id: "v4", projectId: "sKHyiDunIwnOK1Ryty8b", coverUrl: "", order: 3 }, // Neo Maison
  { id: "v5", projectId: "ZsQDoEbfgGuIstQTNlBn", coverUrl: "", order: 4 }, // Fouramour
  { id: "v6", projectId: "jwBL2Yo4f2zrl2OWdMLN", coverUrl: "", order: 5 }, // Base
];

await withRetry(() => setDoc(doc(db, "siteContent", "teklifShowcase"), {
  label: "Referanslar",
  title_tr: "Seçili işlerimiz",
  items,
  updatedAt: new Date().toISOString(),
}));
console.log("✅ Vitrin: Acity, Alpfine, Woodiko, Neo Maison, Fouramour, Base");
process.exit(0);
