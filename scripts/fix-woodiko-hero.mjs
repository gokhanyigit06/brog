import { chromium } from "playwright";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import fs from "fs";

const app = initializeApp({ apiKey:"AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k", authDomain:"brog-1acb3.firebaseapp.com", projectId:"brog-1acb3", storageBucket:"brog-1acb3.firebasestorage.app", messagingSenderId:"370433122581", appId:"1:370433122581:web:9092002ef883d620f3c91c" });
const storage = getStorage(app); const db = getFirestore(app);
const ID = "hiqy5TZdTVLnTpv8XIuu";
async function withRetry(fn, t=8){for(let i=0;i<t;i++){try{return await fn()}catch{await new Promise(r=>setTimeout(r,2500))}}throw new Error("fail")}

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("https://woodiko.com", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(4000);
try { await p.click("text=Tümünü Kabul Et", { timeout: 4000 }); console.log("çerez kabul edildi"); } catch { console.log("çerez butonu bulunamadı"); }
await p.waitForTimeout(1200);
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(800);
await p.screenshot({ path: "scripts/np_woodiko_hero2.jpg", type: "jpeg", quality: 92 });
await b.close();

const buffer = fs.readFileSync("scripts/np_woodiko_hero2.jpg");
const r = ref(storage, `projects/woodiko-hero-${Date.now()}.jpg`);
await withRetry(() => uploadBytes(r, buffer, { contentType: "image/jpeg" }));
const url = await withRetry(() => getDownloadURL(r));

const snap = await withRetry(() => getDoc(doc(db, "projects", ID)));
const data = snap.data();
const blocks = (data.blocks || []).map((bl, i) => (i === 0 && bl.type === "single_image") ? { ...bl, url } : bl);
await withRetry(() => updateDoc(doc(db, "projects", ID), { imageUrl: url, blocks, updatedAt: new Date().toISOString() }));
console.log("✅ Woodiko hero güncellendi");
process.exit(0);
