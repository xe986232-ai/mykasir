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
    <>
      <Header />
      <SearchBar />
      <PromoBanner />
      <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
      <ProductSection selectedCategory={selectedCategory} />
    </>
  );
}
