import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toko — Sistem Kasir",
  description: "Aplikasi kasir sederhana untuk kelola produk, kategori, dan transaksi",
};

// Dijalanin sebelum React hydrate biar palet warna yang udah dipilih user
// (disimpan di localStorage) langsung ke-apply ke <html>, ga ada "kedip"
// balik ke palet default pas reload halaman.
const themeInitScript = `
  try {
    var t = window.localStorage.getItem("mykasir-theme");
    if (t === "navy" || t === "charcoal" || t === "emerald") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-page font-sans">
        {children}
      </body>
    </html>
  );
}
