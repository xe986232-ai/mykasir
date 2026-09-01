"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import CategoryRow from "./CategoryRow";
import { categories, products, type CategoryId } from "@/lib/products";

const INITIAL_COUNT = 6;

type TopItemsGridProps = {
  activeCategoryIds: CategoryId[];
  deliveryOnly: boolean;
};

export default function TopItemsGrid({ activeCategoryIds, deliveryOnly }: TopItemsGridProps) {
  const [expanded, setExpanded] = useState(false);

  const base = deliveryOnly ? products.filter((p) => p.delivery) : products;

  // Browse mode: no category filter picked, show every category
  // as its own horizontally scrollable row (same pattern as home).
  if (activeCategoryIds.length === 0) {
    return (
      <div className="mt-6 flex flex-col gap-6 pb-6">
        {categories.map((category, i) => (
          <CategoryRow
            key={category.id}
            category={category}
            products={base.filter((p) => p.category === category.id)}
            delay={0.1 + i * 0.05}
          />
        ))}
      </div>
    );
  }

  // Filtered mode: one or more category chips active, show a single grid.
  const filtered = base.filter((p) => activeCategoryIds.includes(p.category));
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);
  const title =
    activeCategoryIds.length === 1
      ? categories.find((c) => c.id === activeCategoryIds[0])?.label ?? "Produk"
      : "Hasil Filter";

  return (
    <motion.div
      key={activeCategoryIds.join(",")}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mt-6 px-5 pb-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-ink">{title}</h2>
        {filtered.length > INITIAL_COUNT && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[12px] font-semibold text-primary active:opacity-60"
          >
            {expanded ? "Show less" : "View all"}
          </button>
        )}
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-3.5">
        <AnimatePresence initial={false}>
          {visible.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard {...p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-[12px] text-gray">
          Produk tidak ditemukan.
        </p>
      )}
    </motion.div>
  );
}
