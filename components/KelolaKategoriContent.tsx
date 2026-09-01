"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Plus, Search, Tag, Trash2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { categoryIconMap, useProductsData } from "./ProductsDataContext";
import { MorphingInfinity } from "./MorphingInfinity";
import LoadingScreen from "./LoadingScreen";

type AdminCategoryRow = {
  id: string;
  label: string;
  type: "image" | "icon";
  image: string | null;
  bg_color: string | null;
  icon_key: string | null;
  sort_order: number;
};

export default function KelolaKategoriContent() {
  const { refetch: refetchShopData } = useProductsData();

  const [rows, setRows] = useState<AdminCategoryRow[]>([]);
  // Jumlah produk per category_id, dipakai buat kasih peringatan pas mau
  // hapus kategori yang masih dipakai produk.
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<AdminCategoryRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Ambil SEMUA kategori langsung dari Supabase (bukan lewat context) biar
  // konsisten dengan pola KelolaProdukContent — halaman admin selalu fetch
  // data mentah/terbaru sendiri. Sekalian hitung jumlah produk per kategori
  // (dari SEMUA produk, aktif maupun nonaktif) buat validasi hapus.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured) {
        setError(
          "Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables."
        );
        setLoading(false);
        return;
      }

      const [catRes, prodRes] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("products").select("category_id"),
      ]);

      if (cancelled) return;

      if (catRes.error) {
        setError(catRes.error.message || "Gagal memuat daftar kategori.");
        setLoading(false);
        return;
      }

      const counts: Record<string, number> = {};
      (prodRes.data as { category_id: string }[] | null)?.forEach((p) => {
        if (!p.category_id) return;
        counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;
      });

      setRows((catRes.data as AdminCategoryRow[]) ?? []);
      setProductCounts(counts);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [version]);

  function refetchAll() {
    setVersion((v) => v + 1);
    refetchShopData();
  }

  function openDeleteConfirm(row: AdminCategoryRow) {
    setDeleteError(null);
    setDeleteTarget(row);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);

    const { error: deleteErr } = await supabase
      .from("categories")
      .delete()
      .eq("id", deleteTarget.id);
    setDeleting(false);

    if (deleteErr) {
      setDeleteError(deleteErr.message || "Gagal menghapus kategori.");
      return;
    }

    setDeleteTarget(null);
    refetchAll();
  }

  const filtered = rows.filter((r) =>
    r.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex items-center justify-between px-5 pb-2"
      >
        <div>
          <h1 className="text-[16px] font-bold text-ink">Kelola Kategori</h1>
          <p className="text-[11.5px] text-gray">Tambah, edit, atau hapus kategori tokomu</p>
        </div>
        <Link
          href="/kategori/kelola/tambah"
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-[12.5px] font-bold text-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <Plus size={15} strokeWidth={2.6} />
          Tambah
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="px-5 pt-2"
      >
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <Search size={18} className="text-gray" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kategori yang mau dikelola..."
            className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-gray outline-none"
          />
        </div>
      </motion.div>

      {/* List */}
      <div className="mt-4 flex flex-col gap-2.5 px-5 pb-6">
        {loading && rows.length === 0 && <LoadingScreen label="Memuat kategori..." />}

        {error && (
          <p className="rounded-xl bg-badge/10 px-3.5 py-3 text-[12px] font-medium text-badge">
            {error}
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="py-8 text-center text-[12px] text-gray">
            {rows.length === 0
              ? "Belum ada kategori. Yuk tambah kategori pertamamu."
              : "Kategori tidak ditemukan."}
          </p>
        )}

        <AnimatePresence initial={false}>
          {filtered.map((c) => {
            const Icon = c.icon_key ? categoryIconMap[c.icon_key] : undefined;
            const count = productCounts[c.id] ?? 0;

            return (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)]"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-light/60"
                  style={
                    c.type === "icon" ? { backgroundColor: c.bg_color ?? "#94A3B8" } : undefined
                  }
                >
                  {c.type === "image" && c.image ? (
                    <Image
                      src={c.image}
                      alt={c.label}
                      width={44}
                      height={44}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  ) : Icon ? (
                    <div className="h-9 w-9">
                      <Icon />
                    </div>
                  ) : (
                    <Tag size={20} className="text-white" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-ink">{c.label}</p>
                  <p className="truncate text-[11px] text-gray">
                    {count} produk &middot; Urutan {c.sort_order}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Link
                    href={`/kategori/kelola/${c.id}/edit`}
                    aria-label={`Edit ${c.label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-light/70 text-ink active:scale-90 transition-transform"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => openDeleteConfirm(c)}
                    aria-label={`Hapus ${c.label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-badge/10 text-badge active:scale-90 transition-transform"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal konfirmasi hapus */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteTarget(null)}
              className="absolute inset-0 z-50 bg-black/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="absolute inset-x-6 top-1/2 z-50 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-badge/10">
                <Trash2 size={20} className="text-badge" />
              </div>
              <h2 className="mt-3 text-center text-[14.5px] font-bold text-ink">
                Hapus kategori ini?
              </h2>
              <p className="mt-1 text-center text-[12px] text-gray">
                &ldquo;{deleteTarget.label}&rdquo; akan dihapus permanen dan tidak bisa
                dikembalikan.
                {(productCounts[deleteTarget.id] ?? 0) > 0 && (
                  <>
                    {" "}
                    <span className="font-semibold text-badge">
                      {productCounts[deleteTarget.id]} produk
                    </span>{" "}
                    yang masih pakai kategori ini akan jadi &ldquo;Tanpa kategori&rdquo;.
                  </>
                )}
              </p>

              {deleteError && (
                <p className="mt-3 rounded-xl bg-badge/10 px-3 py-2 text-center text-[11.5px] font-medium text-badge">
                  {deleteError}
                </p>
              )}

              <div className="mt-5 flex gap-2.5">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 rounded-2xl bg-gray-light py-3 text-[13px] font-bold text-ink active:scale-[0.98] transition-transform disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-badge py-3 text-[13px] font-bold text-white active:scale-[0.98] transition-transform disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <MorphingInfinity className="h-3.5 w-3.5" />
                      Menghapus...
                    </>
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
