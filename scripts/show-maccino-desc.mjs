import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const db = getFirestore(app);
async function withRetry(fn, t=10){for(let i=0;i<t;i++){try{return await fn()}catch(e){if(i===t-1)throw e;await new Promise(r=>setTimeout(r,3000))}}}
for (const id of ["m24rMHba4wtmc556rh2Y", "7Z2gUZxoXfBdPN4ih6Mq"]) {
  const s = await withRetry(() => getDoc(doc(db, "projects", id)));
  const x = s.data();
  console.log(`── ${x.brandName}`);
  console.log("desc_tr:", x.description_tr);
  console.log("ilk text_block başlıkları:", (x.blocks||[]).filter(b=>b.type==="text_block").map(b=>b.title_tr).join(" || "));
}
process.exit(0);
