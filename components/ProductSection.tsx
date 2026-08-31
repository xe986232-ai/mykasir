"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Truck } from "lucide-react";
import {
  PapayaIcon,
  StrawberryIcon,
  CarrotIcon,
  TomatoIcon,
} from "./icons/Produce";

const products = [
  {
    id: 1,
    name: "Papaya Fruit",
    unit: "Per 1 KG (Pcs)",
    price: "6.50 AED",
    delivery: true,
    Icon: PapayaIcon,
  },
  {
    id: 2,
    name: "Strawberry Fruit",
    unit: "Per 500 GM",
    price: "9.00 AED",
    delivery: true,
    Icon: StrawberryIcon,
  },
  {
    id: 3,
    name: "Carrot Vegetable",
    unit: "Per 1 KG (Pcs)",
    price: "2.25 AED",
    delivery: false,
    Icon: CarrotIcon,
  },
  {
    id: 4,
    name: "Tomato Vegetable",
    unit: "Per 1 KG (Pcs)",
    price: "5.00 AED",
    delivery: false,
    Icon: TomatoIcon,
  },
];

export default function ProductSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
      className="mt-6 px-5 pb-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[--color-ink]">
          Top Fruits 2025
        </h2>
        <button className="text-[12px] font-semibold text-[--color-primary]">
          View all
        </button>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-3.5">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </motion.div>
  );
}

function ProductCard({
  name,
  unit,
  price,
  delivery,
  Icon,
}: {
  name: string;
  unit: string;
  price: string;
  delivery: boolean;
  Icon: () => React.ReactElement;
}) {
  const [added, setAdded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
      {delivery && (
        <span className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-[--color-delivery] px-2 py-1 text-[9px] font-bold text-white">
          <Truck size={10} strokeWidth={2.5} />
          Free Delivery
        </span>
      )}

      <div className="flex h-[92px] items-center justify-center">
        <div className="h-[76px] w-[76px]">
          <Icon />
        </div>
      </div>

      <p className="mt-1 text-[13.5px] font-extrabold text-[--color-ink]">
        {price}
      </p>
      <div className="mt-1 flex items-end justify-between gap-1">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-[--color-ink]">
            {name}
          </p>
          <p className="text-[10.5px] text-[--color-gray]">{unit}</p>
        </div>

        <motion.button
          aria-label={`Add ${name} to cart`}
          onClick={() => setAdded(true)}
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
                <path d="M4 10.5l4 4L16 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
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
