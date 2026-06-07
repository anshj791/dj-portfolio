import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const expectedId = process.env.OWNER_ID || "diya";
  const expectedPassword = process.env.OWNER_PASSWORD || "change-this-password";
  const sessionSecret = process.env.OWNER_SESSION_SECRET || "local-development-owner-session";

  if (!body || body.id !== expectedId || body.password !== expectedPassword) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("owner_session", sessionSecret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
