"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { useCart } from "./CartContext";

// Badge mengambang "Mulai Jual" di pojok kanan-bawah halaman utama, ngarah
// ke /kasir. Sengaja dirender lewat <Link> (bukan tombol biasa) biar
// navigasinya instan ala Next.js. Posisinya fixed kayak CartBottomBar,
// jadi komponen ini dirender langsung di AppShell (di luar div
// ber-transform) biar ga ikut kegeser pas sidebar dibuka — dan cuma
// tampil di halaman utama ("/").
export default function StartSellingBadge() {
  const { itemCount } = useCart();
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        // Naik dikit pas CartBottomBar lagi muncul biar ga numpuk.
        y: itemCount > 0 ? -78 : 0,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="fixed bottom-5 z-30 mx-auto w-full max-w-[430px]"
      style={{ pointerEvents: "none" }}
    >
      <div className="relative mx-auto h-0 w-full max-w-[430px]">
        <Link
          href="/kasir"
          style={{ pointerEvents: "auto" }}
          className="absolute right-5 flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-dark py-3 pl-3.5 pr-4 text-white shadow-[0_10px_24px_rgba(34,145,64,0.4)] transition-transform active:scale-95"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <Store size={14} strokeWidth={2.4} />
          </span>
          <span className="text-[13px] font-bold tracking-tight">
            Mulai Jual
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
