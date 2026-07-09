import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
p.on("console", (m) => { if (m.type() === "error") console.log("[console]", m.text().slice(0, 140)); });
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";

await p.goto("http://localhost:3000/tr/teklif", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2000);
await p.locator("#teklif").scrollIntoViewIfNeeded();
await p.fill("input[placeholder='Adınız Soyadınız']", "Test Doğrulama");
await p.fill("input[placeholder='05xx xxx xx xx']", "0555 111 22 33");
await p.getByRole("button", { name: "Web Sitesi", exact: true }).click();
await p.waitForTimeout(3500);
await p.getByRole("button", { name: /Ücretsiz Teklif İste/ }).click();
await p.waitForTimeout(6000);
console.log("Form başarı:", (await p.locator("text=Talebiniz alındı").count()) > 0);
const err = await p.locator("form p").allInnerTexts().catch(() => []);
if (err.length) console.log("form mesajları:", err.join(" | ").slice(0, 200));
await p.screenshot({ path: `${shots}/form-after-submit.png` });

await p.goto("http://localhost:3000/tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(1500);
const footerText = await p.locator("footer").innerText();
console.log("Footer ABD numarası kaldı mı:", footerText.includes("510"));
console.log("Footer +90 var mı:", footerText.includes("+90"));
await b.close();
