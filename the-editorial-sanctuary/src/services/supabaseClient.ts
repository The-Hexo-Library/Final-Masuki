import { createClient } from "@supabase/supabase-js";

/** Anonymous client for public catalog reads (e.g. `books` table). Auth is backend JWT only. */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key"
);

export interface SupabaseBookRow {
  id: string;
  title: string;
  author: string;
  file_url: string;
  created_at: string;
}
