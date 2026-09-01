"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Tag } from "lucide-react";
import SearchHeader from "./SearchHeader";
import FilterChips from "./FilterChips";
import TopItemsGrid from "./TopItemsGrid";
import type { CategoryId } from "@/lib/products";
import { useProductsData } from "./ProductsDataContext";

type ProdukContentProps = {
  initialCategory: string | null;
};

export default function ProdukContent({ initialCategory }: ProdukContentProps) {
  const { isCategoryId, categories } = useProductsData();
  const [activeFilters, setActiveFilters] = useState<string[]>(() =>
    isCategoryId(initialCategory) ? [initialCategory] : []
  );

  // categories dari Supabase belum tentu udah ke-load pas render pertama,
  // jadi begitu udah ada isinya, coba apply ulang initialCategory dari URL.
  const applied = useRef(false);
  useEffect(() => {
    if (applied.current || categories.length === 0) return;
    applied.current = true;
    if (isCategoryId(initialCategory) && !activeFilters.includes(initialCategory)) {
      setActiveFilters((prev) => [...prev, initialCategory]);
    }
  }, [categories, initialCategory, isCategoryId, activeFilters]);

  function toggle(id: string) {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  const activeCategoryIds = activeFilters.filter(isCategoryId) as CategoryId[];
  const deliveryOnly = activeFilters.includes("delivery");

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
          <p className="text-[11.5px] text-gray">Tambah &amp; kelola produk tokomu</p>
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
            href="/produk/tambah"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-[12.5px] font-bold text-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
          >
            <Plus size={15} strokeWidth={2.6} />
            Tambah
          </Link>
        </div>
      </motion.div>

      <SearchHeader />
      <FilterChips active={activeFilters} onToggle={toggle} />
      <TopItemsGrid activeCategoryIds={activeCategoryIds} deliveryOnly={deliveryOnly} />
    </>
  );
}
