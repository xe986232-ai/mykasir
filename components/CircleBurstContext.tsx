"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Data produk minimal yang dibutuhkan buat nampilin logo/gambarnya di dalam lingkaran. */
export type BurstProduct = {
  id: number;
  name: string;
  image?: string;
  Icon?: () => React.ReactElement;
};

/** Maksimal berapa logo produk yang nangkring bareng di pinggir lingkaran sekaligus. */
export const MAX_BURST_ITEMS = 6;

type CircleBurstContextValue = {
  /** Berubah tiap kali burst() dipanggil — dipakai sebagai `key` biar animasi CSS-nya restart dari awal. */
  burstSignal: number;
  /** Produk-produk yang lagi "nempel" di pinggir lingkaran, terbaru di index 0. */
  burstItems: BurstProduct[];
  /** Panggil ini dari mana aja (misal tombol "+" di ProductCard) buat memicu animasi lingkaran + nempelin logo produknya. */
  burst: (product?: BurstProduct) => void;
};

const CircleBurstContext = createContext<CircleBurstContextValue | null>(null);

export function CircleBurstProvider({ children }: { children: ReactNode }) {
  const [burstSignal, setBurstSignal] = useState(0);
  const [burstItems, setBurstItems] = useState<BurstProduct[]>([]);
  const counter = useRef(0);

  const burst = useCallback((product?: BurstProduct) => {
    counter.current += 1;
    setBurstSignal(counter.current);

    if (!product) return;

    setBurstItems((prev) => {
      // produk yang sama diklik lagi -> pindahin ke depan (paling deket sudut),
      // bukan digandain jadi dua logo yang sama.
      const withoutDuplicate = prev.filter((p) => p.id !== product.id);
      return [product, ...withoutDuplicate].slice(0, MAX_BURST_ITEMS);
    });
  }, []);

  return (
    <CircleBurstContext.Provider
      value={{ burstSignal, burstItems, burst }}
    >
      {children}
    </CircleBurstContext.Provider>
  );
}

export function useCircleBurst() {
  const ctx = useContext(CircleBurstContext);
  if (!ctx) {
    throw new Error("useCircleBurst must dipakai di dalam <CircleBurstProvider>");
  }
  return ctx;
}

/**
 * Hitung posisi (dari sudut kanan-bawah container) + ukuran tiap logo produk
 * yang nangkring di pinggir lingkaran. index 0 = produk paling baru diklik,
 * ditaruh paling deket sudut & paling gede; makin besar index makin menyebar
 * ke atas mengikuti lengkungan lingkaran & makin mengecil.
 */
export function getBurstItemLayout(index: number) {
  const angleDeg = 22 + index * 11; // 0° = ke kiri, 90° = ke atas
  const radius = 145 + index * 32;
  const size = 60 - index * 5;

  const rad = (angleDeg * Math.PI) / 180;
  const right = radius * Math.cos(rad) - size / 2;
  const bottom = radius * Math.sin(rad) - size / 2;

  return { right, bottom, size };
}
