"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Package,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatRupiah } from "@/lib/products";
import { useProductsData, productIconMap } from "./ProductsDataContext";
import { useBulkActions } from "./BulkActionsContext";
import { MorphingInfinity } from "./MorphingInfinity";
import LoadingScreen from "./LoadingScreen";

const LONG_PRESS_MS = 480;

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
  const { setBulkActions, requestConfirm } = useBulkActions();

  const [rows, setRows] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProductRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [version, setVersion] = useState(0);

  // Mode seleksi massal: aktif kalau kartu produk ditahan (long-press).
  // Selama aktif, tap kartu lain tinggal toggle checkbox-nya.
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFiredRef = useRef(false);

  function clearPressTimer() {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }

  function handlePointerDown(id: number) {
    longPressFiredRef.current = false;
    clearPressTimer();
    pressTimerRef.current = setTimeout(() => {
      longPressFiredRef.current = true;
      pressTimerRef.current = null;
      setSelectMode(true);
      setSelectedIds((prev) => new Set(prev).add(id));
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(15);
      }
    }, LONG_PRESS_MS);
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCardClick(id: number) {
    if (longPressFiredRef.current) {
      // Klik ini masih bagian dari gesture long-press yang sama, jadi
      // jangan di-toggle lagi biar ga langsung kebalik ke unselect.
      longPressFiredRef.current = false;
      return;
    }
    if (selectMode) {
      toggleSelect(id);
    }
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .in("id", Array.from(selectedIds));

    if (deleteError) {
      setError(deleteError.message || "Gagal menghapus produk terpilih.");
      return;
    }

    exitSelectMode();
    refetchAll();
  }

  // Titipkan info seleksi & aksi hapus massal ke BulkActionsContext, yang
  // nge-render bar & modalnya di level Frame (lihat AppShell) supaya
  // posisinya beneran nempel di bawah layar, ga ikut kegeser scroll list.
  useEffect(() => {
    if (!selectMode) {
      setBulkActions(null);
      return;
    }
    setBulkActions({
      count: selectedIds.size,
      itemLabel: "produk",
      onCancel: exitSelectMode,
      onConfirmDelete: handleBulkDelete,
    });
  });

  // Bersihin context pas komponen unmount (misal pindah halaman).
  useEffect(() => {
    return () => setBulkActions(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <AnimatePresence mode="wait" initial={false}>
        {selectMode ? (
          <motion.div
            key="select-header"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center justify-between px-5 pb-2"
          >
            <button
              onClick={exitSelectMode}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
              aria-label="Batal pilih"
            >
              <X size={16} className="text-ink" />
            </button>
            <p className="text-[13px] font-bold text-ink">
              {selectedIds.size} produk dipilih
            </p>
            <button
              onClick={requestConfirm}
              disabled={selectedIds.size === 0}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-badge/10 text-badge shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform disabled:opacity-40"
              aria-label="Hapus produk terpilih"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="normal-header"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center justify-between px-5 pb-2"
          >
            <div>
              <h1 className="text-[16px] font-bold text-ink">Kelola Produk</h1>
              <p className="text-[11.5px] text-gray">Tambah, edit, atau hapus produk tokomu</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/kategori/kelola"
                aria-label="Kelola kategori"
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
        )}
      </AnimatePresence>

      {!selectMode && (
        <p className="px-5 pb-1 text-[10.5px] text-gray/70">
          Tahan kartu produk untuk memilih beberapa sekaligus.
        </p>
      )}

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
          <LoadingScreen label="Memuat produk..." />
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
            const isSelected = selectedIds.has(p.id);

            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                onPointerDown={() => handlePointerDown(p.id)}
                onPointerUp={clearPressTimer}
                onPointerLeave={clearPressTimer}
                onPointerCancel={clearPressTimer}
                onClick={() => handleCardClick(p.id)}
                className={`flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)] transition-colors ${
                  isSelected ? "ring-2 ring-primary bg-primary-light/30" : ""
                } ${selectMode ? "select-none" : ""}`}
              >
                <AnimatePresence initial={false}>
                  {selectMode && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex shrink-0 items-center overflow-hidden"
                    >
                      {isSelected ? (
                        <CheckCircle2 size={22} className="text-primary" />
                      ) : (
                        <Circle size={22} className="text-gray/35" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

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

                {!selectMode && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Link
                      href={`/produk/kelola/${p.id}/edit`}
                      aria-label={`Edit ${p.name}`}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-light/70 text-ink active:scale-90 transition-transform"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(p);
                      }}
                      aria-label={`Hapus ${p.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-badge/10 text-badge active:scale-90 transition-transform"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {selectMode && <div className="h-20" />}

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

      {categories.length === 0 && !loading && (
        <p className="px-5 pb-4 text-center text-[11px] text-gray">
          Tips: tambah kategori dulu lewat tombol tag di atas biar produk baru bisa
          dikelompokkan.
        </p>
      )}
    </>
  );
}
