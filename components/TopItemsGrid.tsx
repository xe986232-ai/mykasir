"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard, { type Product } from "./ProductCard";
import {
  CarrotIcon,
  PomegranateIcon,
  OnionIcon,
  RaspberryIcon,
  TomatoIcon,
  BroccoliIcon,
  PapayaIcon,
  StrawberryIcon,
} from "./icons/Produce";

const items: Product[] = [
  { id: 1, name: "Carrot Vegetable", unit: "Per 1 KG (Pcs)", price: "2.25 AED", Icon: CarrotIcon },
  { id: 2, name: "Pomegranate Fruit", unit: "Per 1 KG (Pcs)", price: "9.00 AED", Icon: PomegranateIcon },
  { id: 3, name: "Onion Vegetable", unit: "Per 1 KG (Pcs)", price: "3.50 AED", Icon: OnionIcon },
  { id: 4, name: "Raspberries Fruit", unit: "Per 500 GM", price: "12.00 AED", Icon: RaspberryIcon },
  { id: 5, name: "Tomato Vegetable", unit: "Per 1 KG (Pcs)", price: "5.00 AED", Icon: TomatoIcon },
  { id: 6, name: "Broccoli Vegetable", unit: "Per 1 KG (Pcs)", price: "2.00 AED", Icon: BroccoliIcon },
  { id: 7, name: "Papaya Fruit", unit: "Per 1 KG (Pcs)", price: "6.50 AED", delivery: true, Icon: PapayaIcon },
  { id: 8, name: "Strawberry Fruit", unit: "Per 500 GM", price: "9.00 AED", delivery: true, Icon: StrawberryIcon },
];

const INITIAL_COUNT = 6;

export default function TopItemsGrid() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, INITIAL_COUNT);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
      className="mt-6 px-5 pb-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-ink">Top Items 2025</h2>
        {items.length > INITIAL_COUNT && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[12px] font-semibold text-primary active:opacity-60"
          >
            {expanded ? "Show less" : "View all"}
          </button>
        )}
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-3.5">
        <AnimatePresence initial={false}>
          {visible.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard {...p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
