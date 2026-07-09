import { chromium } from "playwright";
const b = await chromium.launch();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";
const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true })).newPage();
await m.goto("https://vogopos.com/amy", { waitUntil: "domcontentloaded", timeout: 60000 });
await m.waitForTimeout(3500);
await m.locator("text=FOOD").first().click();
await m.waitForTimeout(3000);
console.log("foods url:", m.url());
await m.screenshot({ path: `${shots}/amy-foods-0.png` });
await m.evaluate(() => window.scrollTo(0, 800));
await m.waitForTimeout(900);
await m.screenshot({ path: `${shots}/amy-foods-1.png` });
// bir alt kategoriye / ürün listesine gir
const cats = await m.locator("a, button").allInnerTexts();
console.log("görünen:", cats.filter(t => t.trim()).slice(0, 20).join(" | "));
await b.close();
