"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard, { type Product } from "./ProductCard";
import { PapayaIcon, StrawberryIcon, CarrotIcon, TomatoIcon } from "./icons/Produce";

const products: Product[] = [
  { id: 1, name: "Papaya Fruit", unit: "Per 1 KG (Pcs)", price: "6.50 AED", delivery: true, Icon: PapayaIcon },
  { id: 2, name: "Strawberry Fruit", unit: "Per 500 GM", price: "9.00 AED", delivery: true, Icon: StrawberryIcon },
  { id: 3, name: "Carrot Vegetable", unit: "Per 1 KG (Pcs)", price: "2.25 AED", delivery: false, Icon: CarrotIcon },
  { id: 4, name: "Tomato Vegetable", unit: "Per 1 KG (Pcs)", price: "5.00 AED", delivery: false, Icon: TomatoIcon },
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
        <h2 className="text-[15px] font-bold text-ink">Top Fruits 2025</h2>
        <Link href="/produk" className="text-[12px] font-semibold text-primary">
          View all
        </Link>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-3.5">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </motion.div>
  );
}
