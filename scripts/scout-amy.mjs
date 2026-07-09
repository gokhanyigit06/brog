import { chromium } from "playwright";
const b = await chromium.launch();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";

const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true })).newPage();
await m.goto("https://vogopos.com/amy", { waitUntil: "domcontentloaded", timeout: 60000 });
await m.waitForTimeout(4000);
// lazy içerik için kaydır
await m.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } window.scrollTo(0, 0); });
await m.waitForTimeout(1500);
const h = await m.evaluate(() => ({ total: document.body.scrollHeight, vh: window.innerHeight, title: document.title }));
console.log("sayfa:", JSON.stringify(h));
for (let i = 0; i < 5; i++) {
  await m.evaluate((y) => window.scrollTo(0, y), i * 750);
  await m.waitForTimeout(900);
  await m.screenshot({ path: `${shots}/amy-scout-${i}.png`, type: "png" });
}
await b.close();
console.log("ok");
