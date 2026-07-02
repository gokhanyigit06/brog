import { chromium } from "playwright";

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:#080808; font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;
    color:#fff; position:relative; overflow:hidden; }
  .glow { position:absolute; top:-30%; right:-10%; width:60%; height:90%;
    background:radial-gradient(circle at center, rgba(37,99,235,0.22) 0%, rgba(0,0,0,0) 70%); }
  .wrap { position:relative; z-index:1; padding:88px 96px; height:100%; display:flex; flex-direction:column; justify-content:space-between; }
  .brand { display:flex; align-items:center; gap:16px; }
  .mark { width:44px; height:54px; }
  .brand span { font-size:30px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; }
  h1 { font-size:78px; font-weight:900; line-height:1.02; letter-spacing:-0.035em; max-width:1000px; }
  .accent { color:#fff; }
  .row { display:flex; align-items:center; gap:22px; }
  .pill { font-size:22px; font-weight:600; color:rgba(255,255,255,0.9); }
  .dot { color:rgba(255,255,255,0.3); }
  .sub { font-size:24px; color:rgba(255,255,255,0.6); margin-top:6px; }
</style></head><body>
  <div class="glow"></div>
  <div class="wrap">
    <div class="brand">
      <svg class="mark" viewBox="0 0 48 48" fill="#fff"><path d="M24 2 L29 19 L46 24 L29 29 L24 46 L19 29 L2 24 L19 19 Z"/></svg>
      <span>Vogolab</span>
    </div>
    <div>
      <h1>Web siteniz, reklamlarınız ve SEO'nuz — <span class="accent">tek ekipten.</span></h1>
      <div class="sub">Kaliteli web tasarımı · sonuç odaklı reklam · uçtan uca SEO</div>
    </div>
    <div class="row">
      <span class="pill">120+ Proje</span><span class="dot">·</span>
      <span class="pill">%98 Memnuniyet</span><span class="dot">·</span>
      <span class="pill">Meta &amp; Google</span>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: "public/og-teklif.jpg", type: "jpeg", quality: 92 });
await browser.close();
console.log("✓ public/og-teklif.jpg üretildi");
process.exit(0);
