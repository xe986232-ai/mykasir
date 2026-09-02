"use client";

import { motion } from "framer-motion";
import DashboardIcon from "./icons/DashboardIcon";
import type { CategoryId } from "@/lib/products";

type MoreCategoriesButtonProps = {
  selected: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
};

// Tombol "View/Show All Categories" dipisah dari Categories.tsx supaya
// bisa ditaruh setelah PromoBanner di HomeContent (banner sekarang pindah
// ke atas, sebelum kartu produk, jadi urutannya: icon kategori -> banner
// -> tombol ini -> kartu produk). KasirContent tetap pakai Categories
// dengan showMoreButton default (true), jadi tidak kepengaruh perubahan ini.
export default function MoreCategoriesButton({
  selected,
  onSelect,
}: MoreCategoriesButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
      onClick={() => onSelect(null)}
      className="mx-5 mt-5 flex w-[calc(100%-40px)] items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[13px] font-semibold text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-[0.98] transition-transform"
    >
      <DashboardIcon size={16} className="text-primary" />
      {selected ? "Show All Categories" : "View More Categories"}
    </motion.button>
  );
}
