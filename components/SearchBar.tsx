"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
  return (
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
  );
}
