"use client";

import { useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import PromoBanner from "./PromoBanner";
import Categories from "./Categories";
import ProductSection from "./ProductSection";
import type { CategoryId } from "@/lib/products";

export default function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);

  return (
    <div className="relative">
      {/* Zona atas: backdrop gradient + blob blur lembut di belakang
          Header/SearchBar/Categories, niru referensi (background warna
          nge-blur di belakang location bar & kategori). Warnanya ngikutin
          --color-primary/--color-sidebar, jadi otomatis nyesuain 3 palet
          tema yang ada. */}
      <div className="relative overflow-hidden pb-8 pt-4">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-primary-light via-primary-light/50 to-transparent" />
          <div className="absolute -top-16 -left-12 h-56 w-56 rounded-full bg-primary/25 blur-[64px]" />
          <div className="absolute -top-8 -right-14 h-52 w-52 rounded-full bg-sidebar/20 blur-[64px]" />
        </div>

        <Header />
        <SearchBar />
        <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {/* Card putih yang "nekuk": rounded di atas & narik naik (-mt) biar
          nutup/overlap dikit ke zona gradient di atasnya, kasih efek
          folded-sheet kayak referensi. */}
      <div className="relative -mt-6 rounded-t-[32px] bg-white pt-5 shadow-[0_-10px_24px_rgba(20,24,20,0.05)]">
        <PromoBanner />
        <ProductSection selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}
