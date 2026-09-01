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
  { id: "kunci-mas", label: "Kunci Mas", type: "image", image: "/categories/kunci-mas.png" },
  { id: "mie-instan", label: "Mi Instan", type: "image", image: "/categories/mie-instan.png" },
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
  { id: 1, name: "Papaya Fruit", unit: "Per 1 KG (Pcs)", price: "6.50 AED", delivery: true, category: "fruits", Icon: PapayaIcon },
  { id: 2, name: "Strawberry Fruit", unit: "Per 500 GM", price: "9.00 AED", delivery: true, category: "fruits", Icon: StrawberryIcon },
  { id: 3, name: "Pomegranate Fruit", unit: "Per 1 KG (Pcs)", price: "9.00 AED", category: "fruits", Icon: PomegranateIcon },
  { id: 4, name: "Raspberries Fruit", unit: "Per 500 GM", price: "12.00 AED", category: "fruits", Icon: RaspberryIcon },

  // Vegetable
  { id: 5, name: "Carrot Vegetable", unit: "Per 1 KG (Pcs)", price: "2.25 AED", category: "vegetable", Icon: CarrotIcon },
  { id: 6, name: "Tomato Vegetable", unit: "Per 1 KG (Pcs)", price: "5.00 AED", category: "vegetable", Icon: TomatoIcon },
  { id: 7, name: "Onion Vegetable", unit: "Per 1 KG (Pcs)", price: "3.50 AED", category: "vegetable", Icon: OnionIcon },
  { id: 8, name: "Broccoli Vegetable", unit: "Per 1 KG (Pcs)", price: "2.00 AED", category: "vegetable", Icon: BroccoliIcon },

  // Drinks
  { id: 9, name: "Mineral Water", unit: "Per 600 ML", price: "1.50 AED", delivery: true, category: "drinks", Icon: WaterBottleIcon },
  { id: 10, name: "Orange Juice", unit: "Per 1 L", price: "4.00 AED", category: "drinks", Icon: JuiceIcon },
  { id: 11, name: "Iced Tea", unit: "Per 500 ML", price: "2.50 AED", category: "drinks", Icon: IcedTeaIcon },

  // Kunci Mas
  { id: 12, name: "Kunci Mas Cooking Oil", unit: "Per 1 L", price: "9.00 AED", category: "kunci-mas", image: "/categories/kunci-mas.png" },
  { id: 13, name: "Kunci Mas Soy Sauce", unit: "Per 620 ML", price: "4.50 AED", category: "kunci-mas", image: "/categories/kunci-mas.png" },
  { id: 14, name: "Kunci Mas Sweet Soy Sauce", unit: "Per 620 ML", price: "4.75 AED", delivery: true, category: "kunci-mas", image: "/categories/kunci-mas.png" },

  // Mi Instan
  { id: 15, name: "Indomie Goreng", unit: "Per Pcs (85 GM)", price: "1.20 AED", category: "mie-instan", image: "/categories/mie-instan.png" },
  { id: 16, name: "Mie Sedaap Soto", unit: "Per Pcs (76 GM)", price: "1.10 AED", category: "mie-instan", image: "/categories/mie-instan.png" },
  { id: 17, name: "Indomie Rendang", unit: "Per Pcs (85 GM)", price: "1.30 AED", delivery: true, category: "mie-instan", image: "/categories/mie-instan.png" },
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
