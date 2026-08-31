"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import {
  FruitsIcon,
  VegetableIcon,
  DrinksIcon,
} from "./icons/Categories";

type ImageCategory = { label: string; image: string };
type IconCategory = {
  label: string;
  bg: string;
  Icon: () => React.ReactElement;
};

const categories: (ImageCategory | IconCategory)[] = [
  { label: "Kunci Mas", image: "/categories/kunci-mas.png" },
  { label: "Mi Instan", image: "/categories/mie-instan.png" },
  { label: "Fruits", bg: "#2FB350", Icon: FruitsIcon },
  { label: "Vegetable", bg: "#EF9526", Icon: VegetableIcon },
  { label: "Drinks", bg: "#8B5CF6", Icon: DrinksIcon },
];

export default function Categories() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
      className="mt-6 px-5"
    >
      <div className="flex items-start justify-between">
        {categories.map((cat) => (
          <button
            key={cat.label}
            className="flex w-[58px] flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            {"image" in cat ? (
              <div className="flex h-14 w-14 items-center justify-center">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                />
              </div>
            ) : (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_6px_14px_rgba(20,24,20,0.1)]"
                style={{ backgroundColor: cat.bg }}
              >
                <cat.Icon />
              </div>
            )}
            <span className="text-center text-[11px] font-medium leading-tight text-ink">
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[13px] font-semibold text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-[0.98] transition-transform">
        <LayoutGrid size={16} className="text-primary" />
        View More Categories
      </button>
    </motion.div>
  );
}
