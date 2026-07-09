import { chromium } from "playwright";
const b = await chromium.launch();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";

// Masaüstü tam sayfa
const d = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await d.goto("http://localhost:3000/tr/teklif", { waitUntil: "domcontentloaded", timeout: 60000 });
await d.waitForTimeout(2000);
await d.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0,0); });
await d.waitForTimeout(1200);
await d.screenshot({ path: `${shots}/teklif-desktop-full.png`, fullPage: true });

// Mobil: fold + form
const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 })).newPage();
await m.goto("http://localhost:3000/tr/teklif", { waitUntil: "domcontentloaded", timeout: 60000 });
await m.waitForTimeout(2000);
await m.screenshot({ path: `${shots}/teklif-mobile-fold.png` });
await m.locator("#teklif-form, form").first().scrollIntoViewIfNeeded().catch(()=>{});
await m.waitForTimeout(800);
await m.screenshot({ path: `${shots}/teklif-mobile-form.png` });
await b.close();
console.log("ok");
