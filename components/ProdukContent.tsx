"use client";

import { useState } from "react";
import SearchHeader from "./SearchHeader";
import FilterChips from "./FilterChips";
import StoreRow from "./StoreRow";
import TopItemsGrid from "./TopItemsGrid";
import { isCategoryId, type CategoryId } from "@/lib/products";

type ProdukContentProps = {
  initialCategory: string | null;
};

export default function ProdukContent({ initialCategory }: ProdukContentProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>(() =>
    isCategoryId(initialCategory) ? [initialCategory] : []
  );

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
