import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/tr/blog", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(3000);
const offenders = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > vw + 4 || r.right > vw + 4) {
      const cls = (typeof el.className === "string" ? el.className : "").slice(0, 60);
      out.push(`${el.tagName.toLowerCase()}${cls ? "." + cls.replace(/\s+/g, ".") : ""} w=${Math.round(r.width)} right=${Math.round(r.right)} text="${(el.textContent||"").trim().slice(0,40)}"`);
    }
  });
  return out.slice(0, 25);
});
console.log(offenders.join("\n"));
await b.close();
