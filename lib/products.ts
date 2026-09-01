import {
  FruitsIcon,
  VegetableIcon,
  DrinksIcon,
} from "@/components/icons/Categories";
import {
  PapayaIcon,
  StrawberryIcon,
  CarrotIcon,
  TomatoIcon,
  PomegranateIcon,
  OnionIcon,
  RaspberryIcon,
  BroccoliIcon,
} from "@/components/icons/Produce";
import {
  WaterBottleIcon,
  JuiceIcon,
  IcedTeaIcon,
} from "@/components/icons/Drinks";

export type CategoryId =
  | "kunci-mas"
  | "mie-instan"
  | "fruits"
  | "vegetable"
  | "drinks";

export type Category =
  | {
      id: CategoryId;
      label: string;
      type: "image";
      image: string;
    }
  | {
      id: CategoryId;
      label: string;
      type: "icon";
      bg: string;
      Icon: () => React.ReactElement;
    };

export const categories: Category[] = [
  { id: "kunci-mas", label: "Kunci Mas", type: "image", image: "/categories/kunci-mas.webp" },
  { id: "mie-instan", label: "Mi Instan", type: "image", image: "/categories/mie-instan.webp" },
  { id: "fruits", label: "Fruits", type: "icon", bg: "#2FB350", Icon: FruitsIcon },
  { id: "vegetable", label: "Vegetable", type: "icon", bg: "#EF9526", Icon: VegetableIcon },
  { id: "drinks", label: "Drinks", type: "icon", bg: "#8B5CF6", Icon: DrinksIcon },
];

export type Product = {
  id: number;
  name: string;
  unit: string;
  price: string;
  delivery?: boolean;
  category: CategoryId;
  Icon?: () => React.ReactElement;
  image?: string;
};

export const products: Product[] = [
  // Fruits
  { id: 1, name: "Papaya Fruit", unit: "Per 1 KG (Pcs)", price: "Rp 15.000", delivery: true, category: "fruits", Icon: PapayaIcon },
  { id: 2, name: "Strawberry Fruit", unit: "Per 500 GM", price: "Rp 25.000", delivery: true, category: "fruits", Icon: StrawberryIcon },
  { id: 3, name: "Pomegranate Fruit", unit: "Per 1 KG (Pcs)", price: "Rp 35.000", category: "fruits", Icon: PomegranateIcon },
  { id: 4, name: "Raspberries Fruit", unit: "Per 500 GM", price: "Rp 45.000", category: "fruits", Icon: RaspberryIcon },

  // Vegetable
  { id: 5, name: "Carrot Vegetable", unit: "Per 1 KG (Pcs)", price: "Rp 8.000", category: "vegetable", Icon: CarrotIcon },
  { id: 6, name: "Tomato Vegetable", unit: "Per 1 KG (Pcs)", price: "Rp 10.000", category: "vegetable", Icon: TomatoIcon },
  { id: 7, name: "Onion Vegetable", unit: "Per 1 KG (Pcs)", price: "Rp 12.000", category: "vegetable", Icon: OnionIcon },
  { id: 8, name: "Broccoli Vegetable", unit: "Per 1 KG (Pcs)", price: "Rp 9.000", category: "vegetable", Icon: BroccoliIcon },

  // Drinks
  { id: 9, name: "Mineral Water", unit: "Per 600 ML", price: "Rp 4.000", delivery: true, category: "drinks", Icon: WaterBottleIcon },
  { id: 10, name: "Orange Juice", unit: "Per 1 L", price: "Rp 15.000", category: "drinks", Icon: JuiceIcon },
  { id: 11, name: "Iced Tea", unit: "Per 500 ML", price: "Rp 6.000", category: "drinks", Icon: IcedTeaIcon },

  // Kunci Mas
  { id: 12, name: "Kunci Mas Cooking Oil", unit: "Per 1 L", price: "Rp 32.000", category: "kunci-mas", image: "/categories/kunci-mas.webp" },
  { id: 13, name: "Kunci Mas Soy Sauce", unit: "Per 620 ML", price: "Rp 18.000", category: "kunci-mas", image: "/categories/kunci-mas.webp" },
  { id: 14, name: "Kunci Mas Sweet Soy Sauce", unit: "Per 620 ML", price: "Rp 19.000", delivery: true, category: "kunci-mas", image: "/categories/kunci-mas.webp" },

  // Mi Instan
  { id: 15, name: "Indomie Goreng", unit: "Per Pcs (85 GM)", price: "Rp 3.500", category: "mie-instan", image: "/categories/mie-instan.webp" },
  { id: 16, name: "Mie Sedaap Soto", unit: "Per Pcs (76 GM)", price: "Rp 3.000", category: "mie-instan", image: "/categories/mie-instan.webp" },
  { id: 17, name: "Indomie Rendang", unit: "Per Pcs (85 GM)", price: "Rp 3.500", delivery: true, category: "mie-instan", image: "/categories/mie-instan.webp" },
];

export function getCategoryById(id: CategoryId | string | null | undefined) {
  return categories.find((c) => c.id === id);
}

export function getProductsByCategory(id: CategoryId) {
  return products.filter((p) => p.category === id);
}

export function isCategoryId(value: string | undefined | null): value is CategoryId {
  return !!value && categories.some((c) => c.id === value);
}

/**
 * Produk di sini disimpan harganya sebagai string tampilan format Rupiah
 * (misal "Rp 15.000", titik sebagai pemisah ribuan). Buat kasir kita butuh
 * angka mentahnya biar bisa dijumlahin — fungsi ini mecah string itu jadi
 * { value, currency }. Kalau formatnya ga kebaca, fallback ke 0 biar ga
 * bikin krash pas hitung total.
 */
export function parsePrice(price: string): { value: number; currency: string } {
  const match = price.match(/^Rp\s*([\d.,]+)/);
  if (!match) return { value: 0, currency: "Rp" };

  // Titik dipakai sebagai pemisah ribuan (bukan desimal) di format Rupiah.
  const value = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  return { value: Number.isFinite(value) ? value : 0, currency: "Rp" };
}

/** Format angka jadi string Rupiah, misal 15000 -> "Rp 15.000". */
export function formatRupiah(value: number): string {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}
