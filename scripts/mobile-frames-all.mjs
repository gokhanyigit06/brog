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
const MODE = process.argv[2] || "scan"; // "scan" | "apply"

async function withRetry(fn, tries = 8) {
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } catch (e) { await new Promise(r => setTimeout(r, 2500)); }
  }
  throw new Error("firestore erişilemedi");
}

// Ardışık 9:16 single_image'leri mobile_preview'a (max 3'lük gruplar) çevirir
function transform(blocks, link) {
  const out = [];
  let i = 0, changed = false;
  while (i < blocks.length) {
    const b = blocks[i];
    const isMobileFlat = b?.type === "single_image" && b?.ratio === "9:16" && b?.url;
    if (isMobileFlat) {
      const run = [];
      while (i < blocks.length && blocks[i]?.type === "single_image" && blocks[i]?.ratio === "9:16" && blocks[i]?.url) {
        run.push(blocks[i].url); i++;
      }
      for (let j = 0; j < run.length; j += 3) {
        const chunk = run.slice(j, j + 3);
        out.push({ type: "mobile_preview", count: chunk.length, phones: chunk.map((u) => ({ imageUrl: u, url: link || "" })) });
      }
      changed = true;
    } else {
      out.push(b); i++;
    }
  }
  return { out, changed };
}

const snap = await withRetry(() => getDocs(collection(db, "projects")));
let total = 0;
for (const d of snap.docs) {
  const data = d.data();
  const blocks = data.blocks || [];
  const flatCount = blocks.filter((b) => b.type === "single_image" && b.ratio === "9:16" && b.url).length;
  const hasMobilePreview = blocks.some((b) => b.type === "mobile_preview");
  if (flatCount === 0) {
    console.log(`—  ${data.brandName || d.id}: 9:16 mobil yok ${hasMobilePreview ? "(zaten mobile_preview var)" : ""}`);
    continue;
  }
  const { out, changed } = transform(blocks, data.link);
  const mpAdded = out.filter((b) => b.type === "mobile_preview").length - blocks.filter((b) => b.type === "mobile_preview").length;
  console.log(`${MODE === "apply" ? "✎" : "•"} ${data.brandName || d.id}: ${flatCount} düz mobil → ${mpAdded} telefon mockup bloğu`);
  if (MODE === "apply" && changed) {
    await withRetry(() => updateDoc(doc(db, "projects", d.id), { blocks: out, updatedAt: new Date().toISOString() }));
    console.log(`   ✅ güncellendi (${d.id})`);
    total++;
  }
}
console.log(MODE === "apply" ? `\n✅ ${total} proje güncellendi` : "\n(scan modu — değişiklik yapılmadı; 'apply' ile uygula)");
process.exit(0);
