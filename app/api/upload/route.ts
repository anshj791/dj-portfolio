import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hasServiceRoleKey, serverSupabase } from "@/lib/server-supabase";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "portfolio-media";
const MAX_FILE_SIZE = 8 * 1024 * 1024;

function isOwnerSession() {
  const sessionSecret = process.env.OWNER_SESSION_SECRET || "local-development-owner-session";
  return cookies().get("owner_session")?.value === sessionSecret;
}

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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
      { error: "SUPABASE_SERVICE_ROLE_KEY is required for image uploads" },
      { status: 500 }
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files can be uploaded" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image must be 8MB or smaller" }, { status: 400 });
  }

  const bucket = await serverSupabase.storage.getBucket(BUCKET);
  if (bucket.error) {
    const created = await serverSupabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
    });

    if (created.error) {
      return NextResponse.json({ error: created.error.message }, { status: 500 });
    }
  }

  const extension = safeFileName(file.name).split(".").pop() || "jpg";
  const path = `uploads/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const bytes = await file.arrayBuffer();

  const uploaded = await serverSupabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: false
  });

  if (uploaded.error) {
    return NextResponse.json({ error: uploaded.error.message }, { status: 500 });
  }

  const { data } = serverSupabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
