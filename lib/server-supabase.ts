import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const serverSupabase =
  url && (serviceRoleKey || anonKey)
    ? createClient(url, serviceRoleKey || anonKey!, {
        auth: {
          persistSession: false
        }
      })
    : null;

export const hasServiceRoleKey = Boolean(serviceRoleKey);
