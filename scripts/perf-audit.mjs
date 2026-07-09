import { chromium } from "playwright";
const b = await chromium.launch();

async function audit(url) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  let totalBytes = 0, imgBytes = 0, jsBytes = 0, reqCount = 0;
  p.on("response", async (res) => {
    try {
      const h = res.headers();
      const len = parseInt(h["content-length"] || "0");
      const ct = h["content-type"] || "";
      totalBytes += len; reqCount++;
      if (ct.startsWith("image/")) imgBytes += len;
      if (ct.includes("javascript")) jsBytes += len;
    } catch {}
  });
  const t0 = Date.now();
  const resp = await p.goto(url, { waitUntil: "load", timeout: 60000 });
  const ttfb = await p.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    return Math.round(nav.responseStart - nav.requestStart);
  });
  await p.waitForTimeout(4000);
  const metrics = await p.evaluate(() => new Promise((resolve) => {
    let lcp = 0;
    new PerformanceObserver((l) => { const e = l.getEntries(); lcp = e[e.length-1]?.startTime || lcp; }).observe({ type: "largest-contentful-paint", buffered: true });
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0;
    let cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    setTimeout(() => resolve({ fcp: Math.round(fcp), lcp: Math.round(lcp), cls: cls.toFixed(3) }), 800);
  }));
  const loadTime = Date.now() - t0;
  console.log(`\n${url}`);
  console.log(`  TTFB: ${ttfb}ms | FCP: ${metrics.fcp}ms | LCP: ${metrics.lcp}ms | CLS: ${metrics.cls}`);
  console.log(`  Yük: toplam ~${Math.round(totalBytes/1024)}KB (görsel ${Math.round(imgBytes/1024)}KB, JS ${Math.round(jsBytes/1024)}KB), ${reqCount} istek, load: ${loadTime}ms`);
  await ctx.close();
}

await audit("http://localhost:3000/tr");
await audit("http://localhost:3000/tr/teklif");
await audit("http://localhost:3000/tr/projeler");
await b.close();
