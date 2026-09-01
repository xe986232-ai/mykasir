"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeId = "emerald" | "navy" | "charcoal";

export type ThemeOption = {
  id: ThemeId;
  name: string;
  description: string;
  sidebar: string;
  accent: string;
};

// Warna preview di sini cuma dipakai buat swatch di halaman Pengaturan —
// warna asli yang benar-benar dipakai di seluruh app diatur lewat
// [data-theme] di globals.css.
export const THEMES: ThemeOption[] = [
  {
    id: "emerald",
    name: "Emerald + sand",
    description: "Hijau tua elegan dengan aksen amber hangat",
    sidebar: "#0f6e56",
    accent: "#d97706",
  },
  {
    id: "navy",
    name: "Navy + lime",
    description: "Biru gelap modern dengan aksen hijau lime",
    sidebar: "#1e3a5f",
    accent: "#65a30d",
  },
  {
    id: "charcoal",
    name: "Charcoal + terracotta",
    description: "Abu gelap dewasa dengan aksen terracotta hangat",
    sidebar: "#2c2c2a",
    accent: "#c2410c",
  },
];

const STORAGE_KEY = "mykasir-theme";
const DEFAULT_THEME: ThemeId = "emerald";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  // Sinkronkan sama tema yang udah dipilih sebelumnya (localStorage) begitu
  // komponen mount di client. Inline script di layout.tsx yang nge-set
  // atribut ke <html> lebih awal biar ga ada flash warna default.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (stored && THEMES.some((t) => t.id === stored)) {
      setThemeState(stored);
    }
  }, []);

  const setTheme = (next: ThemeId) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
