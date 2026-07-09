import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";
await p.goto("http://localhost:3000/tr/projeler/amy-qr-menu", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(3000);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0,0); });
// görsellerin inmesini bekle
await p.waitForTimeout(4000);
console.log("title:", await p.title());
await p.screenshot({ path: `${shots}/amy-detail-full.png`, fullPage: true });
await b.close();
