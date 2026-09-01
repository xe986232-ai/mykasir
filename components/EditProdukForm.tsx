"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ImageOff,
  Loader2,
  Trash2,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatRupiah } from "@/lib/products";
import { useProductsData } from "./ProductsDataContext";

// Sama seperti di TambahProdukForm — daftar icon_key bawaan yang punya
// komponen icon di ProductsDataContext, dipakai kalau produk ga punya
// gambar (image URL).
const availableIconKeys = [
  { key: "papaya", label: "Pepaya" },
  { key: "strawberry", label: "Stroberi" },
  { key: "carrot", label: "Wortel" },
  { key: "tomato", label: "Tomat" },
  { key: "pomegranate", label: "Delima" },
  { key: "onion", label: "Bawang" },
  { key: "raspberry", label: "Raspberry" },
  { key: "broccoli", label: "Brokoli" },
  { key: "water", label: "Air Mineral" },
  { key: "juice", label: "Jus" },
  { key: "icedtea", label: "Es Teh" },
];

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl bg-gray-light/60 px-3.5 py-3 text-left"
    >
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-ink">{label}</p>
        <p className="text-[11px] text-gray">{description}</p>
      </div>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-gray/40"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
          style={{ left: checked ? 22 : 2 }}
        />
      </span>
    </button>
  );
}

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">
      {children}
      {required && <span className="text-badge"> *</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-black/[0.06] bg-gray-light/60 px-3.5 py-3 text-[13.5px] text-ink outline-none placeholder:text-gray focus:border-primary/50 focus:bg-white";

type EditProdukFormProps = {
  productId: number;
};

type ProductRow = {
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

export default function EditProdukForm({ productId }: EditProdukFormProps) {
  const router = useRouter();
  const { categories, refetch } = useProductsData();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [delivery, setDelivery] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState("");
  const [iconKey, setIconKey] = useState("");
  const [imageError, setImageError] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const priceValue = parseFloat(price.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;

  // Ambil data produk yang mau diedit dari Supabase, terus isi form-nya.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);

      if (!isSupabaseConfigured) {
        setLoadError(
          "Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables."
        );
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (cancelled) return;

      if (fetchError || !data) {
        if (fetchError?.code === "PGRST116") {
          setNotFound(true);
        } else {
          setLoadError(fetchError?.message ?? "Gagal memuat data produk.");
        }
        setLoading(false);
        return;
      }

      const p = data as ProductRow;
      setName(p.name);
      setCategoryId(p.category_id ?? "");
      setUnit(p.unit);
      setPrice(String(Number(p.price) || ""));
      setDelivery(p.delivery ?? false);
      setIsActive(p.is_active ?? true);
      setImage(p.image ?? "");
      setIconKey(p.icon_key ?? "");
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Nama produk wajib diisi.");
    if (!categoryId) return setError("Pilih kategori produk dulu.");
    if (!unit.trim()) return setError("Satuan produk wajib diisi (misal: per kg, 1 botol).");
    if (priceValue <= 0) return setError("Harga produk harus lebih dari 0.");

    if (!isSupabaseConfigured) {
      setError(
        "Supabase belum dikonfigurasi di server ini. Set env NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name: name.trim(),
        unit: unit.trim(),
        price: priceValue,
        currency: "Rp",
        delivery,
        category_id: categoryId,
        icon_key: image.trim() ? null : iconKey || null,
        image: image.trim() || null,
        is_active: isActive,
      })
      .eq("id", productId);
    setSaving(false);

    if (updateError) {
      setError(updateError.message || "Gagal menyimpan perubahan produk.");
      return;
    }

    refetch();
    setSuccess(true);
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    setDeleteError(null);

    const { error: deleteErr } = await supabase.from("products").delete().eq("id", productId);
    setDeleting(false);

    if (deleteErr) {
      setDeleteError(deleteErr.message || "Gagal menghapus produk.");
      return;
    }

    refetch();
    router.push("/produk/kelola");
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-6 pt-24 text-center">
        <Loader2 size={24} className="animate-spin text-primary" />
        <p className="mt-3 text-[12.5px] text-gray">Memuat data produk...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center px-6 pt-24 text-center">
        <p className="text-[14px] font-bold text-ink">Produk tidak ditemukan</p>
        <p className="mt-1.5 text-[12.5px] text-gray">
          Produk ini mungkin sudah dihapus sebelumnya.
        </p>
        <Link
          href="/produk/kelola"
          className="mt-6 rounded-2xl bg-primary px-6 py-3 text-[13px] font-bold text-white active:scale-[0.98] transition-transform"
        >
          Kembali ke Kelola Produk
        </Link>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="px-5 pt-8">
        <p className="rounded-xl bg-badge/10 px-3.5 py-3 text-[12px] font-medium text-badge">
          {loadError}
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center px-6 pt-16 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <Check size={30} className="text-primary" strokeWidth={2.5} />
        </div>
        <h1 className="mt-5 text-[17px] font-bold text-ink">Produk diperbarui!</h1>
        <p className="mt-1.5 text-[13px] text-gray">
          Perubahan pada &ldquo;{name}&rdquo; berhasil disimpan.
        </p>

        <div className="mt-7 flex w-full flex-col gap-2.5">
          <button
            onClick={() => router.push("/produk/kelola")}
            className="w-full rounded-2xl bg-primary py-3.5 text-[13.5px] font-bold text-white active:scale-[0.98] transition-transform"
          >
            Kembali ke Kelola Produk
          </button>
          <button
            onClick={() => setSuccess(false)}
            className="w-full rounded-2xl bg-white py-3.5 text-[13.5px] font-bold text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-[0.98] transition-transform"
          >
            Lanjut Edit Produk Ini
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-3 px-5"
      >
        <Link
          href="/produk/kelola"
          aria-label="Kembali"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} className="text-ink" />
        </Link>
        <div>
          <h1 className="text-[15px] font-bold text-ink">Edit Produk</h1>
          <p className="text-[11.5px] text-gray">Perbarui data &ldquo;{name}&rdquo;</p>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-3 px-5 pb-28"
      >
        {/* Informasi dasar */}
        <section className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <h2 className="mb-3 text-[13px] font-bold text-ink">Informasi Dasar</h2>

          <div className="mb-3">
            <FieldLabel required>Nama Produk</FieldLabel>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Semangka Merah"
              className={inputClass}
            />
          </div>

          <div className="mb-3">
            <FieldLabel required>Kategori</FieldLabel>
            {categories.length === 0 ? (
              <p className="rounded-xl bg-gray-light/60 px-3.5 py-3 text-[12px] text-gray">
                Belum ada kategori di Supabase. Tambahkan kategori dulu di tabel{" "}
                <code>categories</code>.
              </p>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={`${inputClass} appearance-none`}
              >
                <option value="">Pilih kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <FieldLabel required>Satuan</FieldLabel>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Misal: per kg, 1 botol, 1 pak"
              className={inputClass}
            />
          </div>
        </section>

        {/* Harga & pengiriman */}
        <section className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <h2 className="mb-3 text-[13px] font-bold text-ink">Harga & Pengiriman</h2>

          <div className="mb-3">
            <FieldLabel required>Harga</FieldLabel>
            <div className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-gray-light/60 pl-3.5 pr-1 focus-within:border-primary/50 focus-within:bg-white">
              <span className="text-[13px] font-semibold text-gray">Rp</span>
              <input
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                className="w-full bg-transparent py-3 text-[13.5px] text-ink outline-none placeholder:text-gray"
              />
            </div>
            {priceValue > 0 && (
              <p className="mt-1.5 text-[11.5px] text-gray">
                Preview: <span className="font-semibold text-ink">{formatRupiah(priceValue)}</span>
              </p>
            )}
          </div>

          <ToggleField
            label="Gratis Ongkir"
            description="Tampilkan badge Free Delivery di kartu produk"
            checked={delivery}
            onChange={setDelivery}
          />
        </section>

        {/* Tampilan produk */}
        <section className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <h2 className="mb-1 text-[13px] font-bold text-ink">Tampilan Produk</h2>
          <p className="mb-3 text-[11px] text-gray">
            Pakai salah satu: URL gambar (diutamakan) atau icon bawaan.
          </p>

          <div className="mb-3">
            <FieldLabel>URL Gambar</FieldLabel>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-light/60">
                {image.trim() && !imageError ? (
                  <Image
                    src={image.trim()}
                    alt="Preview"
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                ) : (
                  <ImageOff size={18} className="text-gray" />
                )}
              </div>
              <input
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setImageError(false);
                }}
                placeholder="https://.../gambar-produk.png"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Icon Bawaan (opsional, kalau tanpa URL gambar)</FieldLabel>
            <select
              value={iconKey}
              onChange={(e) => setIconKey(e.target.value)}
              disabled={!!image.trim()}
              className={`${inputClass} appearance-none disabled:opacity-50`}
            >
              <option value="">Tanpa icon</option>
              {availableIconKeys.map((i) => (
                <option key={i.key} value={i.key}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Status */}
        <section className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <h2 className="mb-3 text-[13px] font-bold text-ink">Status</h2>
          <ToggleField
            label="Aktifkan Produk"
            description="Kalau nonaktif, produk ga muncul di kasir & katalog produk"
            checked={isActive}
            onChange={setIsActive}
          />
        </section>

        {error && (
          <p className="rounded-xl bg-badge/10 px-3.5 py-3 text-[12px] font-medium text-badge">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[13.5px] font-bold text-white active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </button>

        {/* Zona berbahaya: hapus produk */}
        <section className="mt-2 rounded-2xl border border-dashed border-badge/30 bg-badge/5 p-4">
          <h2 className="mb-1 text-[13px] font-bold text-badge">Zona Berbahaya</h2>
          <p className="mb-3 text-[11px] text-gray">
            Produk yang dihapus tidak bisa dikembalikan lagi.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-[13px] font-bold text-badge shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-[0.98] transition-transform"
          >
            <Trash2 size={15} />
            Hapus Produk Ini
          </button>
        </section>
      </motion.form>

      {/* Modal konfirmasi hapus */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setShowDeleteConfirm(false)}
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
                &ldquo;{name}&rdquo; akan dihapus permanen dan tidak bisa dikembalikan.
              </p>

              {deleteError && (
                <p className="mt-3 rounded-xl bg-badge/10 px-3 py-2 text-center text-[11.5px] font-medium text-badge">
                  {deleteError}
                </p>
              )}

              <div className="mt-5 flex gap-2.5">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
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
    </>
  );
}
