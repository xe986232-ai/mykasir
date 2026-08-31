"use client";

import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import {
  HalalIcon,
  DealsIcon,
  FruitsIcon,
  VegetableIcon,
  DrinksIcon,
} from "./icons/Categories";

const categories = [
  { label: "Halal Shop", bg: "#F5B301", Icon: HalalIcon },
  { label: "Best Deals", bg: "#F0562E", Icon: DealsIcon },
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
        {categories.map(({ label, bg, Icon }) => (
          <button
            key={label}
            className="flex w-[58px] flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_6px_14px_rgba(20,24,20,0.1)]"
              style={{ backgroundColor: bg }}
            >
              <Icon />
            </div>
            <span className="text-center text-[11px] font-medium leading-tight text-ink">
              {label}
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
