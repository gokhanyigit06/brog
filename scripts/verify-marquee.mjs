import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto("http://localhost:3000/tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3500);
// Marquee'yi bul (BRANDING/marka akan şerit)
await page.evaluate(() => {
  const el = [...document.querySelectorAll("div")].find(d =>
    d.className && typeof d.className === "string" && d.className.includes("marquee-track"));
  if (el) el.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(2000);
await page.screenshot({ path: "scripts/verify_marquee.jpg", type: "jpeg", quality: 88 });
await browser.close();
console.log("✓ marquee screenshot alındı");
process.exit(0);
