import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

// Teklif: kartlardaki linkler
await p.goto("http://localhost:3000/tr/teklif", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
const teklifLinks = await p.locator("a:has-text('Detaylı incele')").evaluateAll(els => els.map(a => a.getAttribute("href")));
console.log("Teklif kartları:", teklifLinks.join(", ") || "(yok)");

// Ana sayfa hizmetler bölümü
await p.goto("http://localhost:3000/tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(3500);
await p.evaluate(() => document.getElementById("hizmetler")?.scrollIntoView());
await p.waitForTimeout(2000);
const homeLinks = await p.locator("#hizmetler a:has-text('Detaylı incele')").evaluateAll(els => els.map(a => a.getAttribute("href")));
console.log("Ana sayfa hizmetler:", homeLinks.join(", ") || "(yok)");

// Footer hizmet linkleri
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(1500);
const ftLinks = await p.locator("footer a[href*='/hizmetler/']").evaluateAll(els => els.map(a => a.getAttribute("href")));
console.log("Footer:", ftLinks.join(", ") || "(yok)");

// tıklama testi: teklif → web-tasarim
await p.goto("http://localhost:3000/tr/teklif", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2000);
await p.locator("a:has-text('Detaylı incele')").first().click();
await p.waitForTimeout(2500);
console.log("Tıklama sonrası URL:", p.url());
await b.close();
