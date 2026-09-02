"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import DashboardIcon from "./icons/DashboardIcon";
import type { CategoryId } from "@/lib/products";
import { useProductsData } from "./ProductsDataContext";

type CategoriesProps = {
  selected: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
};

// Palet gradient custom niru referensi (tiap kategori dapet warna beda
// gantian): peach, orange, pink, biru muda, orange-merah. Dipakein
// bergantian per index, ga peduli tipe kategorinya image atau icon.
const CATEGORY_GRADIENTS = [
  "linear-gradient(180deg, #FFC08A 0%, #FFFFFF 85%)",
  "linear-gradient(180deg, #FF9F5A 0%, #FFFFFF 85%)",
  "linear-gradient(180deg, #F28FB4 0%, #FFFFFF 85%)",
  "linear-gradient(180deg, #8FD3F4 0%, #FFFFFF 85%)",
  "linear-gradient(180deg, #FF7A50 0%, #FFFFFF 85%)",
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

export default function Categories({ selected, onSelect }: CategoriesProps) {
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
                  boxShadow: isActive ? ACTIVE_RING_GLOW : undefined,
                }}
                className="flex h-14 w-14 items-center justify-center rounded-full transition-shadow"
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

      <button
        onClick={() => onSelect(null)}
        className="mx-5 mt-5 flex w-[calc(100%-40px)] items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[13px] font-semibold text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-[0.98] transition-transform"
      >
        <DashboardIcon size={16} className="text-primary" />
        {selected ? "Show All Categories" : "View More Categories"}
      </button>
    </motion.div>
  );
}
