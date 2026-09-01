"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Bungkus angka/teks (harga, qty, kembalian, dll) yang nilainya sering
 * berubah, biar transisinya ga kaku — tiap kali `value` berubah, teks lama
 * geser+fade keluar dan yang baru geser+fade masuk (efek mirip odometer).
 * Dipakai di CartBottomBar & CartSheet buat total harga, qty, kembalian.
 */
export default function AnimatedNumber({
  value,
  className,
}: {
  value: string | number;
  className?: string;
}) {
  return (
    <span className={`relative inline-grid overflow-hidden ${className ?? ""}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0, position: "absolute" }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="col-start-1 row-start-1"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
