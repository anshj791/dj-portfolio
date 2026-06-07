import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionSecret = process.env.OWNER_SESSION_SECRET || "local-development-owner-session";
  const isOwner = cookies().get("owner_session")?.value === sessionSecret;
  return NextResponse.json({ isOwner });
}
