import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";
await p.goto("http://localhost:3000/tr/projeler/amy-qr-menu", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2000);
// telefon bloğuna kaydır, TÜM görsellerin tamamen inmesini bekle
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } });
await p.waitForFunction(() => [...document.querySelectorAll("img")].every(i => i.complete && i.naturalWidth > 0), { timeout: 30000 }).catch(() => console.log("(bazı görseller hâlâ inmemiş olabilir)"));
await p.waitForTimeout(1500);
// telefon mockup bloğu
const phones = p.locator("img[alt*='phone'], div:has(> img)").first();
await p.evaluate(() => { const els = [...document.querySelectorAll("div")].filter(d => d.style?.borderRadius === "44px" || d.className.includes("phone")); if (els[0]) els[0].scrollIntoView({block:"center"}); });
await p.evaluate(() => window.scrollTo(0, 1400));
await p.waitForTimeout(1000);
await p.screenshot({ path: `${shots}/amy-phones-check.png` });
// footer sosyaller
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(1500);
const ft = await p.locator("footer").innerText();
console.log("Footer generic sosyal:", /X\.com|Dribbble/.test(ft));
await b.close();
