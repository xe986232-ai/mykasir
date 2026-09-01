"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import CategoryRow from "./CategoryRow";
import type { CategoryId } from "@/lib/products";
import { useProductsData } from "./ProductsDataContext";
import LoadingScreen from "./LoadingScreen";

type ProductSectionProps = {
  selectedCategory: CategoryId | null;
};

export default function ProductSection({ selectedCategory }: ProductSectionProps) {
  const { categories, products, getCategoryById, loading } = useProductsData();

  if (loading && products.length === 0) {
    return <LoadingScreen label="Memuat produk..." />;
  }

  if (selectedCategory) {
    const category = getCategoryById(selectedCategory);
    const filtered = products.filter((p) => p.category === selectedCategory);

    // Kelompokkan produk per brand (urutan kemunculan brand pertama kali).
    // Produk tanpa brand ditampung terpisah di grup "Lainnya" di akhir.
    const brandOrder: string[] = [];
    const brandGroups = new Map<string, typeof filtered>();
    const noBrand: typeof filtered = [];

    for (const p of filtered) {
      const brand = p.brand?.trim();
      if (!brand) {
        noBrand.push(p);
        continue;
      }
      if (!brandGroups.has(brand)) {
        brandGroups.set(brand, []);
        brandOrder.push(brand);
      }
      brandGroups.get(brand)!.push(p);
    }

    // Grouping cuma dipakai kalau emang ada 2+ brand berbeda di kategori
    // ini — kalau cuma 1 brand (atau ga ada brand sama sekali), tetep
    // tampil grid biasa biar ga ada sub-judul yang ga perlu.
    const shouldGroupByBrand = brandOrder.length >= 2;

    return (
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-6 pb-6"
      >
        <div className="flex items-center justify-between px-5">
          <h2 className="text-[15px] font-bold text-ink">
            {category?.label ?? "Produk"}
          </h2>
          <span className="text-[12px] font-medium text-gray">
            {filtered.length} produk
          </span>
        </div>

        {shouldGroupByBrand ? (
          <div className="mt-3.5 flex flex-col gap-5">
            {brandOrder.map((brand) => (
              <div key={brand}>
                <h3 className="px-5 text-[13px] font-bold text-ink">{brand}</h3>
                <div className="mt-2.5 flex gap-3.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {brandGroups.get(brand)!.map((p) => (
                    <div key={p.id} className="w-[148px] shrink-0">
                      <ProductCard {...p} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {noBrand.length > 0 && (
              <div>
                <h3 className="px-5 text-[13px] font-bold text-ink">Lainnya</h3>
                <div className="mt-2.5 flex gap-3.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {noBrand.map((p) => (
                    <div key={p.id} className="w-[148px] shrink-0">
                      <ProductCard {...p} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3.5 grid grid-cols-2 gap-3.5 px-5">
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
        )}

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
