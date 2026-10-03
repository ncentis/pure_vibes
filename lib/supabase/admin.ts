import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only client with the service role key. Never import from client components.
let client: SupabaseClient | null = null;

export function hasSupabase() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function admin(): SupabaseClient {
  if (!hasSupabase()) throw new Error("Supabase env not set (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  return client;
}
