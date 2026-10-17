"use client";

import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function supabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey);
}

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Add NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to frontend/.env.local.",
    );
  }
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseKey);
  }
  return browserClient;
}
