import { chromium } from "playwright";

const browser = await chromium.launch();

// ── Desktop: sayfa görünümü ──
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/tr/teklif", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: "scripts/tk_hero.jpg", type: "jpeg", quality: 86 });

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.1));
await page.waitForTimeout(1200);
await page.screenshot({ path: "scripts/tk_value.jpg", type: "jpeg", quality: 86 });

// ── Form gönderimi ──
await page.evaluate(() => document.getElementById("teklif")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(1500);
await page.screenshot({ path: "scripts/tk_form.jpg", type: "jpeg", quality: 86 });

const stamp = String(Math.floor(Math.random() * 100000));
await page.fill('input[placeholder="Adınız Soyadınız"]', `Test Talep ${stamp}`);
await page.fill('input[placeholder="05xx xxx xx xx"]', "0555 123 45 67");
await page.getByRole("button", { name: "Web Sitesi", exact: true }).click();
await page.fill("textarea", "Otomatik doğrulama talebi.");
await page.click('button[type="submit"]');
await page.waitForTimeout(2800);
await page.screenshot({ path: "scripts/tk_success.jpg", type: "jpeg", quality: 86 });
const sentOk = await page.getByText("Talebiniz alındı").count().catch(() => 0);
console.log("Form başarı ekranı:", sentOk > 0 ? "OK" : "YOK");

// ── Mobil: sticky bar ──
const mctx = await browser.newContext({ viewport: { width: 400, height: 820 }, deviceScaleFactor: 2 });
const mpage = await mctx.newPage();
await mpage.goto("http://localhost:3000/tr/teklif", { waitUntil: "domcontentloaded", timeout: 60000 });
await mpage.waitForTimeout(2000);
await mpage.screenshot({ path: "scripts/tk_mobile.jpg", type: "jpeg", quality: 86 });

// ── Admin gelen kutusu (Basic Auth) ──
const actx = await browser.newContext({ viewport: { width: 1280, height: 900 }, httpCredentials: { username: "vogolab", password: "vogolab2026" } });
const apage = await actx.newPage();
await apage.goto("http://localhost:3000/admin/leads", { waitUntil: "domcontentloaded", timeout: 60000 });
await apage.waitForTimeout(2500);
await apage.screenshot({ path: "scripts/tk_admin.jpg", type: "jpeg", quality: 86 });
const leadShown = await apage.getByText(`Test Talep ${stamp}`).count().catch(() => 0);
console.log("Admin'de lead görünüyor:", leadShown > 0 ? "OK (" + stamp + ")" : "YOK");

await browser.close();
console.log("done");
process.exit(0);
