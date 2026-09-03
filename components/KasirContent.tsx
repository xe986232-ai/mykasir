"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Barcode } from "lucide-react";
import Header from "./Header";
import Categories from "./Categories";
import KasirProductSection from "./KasirProductSection";
import BarcodeScannerModal from "./BarcodeScannerModal";
import { useProductsData } from "./ProductsDataContext";
import { useCart } from "./CartContext";
import type { CategoryId } from "@/lib/products";

export default function KasirContent() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const { getProductByBarcode } = useProductsData();
  const { addItem } = useCart();

  const handleDetected = useCallback(
    (code: string) => {
      setScannerOpen(false);
      const product = getProductByBarcode(code);
      if (!product) {
        setScanFeedback({
          type: "error",
          message: `Barcode "${code}" ga cocok sama produk manapun.`,
        });
        return;
      }
      addItem(product);
      setScanFeedback({ type: "success", message: `${product.name} masuk keranjang.` });
    },
    [getProductByBarcode, addItem]
  );

  // Feedback scan otomatis ilang setelah beberapa detik biar ga numpuk di layar.
  useEffect(() => {
    if (!scanFeedback) return;
    const timer = setTimeout(() => setScanFeedback(null), 2500);
    return () => clearTimeout(timer);
  }, [scanFeedback]);

  const dismissFeedback = useCallback(() => setScanFeedback(null), []);

  return (
    <>
      <Header />

      {/* Sama posisi & gaya kayak SearchBar di halaman utama, cuma di sini
          input-nya aktif buat nyaring produk kasir. */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
        className="mt-4 flex items-center gap-2.5 px-5"
      >
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <Search size={18} className="text-gray" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-gray outline-none"
          />
        </div>
        <button
          onClick={() => setScannerOpen(true)}
          aria-label="Scan barcode"
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <Barcode size={17} className="text-ink" />
        </button>
        <button
          aria-label="Filters"
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <SlidersHorizontal size={17} className="text-ink" />
        </button>
      </motion.div>

      {/* Banner promo sengaja ga ditaruh di sini — kasir cuma butuh langsung
          ke produk, ga perlu promo carousel kayak di halaman utama. */}

      <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
      <KasirProductSection
        selectedCategory={selectedCategory}
        query={query}
        onSelectCategory={setSelectedCategory}
      />

      <BarcodeScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={handleDetected}
        helperText="Arahkan kamera ke barcode produk buat masuk keranjang"
      />

      <AnimatePresence>
        {scanFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={dismissFeedback}
            className={`fixed inset-x-5 bottom-[calc(env(safe-area-inset-bottom)+96px)] z-[90] rounded-2xl px-4 py-3.5 text-center text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(20,24,20,0.18)] ${
              scanFeedback.type === "success" ? "bg-primary" : "bg-badge"
            }`}
          >
            {scanFeedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
