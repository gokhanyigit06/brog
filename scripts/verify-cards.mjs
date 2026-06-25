import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto("http://localhost:3000/tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3000);
// Projeler bölümüne git
await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2")].find(e => /Projeler|Projects/.test(e.textContent || ""));
  if (h) h.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(2500);
await page.screenshot({ path: "scripts/verify_home_projects.jpg", type: "jpeg", quality: 88 });

// Listeleme sayfası
await page.goto("http://localhost:3000/tr/projeler", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3000);
await page.evaluate(() => window.scrollTo(0, 700));
await page.waitForTimeout(2000);
await page.screenshot({ path: "scripts/verify_list_projects.jpg", type: "jpeg", quality: 88 });

await browser.close();
console.log("✓ screenshots alındı");
process.exit(0);
