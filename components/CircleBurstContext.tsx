"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type CircleBurstContextValue = {
  /** Berubah tiap kali burst() dipanggil — dipakai sebagai `key` biar animasi CSS-nya restart dari awal. */
  burstSignal: number;
  /** Panggil ini dari mana aja (misal tombol "+" di ProductCard) buat memicu animasi lingkaran. */
  burst: () => void;
};

const CircleBurstContext = createContext<CircleBurstContextValue | null>(null);

export function CircleBurstProvider({ children }: { children: ReactNode }) {
  const [burstSignal, setBurstSignal] = useState(0);
  const counter = useRef(0);

  const burst = useCallback(() => {
    counter.current += 1;
    setBurstSignal(counter.current);
  }, []);

  return (
    <CircleBurstContext.Provider value={{ burstSignal, burst }}>
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
