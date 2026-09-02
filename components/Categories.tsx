"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import DashboardIcon from "./icons/DashboardIcon";
import type { CategoryId } from "@/lib/products";
import { useProductsData } from "./ProductsDataContext";

type CategoriesProps = {
  selected: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
  // Dipakai HomeContent buat misahin baris icon kategori sama tombol
  // "View/Show All Categories" — biar PromoBanner bisa disisipin di
  // antara keduanya (banner sekarang pindah ke atas, sebelum kartu
  // produk, bukan numpang di dalam kartu putih lagi). KasirContent
  // masih pakai default (true), jadi tetep nampilin keduanya sekaligus.
  showMoreButton?: boolean;
};

// Semua kategori sekarang pakai satu palet biru (bukan gantian warna per
// index lagi). Kesan "kaca" dibikin cuma dari gradient transparan + inner
// highlight (box-shadow inset) di elemennya — sengaja TANPA backdrop-blur,
// karena live blur di banyak elemen sekaligus bikin scroll kerasa berat
// (mahal buat GPU, apalagi di HP low-end/webview).
const CATEGORY_GRADIENTS = [
  "linear-gradient(180deg, rgba(96,165,250,0.55) 0%, rgba(191,219,254,0.35) 55%, rgba(255,255,255,0.25) 100%)",
];

// Warna aksen "aktif" dipisah dari --color-primary (yang ikut ganti-ganti
// tema oranye/lime/terracotta) karena sekarang background homepage-nya
// gradient biru custom (lihat GradientBackground.tsx) yang gak ikut tema.
// Dipakein biru yang senada sama gradient itu (bukan hijau/oranye dari
// tema) supaya nyatu, plus dibuat sebagai soft glow (bukan ring solid +
// ring-offset warna flat) biar blend ke background, bukan nabrak.
const ACTIVE_ACCENT = "#2563eb";
const ACTIVE_RING_GLOW =
  "0 0 0 3px rgba(37, 99, 235, 0.30), 0 6px 16px rgba(37, 99, 235, 0.30)";

export default function Categories({
  selected,
  onSelect,
  showMoreButton = true,
}: CategoriesProps) {
  const { categories, loading } = useProductsData();

  // Sengaja ga render loading di sini — biar ga dobel sama LoadingScreen
  // full-frame yang udah ditampilin ProductSection/KasirProductSection
  // (yang mantau `loading` flag yang sama). Pas data belum ada, section
  // di bawahnya yang ngurus tampilan loading tunggal.
  if (loading && categories.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
      className="mt-6"
    >
      <div className="flex items-start gap-3 overflow-x-auto px-5 pt-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat, i) => {
          const isActive = selected === cat.id;
          const gradient = CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length];
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(isActive ? null : cat.id)}
              aria-pressed={isActive}
              style={{ width: "calc((100% - 48px) / 5)" }}
              className="flex shrink-0 flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div
                style={{
                  background: gradient,
                  boxShadow: isActive
                    ? ACTIVE_RING_GLOW
                    : "inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -3px 6px rgba(37,99,235,0.15)",
                }}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 transition-shadow"
              >
                {cat.type === "image" ? (
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain drop-shadow-sm"
                    unoptimized
                  />
                ) : (
                  <cat.Icon />
                )}
              </div>
              <span
                style={isActive ? { color: ACTIVE_ACCENT } : undefined}
                className={`text-center text-[11px] leading-tight ${
                  isActive ? "font-bold" : "font-medium text-ink"
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {showMoreButton && (
        <button
          onClick={() => onSelect(null)}
          className="mx-5 mt-5 flex w-[calc(100%-40px)] items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[13px] font-semibold text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-[0.98] transition-transform"
        >
          <DashboardIcon size={16} className="text-primary" />
          {selected ? "Show All Categories" : "View More Categories"}
        </button>
      )}
    </motion.div>
  );
}
