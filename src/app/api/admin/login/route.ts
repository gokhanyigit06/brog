import { NextResponse } from "next/server";
import { checkCredentials, createAdminToken, ADMIN_COOKIE, SESSION_MAX_AGE } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let user = "", pass = "";
  try {
    const body = await request.json();
    user = String(body.user || "");
    pass = String(body.pass || "");
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!checkCredentials(user, pass)) {
    // Kaba kuvvet denemelerini yavaşlat
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
