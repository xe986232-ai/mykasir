"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import type { Category, Product } from "@/lib/products";

type CategoryRowProps = {
  category: Category;
  products: Product[];
  delay?: number;
};

export default function CategoryRow({ category, products, delay = 0 }: CategoryRowProps) {
  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between px-5">
        <h2 className="text-[15px] font-bold text-ink">{category.label}</h2>
        <Link
          href={`/produk?category=${category.id}`}
          className="text-[12px] font-semibold text-primary"
        >
          View all
        </Link>
      </div>

      <div className="mt-3.5 flex gap-3.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[148px] shrink-0">
            <ProductCard {...p} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
