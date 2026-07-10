import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const db = getFirestore(app);
async function withRetry(fn, t=10){for(let i=0;i<t;i++){try{return await fn()}catch(e){if(i===t-1)throw e;await new Promise(r=>setTimeout(r,3000))}}}
const snap = await withRetry(() => getDocs(collection(db, "projects")));
for (const d of snap.docs) {
  const x = d.data();
  if (/macc/i.test(x.brandName || x.title || "")) {
    console.log(`── ${x.brandName} [${d.id}]`);
    console.log(`   slug: ${x.slug} | order: ${x.order} | featured: ${x.featured} | year: ${x.year}`);
    console.log(`   category: ${x.category} | tags: ${(x.tags||[]).join(", ")}`);
    console.log(`   blok sayısı: ${(x.blocks||[]).length} | blok tipleri: ${(x.blocks||[]).map(b=>b.type).join(", ")}`);
    console.log(`   link: ${x.link}`);
  }
}
process.exit(0);
