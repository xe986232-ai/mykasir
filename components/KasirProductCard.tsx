"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "./CartContext";

export default function KasirProductCard(product: Omit<Product, "category">) {
  const { name, unit, price, Icon, image } = product;
  const { items, addItem } = useCart();

  const cartItem = items.find((it) => it.id === product.id);
  const qty = cartItem?.qty ?? 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white p-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)] transition-shadow ${
        qty > 0 ? "ring-2 ring-primary" : ""
      }`}
    >
      <button
        onClick={() => addItem(product)}
        aria-label={`Tambah ${name} ke keranjang`}
        className="flex h-[92px] w-full items-center justify-center active:scale-95 transition-transform"
      >
        {image ? (
          <div className="h-[76px] w-[76px] overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={name}
              width={76}
              height={76}
              className="h-full w-full object-contain"
            />
          </div>
        ) : Icon ? (
          <div className="h-[76px] w-[76px]">
            <Icon />
          </div>
        ) : null}
      </button>

      <p className="mt-1 text-[13.5px] font-extrabold text-ink">{price}</p>
      <div className="mt-1 flex items-end justify-between gap-1">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-ink">{name}</p>
          <p className="text-[10.5px] text-gray">{unit}</p>
        </div>

        {/* Sengaja cuma tombol tambah polos — atur/kurangi jumlah dilakukan
            di overlay checkout (CartSheet), bukan di card ini. Badge kecil
            di pojok cuma indikator jumlah yang udah masuk keranjang. */}
        <button
          onClick={() => addItem(product)}
          aria-label={`Tambah ${name} ke keranjang`}
          className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white active:scale-90 transition-transform"
        >
          <Plus size={14} strokeWidth={2.8} />
          {qty > 0 && (
            <motion.span
              key={qty}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-badge px-1 text-[9px] font-bold text-white"
            >
              {qty}
            </motion.span>
          )}
        </button>
      </div>
    </div>
  );
}
