import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-auth";

// Admin İÇERİK yazma API'si — Firebase Admin SDK ile SUNUCUDA çalışır ve
// güvenlik kurallarını bypass eder.
//
// NEDEN VAR (2026-07-29):
//   `leads` sızıntısı kapatıldıktan sonra içerik koleksiyonlarında (siteContent,
//   projects, services, blog_posts) YAZMA hâlâ açıktı: admin paneli bunları
//   istemciden yazıyordu ve sitede Firebase Auth yok. Yani kural "allow write:
//   if true" demek zorundaydı — ve bu, adresi bilen HERKESİN ajansın sitesinin
//   içeriğini, portföyünü ve blog yazılarını değiştirebilmesi demekti.
//
//   Admin panelinin şifresi burada koruma SAĞLAMAZ: şifre paneli korur;
//   Firestore'a ise REST üzerinden, panelden hiç geçmeden erişilir. Kuralı
//   uygulayan Google'ın sunucusudur, sitenin kendisi değil.
//
//   Çözüm `leads` ile aynı kalıp: yazma sunucuya taşındı, kural kapatıldı.
//
// Koruma: admin oturum çerezi. Çerez yoksa 401.

export const runtime = "nodejs"; // firebase-admin Node gerektirir
export const dynamic = "force-dynamic";

// Yalnız bu koleksiyonlara yazılabilir. `leads` BİLEREK YOK — onun kendi
// rotası var (alan doğrulamalı) ve formdan gelen create istemcide kalmalı.
const IZINLI = ["siteContent", "projects", "services", "blog_posts"] as const;
type Izinli = (typeof IZINLI)[number];

type Govde = {
  op?: "set" | "update" | "add" | "delete";
  col?: string;
  id?: string;
  data?: Record<string, unknown>;
  merge?: boolean;
};

function izinliMi(c: unknown): c is Izinli {
  return typeof c === "string" && (IZINLI as readonly string[]).includes(c);
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { op, col, id, data, merge } = (await req.json().catch(() => ({}))) as Govde;

  if (!izinliMi(col)) {
    return NextResponse.json({ error: "geçersiz koleksiyon" }, { status: 400 });
  }
  if (op !== "set" && op !== "update" && op !== "add" && op !== "delete") {
    return NextResponse.json({ error: "geçersiz işlem" }, { status: 400 });
  }
  if (op !== "add" && !id) {
    return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  }
  if (op !== "delete" && (!data || typeof data !== "object")) {
    return NextResponse.json({ error: "data gerekli" }, { status: 400 });
  }

  const c = adminDb.collection(col);

  if (op === "add") {
    const ref = await c.add(data as Record<string, unknown>);
    return NextResponse.json({ ok: true, id: ref.id });
  }
  if (op === "set") {
    await c.doc(id!).set(data as Record<string, unknown>, { merge: merge !== false });
    return NextResponse.json({ ok: true, id });
  }
  if (op === "update") {
    await c.doc(id!).update(data as Record<string, unknown>);
    return NextResponse.json({ ok: true, id });
  }
  await c.doc(id!).delete();
  return NextResponse.json({ ok: true, id });
}
