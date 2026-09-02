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
      <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-white/40 bg-white/35 px-4 py-3 shadow-[0_4px_16px_rgba(20,24,20,0.06)] backdrop-blur-md">
        <Search size={18} className="text-ink/60" />
        <input
          type="text"
          placeholder="Cari produk..."
          className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-ink/50 outline-none"
        />
        <div className="h-5 w-px shrink-0 bg-ink/15" />
        <button
          aria-label="Filters"
          className="shrink-0 text-ink/70 transition-transform active:scale-90"
        >
          <SlidersHorizontal size={17} />
        </button>
      </div>
    </motion.div>
  );
}
