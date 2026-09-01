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
 * yang nangkring di pinggir lingkaran. Radius-nya SENGAJA dibikin konstan buat
 * semua item — biar titik tengah tiap logo bener-bener jatuh di satu lingkaran
 * yang sama (lengkungannya presisi, gak nekuk/bengkok), cuma sudutnya aja yang
 * digeser tiap index biar nyebar ngikutin pinggiran lingkaran gede. index 0 =
 * produk paling baru diklik, ditaruh paling deket sudut & paling gede.
 */
const BURST_RADIUS = 224; // jarak konstan tiap logo dari titik sudut lingkaran
const BURST_ANGLE_START = 12; // derajat, 0° = lurus ke kiri
const BURST_ANGLE_STEP = 13.6; // jarak sudut antar logo, biar nyebar rata sampai ~80°

export function getBurstItemLayout(index: number) {
  const angleDeg = BURST_ANGLE_START + index * BURST_ANGLE_STEP;
  const size = 58 - index * 4;

  const rad = (angleDeg * Math.PI) / 180;
  const right = BURST_RADIUS * Math.cos(rad) - size / 2;
  const bottom = BURST_RADIUS * Math.sin(rad) - size / 2;

  return { right, bottom, size };
}
