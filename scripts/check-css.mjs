import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto("http://localhost:3000/tr/blog", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(3000);
const res = await p.evaluate(() => {
  const hits = [];
  for (const s of document.styleSheets) {
    try {
      for (const r of s.cssRules) {
        if (r.cssText.includes("ft-grid") || r.cssText.includes("ft-social")) hits.push(r.cssText.slice(0, 200));
      }
    } catch {}
  }
  const sheets = [...document.styleSheets].map(s => s.href || "(inline)").slice(0, 10);
  return { hits, sheets };
});
console.log("sheets:", res.sheets.join("\n"));
console.log("ft-* kuralları:", res.hits.length ? res.hits.join("\n---\n") : "YOK!");
await b.close();
