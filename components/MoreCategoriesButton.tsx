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
      style={{
        background:
          "linear-gradient(180deg, rgba(96,165,250,0.35) 0%, rgba(191,219,254,0.2) 100%)",
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 10px rgba(37,99,235,0.10)",
      }}
      className="mx-5 mt-5 flex w-[calc(100%-40px)] items-center justify-center gap-2 rounded-2xl border border-white/50 py-3.5 text-[13px] font-semibold text-[#2563eb] active:scale-[0.98] transition-transform"
    >
      <DashboardIcon size={16} className="text-[#2563eb]" />
      {selected ? "Show All Categories" : "View More Categories"}
    </motion.button>
  );
}
