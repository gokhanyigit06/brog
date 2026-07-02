import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/tr/teklif", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
// Hero'nun hemen altındaki marquee bandına in
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.82));
await page.waitForTimeout(1500);
await page.screenshot({ path: "scripts/logo_marquee.jpg", type: "jpeg", quality: 88 });
// Admin logo yönetimi
const actx = await browser.newContext({ viewport: { width: 1280, height: 900 }, httpCredentials: { username: "vogolab", password: "vogolab2026" } });
const apage = await actx.newPage();
await apage.goto("http://localhost:3000/admin/logolar", { waitUntil: "domcontentloaded", timeout: 60000 });
await apage.waitForTimeout(2500);
await apage.screenshot({ path: "scripts/logo_admin.jpg", type: "jpeg", quality: 88 });
await browser.close();
console.log("done");
process.exit(0);
