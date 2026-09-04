"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Package, ListChecks, Tag, FileText, Settings } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import DashboardIcon from "./icons/DashboardIcon";

// Sama seperti --sidebar-w & gap di kode HTML aslinya, cuma diskalakan
// biar pas dengan frame kartu mobile (max-w-430) di app ini.
export const SIDEBAR_WIDTH = 232;
export const SIDEBAR_GAP = 14;

// Struktur & isi menu:
// - Section "Menu": Dashboard, Kasir, Daftar Produk (browse/katalog produk,
//   BUKAN halaman kelola — cuma buat liat-liat produk yang tersedia)
// - Section "Master Data": Kelola Produk (add/edit/hapus produk), Kelola
//   Kategori (add/edit/hapus kategori)
// - Section "Laporan": Riwayat Transaksi
// href "#" dipakai untuk menu yang belum punya halaman di app Next.js ini.
const navSections = [
  {
    label: "Menu",
    items: [
      { label: "Dashboard", href: "/", Icon: DashboardIcon },
      { label: "Kasir", href: "/kasir", Icon: ShoppingCart },
      { label: "Daftar Produk", href: "/produk", Icon: Package },
    ],
  },
  {
    label: "Master Data",
    items: [
      { label: "Kelola Produk", href: "/produk/kelola", Icon: ListChecks },
      { label: "Kelola Kategori", href: "/kategori/kelola", Icon: Tag },
    ],
  },
  {
    label: "Laporan",
    items: [{ label: "Riwayat Transaksi", href: "/transaksi", Icon: FileText }],
  },
  {
    label: "Lainnya",
    items: [{ label: "Pengaturan", href: "/pengaturan", Icon: Settings }],
  },
];

export default function Sidebar() {
  const { close } = useSidebar();
  const pathname = usePathname();

  // Kalau beberapa href match (misal "/produk" & "/produk/kelola" pas lagi
  // di "/produk/kelola/tambah"), yang menang cuma href paling spesifik
  // (paling panjang) — biar ga dua menu ke-highlight bareng.
  const allHrefs = navSections.flatMap((s) => s.items.map((i) => i.href)).filter((h) => h !== "#");
  const matchingHrefs = allHrefs.filter(
    (href) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
  );
  const activeHref = matchingHrefs.sort((a, b) => b.length - a.length)[0];

  return (
    <aside
      style={{ width: SIDEBAR_WIDTH }}
      className="absolute inset-y-0 left-0 z-10 flex flex-col overflow-y-auto bg-gradient-to-b from-sidebar to-sidebar-dark"
    >
      <div className="flex items-center justify-center border-b border-white/15 p-4">
        {/* SVG logo Jarwoo yang sama persis dengan yang di SplashScreen,
            di-inline langsung (bukan <img src="...svg">) biar @import font
            Pacifico dari Google Fonts tetap jalan normal. */}
        <svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg" className="h-auto w-32">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
            .sidebar-logo-text {
              font-family: 'Pacifico', cursive;
              font-size: 72px;
              fill: #ffffff;
            }
          `}</style>
          <text
            x="200"
            y="90"
            textAnchor="middle"
            className="sidebar-logo-text"
            transform="rotate(-4 200 90)"
          >
            Jarwoo
          </text>
        </svg>
      </div>

      <nav className="flex-1 py-2">
        {navSections.map((section, sectionIdx) => (
          <div key={section.label}>
            {sectionIdx > 0 && (
              <div className="mx-6 my-3.5 h-px bg-white/20" />
            )}
            <div className="px-5 pb-1.5 pt-3.5 text-[12px] font-medium text-white/65">
              {section.label}
            </div>
            {section.items.map(({ label, href, Icon }) => {
              const isActive = href !== "#" && href === activeHref;
              const content = (
                <>
                  {isActive && (
                    <span className="absolute left-1 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-white" />
                  )}
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={isActive ? "opacity-100" : "opacity-85"}
                  />
                  {label}
                </>
              );
              const className = `relative mx-3 my-1 flex w-[calc(100%-24px)] items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] font-semibold transition-colors ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/85 hover:bg-white/10"
              }`;

              if (href === "#") {
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={close}
                    className={className}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link key={label} href={href} onClick={close} className={className}>
                  {content}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
