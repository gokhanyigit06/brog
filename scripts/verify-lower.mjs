import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3500);
await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2")].find(e => /Projeler|Projects/.test(e.textContent || ""));
  if (h) h.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollBy(0, 1400));
await page.waitForTimeout(2000);
await page.screenshot({ path: "scripts/verify_lower.jpg", type: "jpeg", quality: 88 });
await browser.close();
console.log("ok");
process.exit(0);
