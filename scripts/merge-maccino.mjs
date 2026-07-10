// Macc-cino + Macc-cino Shop → tek proje
// Ana kayıt (macc-cino) kalır; Shop'un blokları "Online Mağaza" bölümü olarak eklenir, Shop kaydı silinir.
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const db = getFirestore(app);
async function withRetry(fn, t=10){for(let i=0;i<t;i++){try{return await fn()}catch(e){if(i===t-1)throw e;await new Promise(r=>setTimeout(r,3000))}}}

const MAIN_ID = "m24rMHba4wtmc556rh2Y"; // Macc-cino
const SHOP_ID = "7Z2gUZxoXfBdPN4ih6Mq"; // Macc-cino Shop

const [mainSnap, shopSnap] = await Promise.all([
  withRetry(() => getDoc(doc(db, "projects", MAIN_ID))),
  withRetry(() => getDoc(doc(db, "projects", SHOP_ID))),
]);
const main = mainSnap.data();
const shop = shopSnap.data();

// Teknik özet başlıklarını ayrıştır (iki blokta da aynı başlık vardı)
const mainBlocks = (main.blocks || []).map((b) =>
  b.type === "text_block" && b.title_tr === "Teknik Stack Özeti"
    ? { ...b, title_tr: "Kurumsal Site — Teknik Özet", title_en: "Corporate Site — Tech Summary" }
    : b
);
const shopBlocks = (shop.blocks || []).map((b) =>
  b.type === "text_block" && b.title_tr === "Teknik Stack Özeti"
    ? { ...b, title_tr: "Shop — Teknik Özet", title_en: "Shop — Tech Summary" }
    : b
);

await withRetry(() => updateDoc(doc(db, "projects", MAIN_ID), {
  description_tr:
    "Macc-cino için iki fazlı bir dijital ekosistem kurduk. Önce Ankara merkezli profesyonel kahve sistemleri markasının kurumsal kimliğine uygun web sitesi ve çok dilli özel yönetim paneli geliştirildi; ardından macc-cino.com ile entegre çalışan Next.js tabanlı e-ticaret platformu (shop.macc-cino.com) hayata geçirildi. Almanya'dan getirtilen ceremonial grade matcha başta olmak üzere profesyonel kahve ürünleri; TR/EN çoklu dil desteği ve B2B odaklı ürün altyapısıyla online satışta.",
  description_en:
    "We built a two-phase digital ecosystem for Macc-cino. First came a corporate website true to the brand's identity with a multilingual custom admin panel; then a Next.js-based e-commerce platform (shop.macc-cino.com) integrated with macc-cino.com. Professional coffee products — led by ceremonial grade matcha imported from Germany — are sold online with TR/EN language support and a B2B-focused product infrastructure.",
  category: "Web Design & E-Commerce",
  tags: ["Web Design", "E-Commerce", "Next.js", "Admin Panel", "Multilingual", "Ankara"],
  blocks: [...mainBlocks, ...shopBlocks],
  updatedAt: new Date().toISOString(),
}));
console.log("✓ Macc-cino güncellendi (bloklar birleşti:", mainBlocks.length, "+", shopBlocks.length, ")");

await withRetry(() => deleteDoc(doc(db, "projects", SHOP_ID)));
console.log("✓ Macc-cino Shop kaydı silindi");
console.log("✅ Birleştirme tamam: /tr/projeler/macc-cino");
process.exit(0);
