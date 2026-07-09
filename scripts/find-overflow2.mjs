import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/tr/blog", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(3000);
const res = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    // sadece köke yakın geniş elemanlar
    if (r.width > vw + 10) {
      const cls = (typeof el.className === "string" ? el.className : "").slice(0, 70);
      const st = getComputedStyle(el);
      out.push(`${el.tagName.toLowerCase()} cls="${cls}" w=${Math.round(r.width)} pos=${st.position} left=${st.left} right=${st.right} parentTag=${el.parentElement?.tagName}`);
    }
  });
  return { vw, scrollW: document.documentElement.scrollWidth, bodyW: Math.round(document.body.getBoundingClientRect().width), out: out.slice(0, 12) };
});
console.log("clientWidth:", res.vw, "scrollWidth:", res.scrollW, "bodyWidth:", res.bodyW);
console.log(res.out.join("\n"));
await b.close();
