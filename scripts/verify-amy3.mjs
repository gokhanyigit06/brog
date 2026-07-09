import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 950 } })).newPage();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";
await p.goto("http://localhost:3000/tr/projeler/amy-qr-menu", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
// telefon bloğunu bul ve ortala
await p.evaluate(() => {
  const imgs = [...document.querySelectorAll("img")];
  const phone = imgs.find(i => (i.src || "").includes("amy-mobile"));
  phone?.scrollIntoView({ block: "center" });
});
// bu bloktaki görsellerin tamamen inmesini bekle
await p.waitForFunction(() => {
  const imgs = [...document.querySelectorAll("img")].filter(i => (i.src || "").includes("amy-mobile"));
  return imgs.length >= 3 && imgs.every(i => i.complete && i.naturalWidth > 0);
}, { timeout: 45000 });
await p.waitForTimeout(800);
await p.screenshot({ path: `${shots}/amy-phones-final.png` });
console.log("telefon görselleri: 3/3 yüklendi");

await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(1800);
const ft = await p.locator("footer").innerText();
console.log("Footer: Instagram var:", ft.includes("Instagram"), "| X.com/Dribbble/LinkedIn:", /X\.com|Dribbble|LinkedIn/.test(ft));
await b.close();
