"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ImageOff, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useProductsData } from "./ProductsDataContext";

// Icon bawaan yang beneran punya komponen React di ProductsDataContext
// (lihat categoryIconMap di sana). Kalau nanti nambah icon baru, tambahin
// juga di categoryIconMap + di sini biar konsisten.
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function TambahKategoriForm() {
  const router = useRouter();
  const { refetch } = useProductsData();

  const [existingIds, setExistingIds] = useState<string[]>([]);
  const [nextSortOrder, setNextSortOrder] = useState(1);
  const [loadingExisting, setLoadingExisting] = useState(true);

  const [label, setLabel] = useState("");
  const [id, setId] = useState("");
  const [idTouched, setIdTouched] = useState(false);
  const [displayType, setDisplayType] = useState<DisplayType>("icon");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [iconKey, setIconKey] = useState(availableIconKeys[0].key);
  const [bgColor, setBgColor] = useState(swatches[0]);
  const [sortOrder, setSortOrder] = useState("1");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Ambil daftar id kategori yang udah ada (buat validasi duplikat) +
  // sort_order tertinggi (buat nyaranin urutan berikutnya).
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isSupabaseConfigured) {
        setLoadingExisting(false);
        return;
      }
      const { data } = await supabase.from("categories").select("id, sort_order");
      if (cancelled || !data) return;
      const ids = data.map((r: { id: string }) => r.id);
      const maxSort = data.reduce(
        (max: number, r: { sort_order: number | null }) => Math.max(max, r.sort_order ?? 0),
        0
      );
      setExistingIds(ids);
      const suggested = maxSort + 1;
      setNextSortOrder(suggested);
      setSortOrder(String(suggested));
      setLoadingExisting(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleLabelChange(value: string) {
    setLabel(value);
    if (!idTouched) setId(slugify(value));
  }

  function resetForm() {
    setLabel("");
    setId("");
    setIdTouched(false);
    setDisplayType("icon");
    setImage("");
    setImageError(false);
    setIconKey(availableIconKeys[0].key);
    setBgColor(swatches[0]);
    const suggested = nextSortOrder + 1;
    setNextSortOrder(suggested);
    setSortOrder(String(suggested));
    setExistingIds((prev) => [...prev, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanId = id.trim();
    const sortValue = parseInt(sortOrder, 10);

    if (!label.trim()) return setError("Nama kategori wajib diisi.");
    if (!cleanId) return setError("ID kategori wajib diisi.");
    if (!/^[a-z0-9-]+$/.test(cleanId)) {
      return setError("ID kategori cuma boleh huruf kecil, angka, dan tanda strip (-).");
    }
    if (existingIds.includes(cleanId)) {
      return setError(`ID "${cleanId}" udah dipakai kategori lain. Pakai ID lain.`);
    }
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
    const { error: insertError } = await supabase.from("categories").insert({
      id: cleanId,
      label: label.trim(),
      type: displayType,
      image: displayType === "image" ? image.trim() : null,
      bg_color: displayType === "icon" ? bgColor : null,
      icon_key: displayType === "icon" ? iconKey : null,
      sort_order: sortValue,
    });
    setSaving(false);

    if (insertError) {
      setError(insertError.message || "Gagal menyimpan kategori ke Supabase.");
      return;
    }

    refetch();
    setSuccess(true);
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
        <h1 className="mt-5 text-[17px] font-bold text-ink">Kategori tersimpan!</h1>
        <p className="mt-1.5 text-[13px] text-gray">
          &ldquo;{label}&rdquo; berhasil ditambahkan ke daftar kategori.
        </p>

        <div className="mt-7 flex w-full flex-col gap-2.5">
          <button
            onClick={() => {
              resetForm();
              setSuccess(false);
            }}
            className="w-full rounded-2xl bg-primary py-3.5 text-[13.5px] font-bold text-white active:scale-[0.98] transition-transform"
          >
            Tambah Kategori Lain
          </button>
          <button
            onClick={() => router.push("/produk")}
            className="w-full rounded-2xl bg-white py-3.5 text-[13.5px] font-bold text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-[0.98] transition-transform"
          >
            Lihat Daftar Produk
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
          href="/produk"
          aria-label="Kembali"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} className="text-ink" />
        </Link>
        <div>
          <h1 className="text-[15px] font-bold text-ink">Tambah Kategori</h1>
          <p className="text-[11.5px] text-gray">Buat kategori baru untuk produk tokomu</p>
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
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Misal: Buah-buahan"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel required>ID Kategori</FieldLabel>
            <input
              value={id}
              onChange={(e) => {
                setIdTouched(true);
                setId(slugify(e.target.value));
              }}
              placeholder="misal: buah-buahan"
              className={inputClass}
            />
            <p className="mt-1.5 text-[11px] text-gray">
              Otomatis dibuat dari nama, tapi bisa diubah. Huruf kecil, angka, strip (-) saja —
              dipakai sebagai ID unik di database.
            </p>
            {!loadingExisting && id && existingIds.includes(id) && (
              <p className="mt-1 text-[11px] font-semibold text-badge">
                ID ini sudah dipakai kategori lain.
              </p>
            )}
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
                        bgColor.toLowerCase() === c.toLowerCase() ? "ring-2 ring-offset-2 ring-ink/40" : ""
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
          <p className="mt-1.5 text-[11px] text-gray">
            Angka lebih kecil tampil lebih dulu. Disarankan: {nextSortOrder}.
          </p>
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
            "Simpan Kategori"
          )}
        </button>
      </motion.form>
    </>
  );
}
