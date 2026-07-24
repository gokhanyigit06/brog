import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419838ff/scratchpad".replace("9838ff","9813ff");

// 1) Oturumsuz /admin → login'e yönlenmeli
await p.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(1500);
console.log("1. yönlendirme:", p.url().endsWith("/admin/login") ? "OK" : "HATA " + p.url());
await p.screenshot({ path: `${shots}/login-screen.png` });

// 2) Yanlış şifre
await p.fill("input[autocomplete='username']", "vogolab");
await p.fill("input[type='password']", "yanlis123");
await p.click("button[type='submit']");
await p.waitForTimeout(2500);
console.log("2. yanlış şifre hata mesajı:", (await p.locator("text=hatalı").count()) > 0 ? "OK" : "HATA");

// 3) Doğru giriş → dashboard
await p.fill("input[type='password']", "vogolab2026");
await p.click("button[type='submit']");
await p.waitForTimeout(3500);
const onDash = p.url().endsWith("/admin") && (await p.locator("text=Dashboard").count()) > 0;
console.log("3. giriş:", onDash ? "OK" : "HATA " + p.url());

// 4) Oturum varken /admin/login → dashboard'a yönlenmeli
await p.goto("http://localhost:3000/admin/login", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(1500);
console.log("4. oturumluyken login:", p.url().endsWith("/admin") ? "OK (dashboard'a döndü)" : "HATA " + p.url());

// 5) Çıkış
await p.click("text=Çıkış Yap");
await p.waitForTimeout(2500);
console.log("5. çıkış:", p.url().endsWith("/admin/login") ? "OK" : "HATA " + p.url());
// çıkıştan sonra /admin korumalı mı
await p.goto("http://localhost:3000/admin/leads", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(1500);
console.log("6. çıkış sonrası koruma:", p.url().endsWith("/admin/login") ? "OK" : "HATA " + p.url());
await b.close();
