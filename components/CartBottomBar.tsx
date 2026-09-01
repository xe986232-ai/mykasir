"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export default function CartBottomBar({ onOpen }: { onOpen: () => void }) {
  const { itemCount, subtotal, currency } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          onClick={onOpen}
          className="absolute inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-2xl bg-primary px-4 py-3.5 shadow-[0_10px_24px_rgba(20,24,20,0.25)] active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <ShoppingBag size={15} className="text-white" />
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-badge px-1 text-[9px] font-bold text-white">
                {itemCount}
              </span>
            </div>
            <span className="text-[12.5px] font-semibold text-white/90">
              {itemCount} item
            </span>
          </div>
          <span className="text-[13.5px] font-extrabold text-white">
            {subtotal.toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {currency}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
