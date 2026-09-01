"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import Header from "./Header";
import Categories from "./Categories";
import KasirProductSection from "./KasirProductSection";
import type { CategoryId } from "@/lib/products";

export default function KasirContent() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);

  return (
    <>
      <Header />

      {/* Sama posisi & gaya kayak SearchBar di halaman utama, cuma di sini
          input-nya aktif buat nyaring produk kasir. */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
        className="mt-4 flex items-center gap-2.5 px-5"
      >
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <Search size={18} className="text-gray" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-gray outline-none"
          />
        </div>
        <button
          aria-label="Filters"
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <SlidersHorizontal size={17} className="text-ink" />
        </button>
      </motion.div>

      {/* Banner promo sengaja ga ditaruh di sini — kasir cuma butuh langsung
          ke produk, ga perlu promo carousel kayak di halaman utama. */}

      <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
      <KasirProductSection selectedCategory={selectedCategory} query={query} />
    </>
  );
}
