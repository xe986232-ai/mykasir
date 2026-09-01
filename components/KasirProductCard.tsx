"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "./CartContext";

export default function KasirProductCard(product: Omit<Product, "category">) {
  const { name, unit, price, Icon, image } = product;
  const { items, addItem, increment, decrement } = useCart();

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
      <p className="truncate text-[12px] font-medium text-ink">{name}</p>
      <p className="text-[10.5px] text-gray">{unit}</p>

      <div className="mt-2">
        {qty === 0 ? (
          <button
            onClick={() => addItem(product)}
            className="flex w-full items-center justify-center gap-1 rounded-xl bg-primary py-2 text-[12px] font-bold text-white active:scale-[0.97] transition-transform"
          >
            <Plus size={13} strokeWidth={2.8} />
            Tambah
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between rounded-xl bg-primary-light px-1 py-1"
          >
            <button
              onClick={() => decrement(product.id)}
              aria-label={`Kurangi ${name}`}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-primary shadow-sm active:scale-90 transition-transform"
            >
              <Minus size={13} strokeWidth={2.8} />
            </button>
            <span className="text-[13px] font-bold text-primary-dark">
              {qty}
            </span>
            <button
              onClick={() => increment(product.id)}
              aria-label={`Tambah ${name}`}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-sm active:scale-90 transition-transform"
            >
              <Plus size={13} strokeWidth={2.8} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
