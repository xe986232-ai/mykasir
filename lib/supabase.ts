import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True kalau env Supabase udah lengkap di-set. Dipakai komponen pemanggil
 * buat nampilin pesan error yang jelas di UI, TANPA bikin proses build
 * (prerender halaman statis) ikut krash cuma gara-gara env belum ke-set
 * di environment tempat deploy (misal Vercel project settings belum diisi).
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env belum di-set. Cek NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

/**
 * Client Supabase untuk dipakai di sisi browser (client component)
 * maupun server component — pakai anon key, jadi aman untuk dipakai
 * di frontend selama RLS sudah diaktifkan.
 *
 * Kalau env belum di-set, tetep dibikin pakai placeholder URL biar ga
 * throw pas build/prerender — pemanggilnya harus cek `isSupabaseConfigured`
 * dulu sebelum benar-benar query.
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "public-anon-key"
);
