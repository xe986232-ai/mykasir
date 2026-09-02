"use client";

import { useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import PromoBanner from "./PromoBanner";
import Categories from "./Categories";
import ProductSection from "./ProductSection";
import { GradientBackground } from "./GradientBackground";
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
        <GradientBackground className="pointer-events-none absolute inset-0 -z-10" />

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
