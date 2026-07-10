import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";

// detay: birleşik sayfa (ISR: 60 sn — cache bypass için bekleyip taze isteyelim)
await p.goto("http://localhost:3000/tr/projeler/macc-cino", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(3000);
const txt = await p.locator("main").innerText();
console.log("Kurumsal Site — Teknik Özet:", txt.includes("Kurumsal Site — Teknik Özet"));
console.log("Shop — Teknik Özet:", txt.includes("Shop — Teknik Özet"));
console.log("Matcha bölümü:", txt.includes("Matcha") || txt.includes("matcha"));
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 900) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } window.scrollTo(0,0); });
await p.waitForTimeout(3000);
await p.screenshot({ path: `${shots}/maccino-merged.png`, fullPage: true });

// projeler listesi: tek Macc-cino kalmalı (60 sn ISR — birkaç deneme)
let count = -1;
for (let i = 0; i < 5; i++) {
  await p.goto("http://localhost:3000/tr/projeler", { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(3500);
  count = await p.locator("text=/Macc/i").count();
  if (count <= 2) break; // kart adı + olası etiket
  await p.waitForTimeout(10000);
}
console.log("Listede 'Macc' geçen öğe sayısı:", count);
// shop detayı artık 404/bulunamadı olmalı
await p.goto("http://localhost:3000/tr/projeler/macc-cino-shop", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
console.log("Shop sayfası:", (await p.locator("text=Proje bulunamadı").count()) > 0 ? "bulunamadı (doğru)" : "hâlâ var");
await b.close();
