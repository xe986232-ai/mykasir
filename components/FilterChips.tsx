"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";

const filters = [
  { id: "sort", label: "Sort by", icon: ArrowUpDown },
  { id: "delivery", label: "Free Delivery" },
  { id: "stores", label: "Stores" },
  { id: "fruits", label: "Fruits" },
  { id: "veg", label: "Vegetable" },
];

export default function FilterChips() {
  const [active, setActive] = useState<string[]>([]);

  function toggle(id: string) {
    setActive((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
      className="mt-3 flex items-center gap-2.5">
      <button
        aria-label="Filters"
        className="ml-5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
      >
        <SlidersHorizontal size={15} className="text-ink" />
      </button>

      <div className="flex gap-2 overflow-x-auto pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map(({ id, label, icon: Icon }) => {
          const isActive = active.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-white text-ink shadow-[0_2px_10px_rgba(20,24,20,0.06)]"
              }`}
            >
              {Icon && <Icon size={13} strokeWidth={2.4} />}
              {label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
