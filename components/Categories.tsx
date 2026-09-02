"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
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
  "linear-gradient(135deg, #FFE8D1 0%, #FFC08A 100%)",
  "linear-gradient(135deg, #FFE3C2 0%, #FF9F5A 100%)",
  "linear-gradient(135deg, #FBD9E4 0%, #F28FB4 100%)",
  "linear-gradient(135deg, #D3F1FF 0%, #8FD3F4 100%)",
  "linear-gradient(135deg, #FFE0C7 0%, #FF7A50 100%)",
];

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
                style={{ background: gradient }}
                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-[0_6px_14px_rgba(20,24,20,0.12)] transition-shadow ${
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-page"
                    : ""
                }`}
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
                className={`text-center text-[11px] leading-tight ${
                  isActive ? "font-bold text-primary" : "font-medium text-ink"
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
        <LayoutGrid size={16} className="text-primary" />
        {selected ? "Show All Categories" : "View More Categories"}
      </button>
    </motion.div>
  );
}
