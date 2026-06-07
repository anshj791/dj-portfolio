import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portfolioData } from "@/data/portfolio";
import { hasServiceRoleKey, serverSupabase } from "@/lib/server-supabase";

const CONTENT_ID = "published";

function isOwnerSession() {
  const sessionSecret = process.env.OWNER_SESSION_SECRET || "local-development-owner-session";
  return cookies().get("owner_session")?.value === sessionSecret;
}

export async function GET() {
  if (!serverSupabase) {
    return NextResponse.json({ data: portfolioData, source: "static" });
  }

  const { data, error } = await serverSupabase
    .from("portfolio_content")
    .select("data")
    .eq("id", CONTENT_ID)
    .maybeSingle();

  if (error || !data?.data) {
    return NextResponse.json({ data: portfolioData, source: "static" });
  }

  return NextResponse.json({ data: data.data, source: "supabase" });
}

export async function POST(request: Request) {
  if (!isOwnerSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!serverSupabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  if (!hasServiceRoleKey) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY is required for secure cross-device publishing."
      },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.data) {
    return NextResponse.json({ error: "Missing content data" }, { status: 400 });
  }

  const { error } = await serverSupabase.from("portfolio_content").upsert({
    id: CONTENT_ID,
    data: body.data,
    updated_at: new Date().toISOString()
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
