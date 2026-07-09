import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, httpCredentials: { username: "vogolab", password: "vogolab2026" } });
const p = await ctx.newPage();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";

await p.goto("http://localhost:3000/tr/blog/ankara-seo-rehberi", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
console.log("Blog:", await p.title());
console.log("h1:", (await p.locator("h1").first().textContent())?.trim());
await p.screenshot({ path: `${shots}/blog-ankara-seo.png` });

await p.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(4000);
await p.screenshot({ path: `${shots}/admin-dash.png` });
console.log("admin yüklendi");
await b.close();
