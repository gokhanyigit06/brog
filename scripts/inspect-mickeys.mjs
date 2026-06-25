import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto("https://menu.mickeys.com.tr", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const text = await page.evaluate(() => document.body.innerText);
console.log("=== SAYFA METNİ ===");
console.log(text.slice(0, 2500));

const links = await page.$$eval("a", els => [...new Set(els.map(e => e.getAttribute("href")).filter(Boolean))].slice(0, 30));
console.log("\n=== LİNKLER ===");
console.log(links.join("\n"));

// Kategori benzeri butonlar
const cats = await page.$$eval("button, [class*='category'], [class*='kategori'], nav *", els =>
  [...new Set(els.map(e => e.textContent?.trim()).filter(t => t && t.length < 40))].slice(0, 40)
);
console.log("\n=== KATEGORİ/BUTON ===");
console.log(cats.join(" | "));

await page.screenshot({ path: "scripts/mk_inspect.jpg", fullPage: false, type: "jpeg", quality: 90 });
console.log("\nScreenshot: scripts/mk_inspect.jpg");

await browser.close();
process.exit(0);
