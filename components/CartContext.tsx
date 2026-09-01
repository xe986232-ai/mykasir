"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { parsePrice } from "@/lib/products";

/** Data produk minimal yang dibutuhkan buat masuk ke keranjang. */
export type CartableProduct = {
  id: number;
  name: string;
  unit: string;
  price: string; // string tampilan asli, misal "Rp 15.000"
  image?: string;
  Icon?: () => React.ReactElement;
};

export type CartItem = CartableProduct & {
  qty: number;
  priceValue: number;
  currency: string;
};

type CartContextValue = {
  items: CartItem[];
  /** Total qty semua item (buat badge di icon keranjang). */
  itemCount: number;
  /** Total harga (belum termasuk pajak/diskon). */
  subtotal: number;
  /** Simbol/kode mata uang, diambil dari produk pertama yang masuk keranjang. */
  currency: string;
  addItem: (product: CartableProduct) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: CartableProduct) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, qty: it.qty + 1 } : it
        );
      }
      const { value, currency } = parsePrice(product.price);
      return [...prev, { ...product, qty: 1, priceValue: value, currency }];
    });
  }, []);

  const increment = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    );
  }, []);

  const decrement = useCallback((id: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: it.qty - 1 } : it))
        .filter((it) => it.qty > 0)
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.priceValue * it.qty, 0),
    [items]
  );
  const currency = items[0]?.currency ?? "Rp";

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        currency,
        addItem,
        increment,
        decrement,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must dipakai di dalam <CartProvider>");
  }
  return ctx;
}
