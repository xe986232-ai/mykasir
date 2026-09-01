"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import type { CategoryId } from "@/lib/products";
import { useProductsData } from "./ProductsDataContext";

type CategoriesProps = {
  selected: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
};

export default function Categories({ selected, onSelect }: CategoriesProps) {
  const { categories, loading } = useProductsData();

  if (loading && categories.length === 0) {
    return (
      <div className="mt-6 flex gap-3 px-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-white/70"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
      className="mt-6 px-5"
    >
      <div className="flex items-start justify-between">
        {categories.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(isActive ? null : cat.id)}
              aria-pressed={isActive}
              className="flex w-[58px] flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-shadow ${
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-[#EFF1F0]"
                    : ""
                }`}
              >
                {cat.type === "image" ? (
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-2xl object-contain"
                  />
                ) : (
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_6px_14px_rgba(20,24,20,0.1)]"
                    style={{ backgroundColor: cat.bg }}
                  >
                    <cat.Icon />
                  </div>
                )}
              </div>
              <span
                className={`text-center text-[11px] leading-tight ${
                  isActive ? "font-bold text-primary" : "font-medium text-ink"
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onSelect(null)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[13px] font-semibold text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-[0.98] transition-transform"
      >
        <LayoutGrid size={16} className="text-primary" />
        {selected ? "Show All Categories" : "View More Categories"}
      </button>
    </motion.div>
  );
}
