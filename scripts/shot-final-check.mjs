import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";

await p.goto("http://localhost:3000/tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(1500);
const ft = await p.locator("footer").innerText();
console.log("Footer BROG:", ft.includes("BROG"), "| VOGOLAB:", ft.includes("VOGOLAB"), "| +90:", ft.includes("+90"), "| ölü #:", (await p.locator('footer a[href="#"]').count()));
await p.screenshot({ path: `${shots}/footer-final.png` });

// meta desc: base projesi
await p.goto("http://localhost:3000/tr/projeler/base-creative-agency", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(1500);
console.log("Base meta:", await p.evaluate(() => document.querySelector('meta[name="description"]')?.content || "(YOK)"));
console.log("İletişim title:", await p.evaluate(async () => { const r = await fetch("/tr/iletisim"); const t = await r.text(); return t.match(/<title>([^<]+)/)?.[1]; }));
await b.close();
