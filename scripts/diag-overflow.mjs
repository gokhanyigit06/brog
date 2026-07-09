import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/tr/blog", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(3000);
const res = await p.evaluate(() => {
  const h = document.querySelector("header");
  const hs = getComputedStyle(h);
  const kids = [...h.children].map(k => `${k.tagName}.${(k.className+"").slice(0,30)} w=${Math.round(k.getBoundingClientRect().width)}`);
  const social = document.querySelector(".ft-social");
  const grid = document.querySelector(".ft-grid");
  const marq = [...document.querySelectorAll("div")].find(d => d.getBoundingClientRect().width > 5000);
  const marqParent = marq?.parentElement;
  return {
    header: { w: Math.round(h.getBoundingClientRect().width), width: hs.width, minWidth: hs.minWidth, pos: hs.position, left: hs.left, right: hs.right, display: hs.display },
    headerKids: kids,
    ftSocial: social ? { flexWrap: getComputedStyle(social).flexWrap, w: Math.round(social.getBoundingClientRect().width) } : null,
    ftGrid: grid ? { cols: getComputedStyle(grid).gridTemplateColumns, w: Math.round(grid.getBoundingClientRect().width) } : null,
    marqueeParent: marqParent ? { overflow: getComputedStyle(marqParent).overflow, overflowX: getComputedStyle(marqParent).overflowX, w: Math.round(marqParent.getBoundingClientRect().width), cls: (marqParent.className+"").slice(0,50) } : null,
  };
});
console.log(JSON.stringify(res, null, 2));
await b.close();
