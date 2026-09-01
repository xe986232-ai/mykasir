"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatRupiah } from "@/lib/products";
import { useProductsData, productIconMap } from "./ProductsDataContext";

type AdminProductRow = {
  id: number;
  name: string;
  unit: string;
  price: number | string;
  currency: string;
  delivery: boolean | null;
  category_id: string;
  icon_key: string | null;
  image: string | null;
  is_active: boolean | null;
};

export default function KelolaProdukContent() {
  const { categories, getCategoryById, refetch: refetchShopData } = useProductsData();

  const [rows, setRows] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProductRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [version, setVersion] = useState(0);

  // Berbeda dari halaman /produk (yang cuma nampilin produk is_active =
  // true buat browse), di sini kita ambil SEMUA produk (aktif & nonaktif)
  // langsung dari Supabase karena ini halaman pengelolaan internal.
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

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("id");

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message || "Gagal memuat daftar produk.");
        setLoading(false);
        return;
      }

      setRows((data as AdminProductRow[]) ?? []);
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

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", deleteTarget.id);
    setDeleting(false);

    if (deleteError) {
      setError(deleteError.message || "Gagal menghapus produk.");
      setDeleteTarget(null);
      return;
    }

    setDeleteTarget(null);
    refetchAll();
  }

  const filtered = rows.filter((r) =>
    r.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-between px-5 pb-2"
      >
        <div>
          <h1 className="text-[16px] font-bold text-ink">Kelola Produk</h1>
          <p className="text-[11.5px] text-gray">Tambah, edit, atau hapus produk tokomu</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/kategori/tambah"
            aria-label="Tambah kategori"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
          >
            <Tag size={16} className="text-ink" />
          </Link>
          <Link
            href="/produk/kelola/tambah"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-[12.5px] font-bold text-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
          >
            <Plus size={15} strokeWidth={2.6} />
            Tambah
          </Link>
        </div>
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
            placeholder="Cari produk yang mau dikelola..."
            className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-gray outline-none"
          />
        </div>
      </motion.div>

      {/* List */}
      <div className="mt-4 flex flex-col gap-2.5 px-5 pb-6">
        {loading && rows.length === 0 && (
          <p className="py-8 text-center text-[12px] text-gray">Memuat produk...</p>
        )}

        {error && (
          <p className="rounded-xl bg-badge/10 px-3.5 py-3 text-[12px] font-medium text-badge">
            {error}
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="py-8 text-center text-[12px] text-gray">
            {rows.length === 0
              ? "Belum ada produk. Yuk tambah produk pertamamu."
              : "Produk tidak ditemukan."}
          </p>
        )}

        <AnimatePresence initial={false}>
          {filtered.map((p) => {
            const category = getCategoryById(p.category_id);
            const Icon = p.icon_key ? productIconMap[p.icon_key] : undefined;

            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-light/60">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={44}
                      height={44}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  ) : Icon ? (
                    <div className="h-10 w-10">
                      <Icon />
                    </div>
                  ) : (
                    <Package size={20} className="text-gray" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[13px] font-semibold text-ink">{p.name}</p>
                    {!p.is_active && (
                      <span className="shrink-0 rounded-full bg-gray/15 px-1.5 py-0.5 text-[9px] font-bold text-gray">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-gray">
                    {category?.label ?? "Tanpa kategori"} &middot; {p.unit}
                  </p>
                  <p className="text-[12.5px] font-bold text-primary">
                    {formatRupiah(Number(p.price))}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Link
                    href={`/produk/kelola/${p.id}/edit`}
                    aria-label={`Edit ${p.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-light/70 text-ink active:scale-90 transition-transform"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    aria-label={`Hapus ${p.name}`}
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
                Hapus produk ini?
              </h2>
              <p className="mt-1 text-center text-[12px] text-gray">
                &ldquo;{deleteTarget.name}&rdquo; akan dihapus permanen dan tidak bisa
                dikembalikan.
              </p>

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
                      <Loader2 size={14} className="animate-spin" />
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

      {categories.length === 0 && !loading && (
        <p className="px-5 pb-4 text-center text-[11px] text-gray">
          Tips: tambah kategori dulu lewat tombol tag di atas biar produk baru bisa
          dikelompokkan.
        </p>
      )}
    </>
  );
}
