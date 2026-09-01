"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { categories, products, type CategoryId } from "@/lib/products";
import KasirProductCard from "./KasirProductCard";
import CartBottomBar from "./CartBottomBar";
import CartSheet from "./CartSheet";

export default function KasirContent() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory ? p.category === activeCategory : true;
      const matchesQuery = query.trim()
        ? p.name.toLowerCase().includes(query.trim().toLowerCase())
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-5 pt-2">
        <h1 className="text-[17px] font-extrabold text-ink">Kasir</h1>
        <p className="text-[12px] text-gray">Pilih produk buat ditambah ke keranjang</p>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-3 px-5"
      >
        <div className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <Search size={17} className="text-gray" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-gray outline-none"
          />
        </div>
      </motion.div>

      {/* Category chips */}
      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${
            activeCategory === null
              ? "bg-primary text-white"
              : "bg-white text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)]"
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-white"
                : "bg-white text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="mt-3 flex-1 px-5 pb-28">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-[12.5px] text-gray">
            Produk ga ketemu.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {filtered.map((p) => (
              <KasirProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>

      <CartBottomBar onOpen={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
