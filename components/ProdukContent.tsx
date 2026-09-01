"use client";

import { useEffect, useRef, useState } from "react";
import SearchHeader from "./SearchHeader";
import FilterChips from "./FilterChips";
import StoreRow from "./StoreRow";
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
      <SearchHeader />
      <FilterChips active={activeFilters} onToggle={toggle} />
      <StoreRow />
      <TopItemsGrid activeCategoryIds={activeCategoryIds} deliveryOnly={deliveryOnly} />
    </>
  );
}
