"use client";

import { motion } from "framer-motion";

const stores = [
  { name: "GreenMart", initial: "G", bg: "#2FB350" },
  { name: "Freshko", initial: "F", bg: "#3B6DF0" },
  { name: "LuluHyp...", initial: "L", bg: "#F0562E" },
  { name: "Nesto", initial: "N", bg: "#F5B301" },
  { name: "VivaSup...", initial: "V", bg: "#8B5CF6" },
  { name: "AlMaya", initial: "A", bg: "#0EA5A5" },
];

export default function StoreRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
      className="mt-6 px-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[--color-ink]">
          Top Grocery Stores
        </h2>
        <button className="text-[12px] font-semibold text-[--color-primary]">
          View all
        </button>
      </div>

      <div className="mt-3 flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stores.map((s) => (
          <button
            key={s.name}
            className="flex w-[58px] shrink-0 flex-col items-center gap-1.5 active:scale-95 transition-transform"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-[15px] font-extrabold text-white shadow-[0_2px_10px_rgba(20,24,20,0.06)]"
              style={{ backgroundColor: s.bg }}
            >
              {s.initial}
            </div>
            <span className="truncate text-[10px] text-[--color-gray]">
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
