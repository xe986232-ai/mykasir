"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ImageOff, Trash2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useProductsData } from "./ProductsDataContext";
import { MorphingInfinity } from "./MorphingInfinity";
import LoadingScreen from "./LoadingScreen";

// Sama seperti di TambahKategoriForm — icon_key bawaan yang punya komponen
// icon di ProductsDataContext (categoryIconMap).
const availableIconKeys = [
  { key: "fruits", label: "Buah-buahan" },
  { key: "vegetable", label: "Sayuran" },
  { key: "drinks", label: "Minuman" },
];

const swatches = ["#2FB350", "#3B6DF0", "#F0562E", "#F5B301", "#8B5CF6", "#0EA5A5", "#EF4444"];

type DisplayType = "image" | "icon";

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

type EditKategoriFormProps = {
  categoryId: string;
};

type CategoryRow = {
  id: string;
  label: string;
  type: "image" | "icon";
  image: string | null;
  bg_color: string | null;
  icon_key: string | null;
  sort_order: number;
};

export default function EditKategoriForm({ categoryId }: EditKategoriFormProps) {
  const router = useRouter();
  const { refetch } = useProductsData();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [productCount, setProductCount] = useState(0);

  const [label, setLabel] = useState("");
  const [displayType, setDisplayType] = useState<DisplayType>("icon");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [iconKey, setIconKey] = useState(availableIconKeys[0].key);
  const [bgColor, setBgColor] = useState(swatches[0]);
  const [sortOrder, setSortOrder] = useState("1");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Ambil data kategori yang mau diedit + jumlah produk yang masih
  // memakainya (buat peringatan sebelum hapus).
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

      const [catRes, countRes] = await Promise.all([
        supabase.from("categories").select("*").eq("id", categoryId).single(),
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("category_id", categoryId),
      ]);

      if (cancelled) return;

      if (catRes.error || !catRes.data) {
        if (catRes.error?.code === "PGRST116") {
          setNotFound(true);
        } else {
          setLoadError(catRes.error?.message ?? "Gagal memuat data kategori.");
        }
        setLoading(false);
        return;
      }

      const c = catRes.data as CategoryRow;
      setLabel(c.label);
      setDisplayType(c.type);
      setImage(c.image ?? "");
      setIconKey(c.icon_key ?? availableIconKeys[0].key);
      setBgColor(c.bg_color ?? swatches[0]);
      setSortOrder(String(c.sort_order ?? 1));
      setProductCount(countRes.count ?? 0);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const sortValue = parseInt(sortOrder, 10);

    if (!label.trim()) return setError("Nama kategori wajib diisi.");
    if (displayType === "image" && !image.trim()) {
      return setError("URL gambar wajib diisi kalau tipe tampilannya Gambar.");
    }
    if (!Number.isFinite(sortValue)) return setError("Urutan harus berupa angka.");

    if (!isSupabaseConfigured) {
      setError(
        "Supabase belum dikonfigurasi di server ini. Set env NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase
      .from("categories")
      .update({
        label: label.trim(),
        type: displayType,
        image: displayType === "image" ? image.trim() : null,
        bg_color: displayType === "icon" ? bgColor : null,
        icon_key: displayType === "icon" ? iconKey : null,
        sort_order: sortValue,
      })
      .eq("id", categoryId);
    setSaving(false);

    if (updateError) {
      setError(updateError.message || "Gagal menyimpan perubahan kategori.");
      return;
    }

    refetch();
    setSuccess(true);
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    setDeleteError(null);

    const { error: deleteErr } = await supabase.from("categories").delete().eq("id", categoryId);
    setDeleting(false);

    if (deleteErr) {
      setDeleteError(deleteErr.message || "Gagal menghapus kategori.");
      return;
    }

    refetch();
    router.push("/kategori/kelola");
  }

  if (loading) {
    return <LoadingScreen label="Memuat data kategori..." />;
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center px-6 pt-24 text-center">
        <p className="text-[14px] font-bold text-ink">Kategori tidak ditemukan</p>
        <p className="mt-1.5 text-[12.5px] text-gray">
          Kategori ini mungkin sudah dihapus sebelumnya.
        </p>
        <Link
          href="/kategori/kelola"
          className="mt-6 rounded-2xl bg-primary px-6 py-3 text-[13px] font-bold text-white active:scale-[0.98] transition-transform"
        >
          Kembali ke Kelola Kategori
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
        <h1 className="mt-5 text-[17px] font-bold text-ink">Kategori diperbarui!</h1>
        <p className="mt-1.5 text-[13px] text-gray">
          Perubahan pada &ldquo;{label}&rdquo; berhasil disimpan.
        </p>

        <div className="mt-7 flex w-full flex-col gap-2.5">
          <button
            onClick={() => router.push("/kategori/kelola")}
            className="w-full rounded-2xl bg-primary py-3.5 text-[13.5px] font-bold text-white active:scale-[0.98] transition-transform"
          >
            Kembali ke Kelola Kategori
          </button>
          <button
            onClick={() => setSuccess(false)}
            className="w-full rounded-2xl bg-white py-3.5 text-[13.5px] font-bold text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-[0.98] transition-transform"
          >
            Lanjut Edit Kategori Ini
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
          href="/kategori/kelola"
          aria-label="Kembali"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} className="text-ink" />
        </Link>
        <div>
          <h1 className="text-[15px] font-bold text-ink">Edit Kategori</h1>
          <p className="text-[11.5px] text-gray">Perbarui data &ldquo;{label}&rdquo;</p>
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
            <FieldLabel required>Nama Kategori</FieldLabel>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Misal: Buah-buahan"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel>ID Kategori</FieldLabel>
            <input value={categoryId} disabled className={`${inputClass} opacity-60`} />
            <p className="mt-1.5 text-[11px] text-gray">
              ID kategori tidak bisa diubah karena dipakai sebagai kunci relasi ke produk.
            </p>
          </div>
        </section>

        {/* Tampilan kategori */}
        <section className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <h2 className="mb-3 text-[13px] font-bold text-ink">Tampilan Kategori</h2>

          <div className="mb-3 flex gap-2 rounded-xl bg-gray-light/60 p-1">
            {(["icon", "image"] as DisplayType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDisplayType(t)}
                className={`flex-1 rounded-lg py-2 text-[12.5px] font-semibold transition-colors ${
                  displayType === t ? "bg-white text-ink shadow-sm" : "text-gray"
                }`}
              >
                {t === "icon" ? "Icon Bawaan" : "URL Gambar"}
              </button>
            ))}
          </div>

          {displayType === "icon" ? (
            <>
              <div className="mb-3">
                <FieldLabel required>Icon</FieldLabel>
                <select
                  value={iconKey}
                  onChange={(e) => setIconKey(e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  {availableIconKeys.map((i) => (
                    <option key={i.key} value={i.key}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel required>Warna Latar</FieldLabel>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-11 w-11 shrink-0 cursor-pointer rounded-xl border border-black/[0.06] bg-transparent p-1"
                  />
                  <input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#2FB350"
                    className={inputClass}
                  />
                </div>
                <div className="mt-2.5 flex gap-2">
                  {swatches.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Pilih warna ${c}`}
                      onClick={() => setBgColor(c)}
                      style={{ backgroundColor: c }}
                      className={`h-6 w-6 shrink-0 rounded-full transition-transform active:scale-90 ${
                        bgColor.toLowerCase() === c.toLowerCase()
                          ? "ring-2 ring-offset-2 ring-ink/40"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <FieldLabel required>URL Gambar</FieldLabel>
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
                  placeholder="https://.../gambar-kategori.png"
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </section>

        {/* Urutan */}
        <section className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <h2 className="mb-3 text-[13px] font-bold text-ink">Urutan Tampil</h2>
          <FieldLabel required>Urutan</FieldLabel>
          <input
            inputMode="numeric"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value.replace(/[^\d]/g, ""))}
            className={inputClass}
          />
          <p className="mt-1.5 text-[11px] text-gray">Angka lebih kecil tampil lebih dulu.</p>
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
              <MorphingInfinity className="h-4 w-4" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </button>

        {/* Zona berbahaya: hapus kategori */}
        <section className="mt-2 rounded-2xl border border-dashed border-badge/30 bg-badge/5 p-4">
          <h2 className="mb-1 text-[13px] font-bold text-badge">Zona Berbahaya</h2>
          <p className="mb-3 text-[11px] text-gray">
            {productCount > 0
              ? `Kategori ini masih dipakai ${productCount} produk. Kalau dihapus, produk tersebut akan jadi "Tanpa kategori".`
              : "Kategori yang dihapus tidak bisa dikembalikan lagi."}
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-[13px] font-bold text-badge shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-[0.98] transition-transform"
          >
            <Trash2 size={15} />
            Hapus Kategori Ini
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
                Hapus kategori ini?
              </h2>
              <p className="mt-1 text-center text-[12px] text-gray">
                &ldquo;{label}&rdquo; akan dihapus permanen dan tidak bisa dikembalikan.
                {productCount > 0 && (
                  <>
                    {" "}
                    <span className="font-semibold text-badge">{productCount} produk</span> yang
                    masih pakai kategori ini akan jadi &ldquo;Tanpa kategori&rdquo;.
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
