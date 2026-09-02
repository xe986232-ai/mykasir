"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Truck } from "lucide-react";
import type { Product } from "@/lib/products";

export default function ProductCard({
  name,
  unit,
  price,
  delivery,
  Icon,
  image,
}: Omit<Product, "id" | "category">) {
  const [added, setAdded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
      {delivery && (
        <span className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-delivery px-2 py-1 text-[9px] font-bold text-white">
          <Truck size={10} strokeWidth={2.5} />
          Free Delivery
        </span>
      )}

      <div className="flex h-[92px] items-center justify-center">
        {image ? (
          <div className="h-[76px] w-[76px] overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={name}
              width={76}
              height={76}
              className="h-full w-full object-contain"
              unoptimized
            />
          </div>
        ) : Icon ? (
          <div className="h-[76px] w-[76px]">
            <Icon />
          </div>
        ) : null}
      </div>

      <p className="mt-1 text-[13.5px] font-extrabold text-ink">
        {price}
      </p>
      <div className="mt-1 flex items-end justify-between gap-1">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-ink">
            {name}
          </p>
          <p className="text-[10.5px] text-gray">{unit}</p>
        </div>

        <motion.button
          aria-label={`Add ${name} to cart`}
          onClick={() => {
            setAdded(true);
          }}
          whileTap={{ scale: 0.85 }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: added ? "#1F9D3F" : "#2FB350" }}
        >
          <motion.span
            key={added ? "check" : "plus"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            {added ? (
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10.5l4 4L16 6"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <Plus size={14} strokeWidth={2.8} />
            )}
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}
