"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import AnimatedNumber from "./AnimatedNumber";

export default function CartBottomBar() {
  const { itemCount, subtotal, currency, openSheet } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          onClick={openSheet}
          className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[430px] items-center justify-between rounded-t-3xl bg-primary px-5 py-4 shadow-[0_-8px_24px_rgba(20,24,20,0.2)] active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <ShoppingBag size={15} className="text-white" />
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-badge px-1 text-[9px] font-bold text-white">
                <AnimatedNumber value={itemCount} />
              </span>
            </div>
            <span className="flex items-center gap-1 text-[12.5px] font-semibold text-white/90">
              <AnimatedNumber value={itemCount} /> item
            </span>
          </div>
          <AnimatedNumber
            value={subtotal}
            format={(v) => `${currency} ${Math.round(v).toLocaleString("id-ID")}`}
            className="text-[13.5px] font-extrabold text-white"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
