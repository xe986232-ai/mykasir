"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import CategoryRow from "./CategoryRow";
import { categories, products, getCategoryById, type CategoryId } from "@/lib/products";

type ProductSectionProps = {
  selectedCategory: CategoryId | null;
};

export default function ProductSection({ selectedCategory }: ProductSectionProps) {
  if (selectedCategory) {
    const category = getCategoryById(selectedCategory);
    const filtered = products.filter((p) => p.category === selectedCategory);

    return (
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-6 px-5 pb-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-ink">
            {category?.label ?? "Produk"}
          </h2>
          <span className="text-[12px] font-medium text-gray">
            {filtered.length} produk
          </span>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-3.5">
          <AnimatePresence initial={false}>
            {filtered.map((p) => (
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
            Belum ada produk di kategori ini.
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-6 pb-6">
      {categories.map((category, i) => (
        <CategoryRow
          key={category.id}
          category={category}
          products={products.filter((p) => p.category === category.id)}
          delay={0.15 + i * 0.05}
        />
      ))}
    </div>
  );
}
