import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import type { Lead, LeadStatus } from "@/lib/content";

// Admin "Talepler" (leads) API'si — Firebase Admin SDK ile SUNUCUDA çalışır,
// güvenlik kurallarını bypass eder. `leads` artık istemciye tamamen kapalı
// (firestore.rules); admin bu rota üzerinden okur/günceller/siler.
//
// Koruma: admin oturum çerezi (proxy ile aynı doğrulama). Çerez yoksa 401 →
// kişisel veri yalnız giriş yapmış admine döner.

export const runtime = "nodejs"; // firebase-admin Node gerektirir (Edge değil)
export const dynamic = "force-dynamic"; // her istekte taze, önbelleğe alınmaz

const STATUSES: LeadStatus[] = ["new", "read", "contacted", "archived"];

async function requireAdmin(req: NextRequest): Promise<boolean> {
  return verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

/** GET → tüm talepler, en yeni önce. */
export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const snap = await adminDb.collection("leads").orderBy("createdAt", "desc").get();
  const leads: Lead[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) }));
  return NextResponse.json({ leads });
}

/** PATCH { id, status } → durum güncelle. */
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const { id, status } = (await req.json().catch(() => ({}))) as { id?: string; status?: LeadStatus };
  if (!id || !status || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "id ve geçerli status gerekli" }, { status: 400 });
  }
  await adminDb.collection("leads").doc(id).update({
    status,
    updatedAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true });
}

/** DELETE ?id=... → talebi sil. */
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  await adminDb.collection("leads").doc(id).delete();
  return NextResponse.json({ ok: true });
}
