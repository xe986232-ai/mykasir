"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";

export default function SearchHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex items-center gap-2.5 px-5 pt-2"
    >
      <Link
        href="/"
        aria-label="Back"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
      >
        <ArrowLeft size={18} className="text-ink" />
      </Link>

      <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
        <Search size={18} className="text-gray" />
        <input
          type="text"
          placeholder="Would you like to eat somethings?"
          className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-gray outline-none"
        />
      </div>
    </motion.div>
  );
}
