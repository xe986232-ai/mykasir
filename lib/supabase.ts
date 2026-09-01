import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase env belum di-set. Cek NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local"
  );
}

/**
 * Client Supabase untuk dipakai di sisi browser (client component)
 * maupun server component — pakai anon key, jadi aman untuk dipakai
 * di frontend selama RLS sudah diaktifkan.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
