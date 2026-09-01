"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatRupiah, type Category, type CategoryId, type Product } from "@/lib/products";
import { FruitsIcon, VegetableIcon, DrinksIcon } from "./icons/Categories";
import {
  PapayaIcon,
  StrawberryIcon,
  CarrotIcon,
  TomatoIcon,
  PomegranateIcon,
  OnionIcon,
  RaspberryIcon,
  BroccoliIcon,
} from "./icons/Produce";
import { WaterBottleIcon, JuiceIcon, IcedTeaIcon } from "./icons/Drinks";

// Pemetaan `icon_key` (disimpan di tabel Supabase) ke komponen icon React
// yang sudah ada di project. Kalau nanti nambah kategori/produk baru lewat
// Supabase, tinggal tambahin key di sini + gambar/icon-nya.
export const categoryIconMap: Record<string, () => React.ReactElement> = {
  fruits: FruitsIcon,
  vegetable: VegetableIcon,
  drinks: DrinksIcon,
};

export const productIconMap: Record<string, () => React.ReactElement> = {
  papaya: PapayaIcon,
  strawberry: StrawberryIcon,
  carrot: CarrotIcon,
  tomato: TomatoIcon,
  pomegranate: PomegranateIcon,
  onion: OnionIcon,
  raspberry: RaspberryIcon,
  broccoli: BroccoliIcon,
  water: WaterBottleIcon,
  juice: JuiceIcon,
  icedtea: IcedTeaIcon,
};

type CategoryRow = {
  id: string;
  label: string;
  type: "image" | "icon";
  image: string | null;
  bg_color: string | null;
  icon_key: string | null;
  sort_order: number;
};

type ProductRow = {
  id: number;
  name: string;
  unit: string;
  price: number | string;
  currency: string;
  delivery: boolean | null;
  category_id: string;
  icon_key: string | null;
  image: string | null;
  is_active: boolean | null;
  brand: string | null;
};

type ProductsDataValue = {
  categories: Category[];
  products: Product[];
  loading: boolean;
  error: string | null;
  getCategoryById: (id: CategoryId | string | null | undefined) => Category | undefined;
  isCategoryId: (value: string | undefined | null) => value is CategoryId;
  getProductsByCategory: (id: CategoryId) => Product[];
  refetch: () => void;
};

const ProductsDataContext = createContext<ProductsDataValue | null>(null);

export function ProductsDataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured) {
        setError(
          "Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables."
        );
        setLoading(false);
        return;
      }

      const [catRes, prodRes] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("id"),
      ]);

      if (cancelled) return;

      if (catRes.error || prodRes.error) {
        setError(
          catRes.error?.message ?? prodRes.error?.message ?? "Gagal memuat data dari Supabase"
        );
        setLoading(false);
        return;
      }

      const mappedCategories: Category[] = (catRes.data as CategoryRow[]).map((c) => {
        if (c.type === "image") {
          return { id: c.id, label: c.label, type: "image", image: c.image ?? "" };
        }
        return {
          id: c.id,
          label: c.label,
          type: "icon",
          bg: c.bg_color ?? "#94A3B8",
          Icon: categoryIconMap[c.icon_key ?? ""] ?? FruitsIcon,
        };
      });

      const mappedProducts: Product[] = (prodRes.data as ProductRow[]).map((p) => ({
        id: p.id,
        name: p.name,
        unit: p.unit,
        price: formatRupiah(Number(p.price)),
        delivery: p.delivery ?? false,
        category: p.category_id,
        brand: p.brand,
        Icon: p.icon_key ? productIconMap[p.icon_key] : undefined,
        image: p.image ?? undefined,
      }));

      setCategories(mappedCategories);
      setProducts(mappedProducts);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [version]);

  const getCategoryById = useCallback(
    (id: CategoryId | string | null | undefined) => categories.find((c) => c.id === id),
    [categories]
  );

  const isCategoryId = useCallback(
    (value: string | undefined | null): value is CategoryId =>
      !!value && categories.some((c) => c.id === value),
    [categories]
  );

  const getProductsByCategory = useCallback(
    (id: CategoryId) => products.filter((p) => p.category === id),
    [products]
  );

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const value = useMemo(
    () => ({
      categories,
      products,
      loading,
      error,
      getCategoryById,
      isCategoryId,
      getProductsByCategory,
      refetch,
    }),
    [categories, products, loading, error, getCategoryById, isCategoryId, getProductsByCategory, refetch]
  );

  return <ProductsDataContext.Provider value={value}>{children}</ProductsDataContext.Provider>;
}

export function useProductsData() {
  const ctx = useContext(ProductsDataContext);
  if (!ctx) {
    throw new Error("useProductsData must dipakai di dalam <ProductsDataProvider>");
  }
  return ctx;
}
