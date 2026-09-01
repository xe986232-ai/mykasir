"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Search, Activity, User } from "lucide-react";
import { useSidebar } from "./SidebarContext";

// Sama seperti --sidebar-w & gap di kode HTML aslinya, cuma diskalakan
// biar pas dengan frame kartu mobile (max-w-430) di app ini.
export const SIDEBAR_WIDTH = 232;
export const SIDEBAR_GAP = 14;

const navItems = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Produk", href: "/produk", Icon: Store },
  { label: "Search", href: "/produk", Icon: Search },
  { label: "Activity", href: "#", Icon: Activity },
  { label: "Profile", href: "#", Icon: User },
];

export default function Sidebar() {
  const { close } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      style={{ width: SIDEBAR_WIDTH }}
      className="absolute inset-y-0 left-0 z-10 flex flex-col overflow-y-auto bg-gradient-to-b from-primary to-primary-dark"
    >
      <div className="flex items-center gap-3 border-b border-white/15 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <div>
          <div className="text-[13px] font-bold text-white">FreshCart</div>
          <div className="text-[11px] text-white/65">Grocery App</div>
        </div>
      </div>

      <nav className="flex-1 py-2">
        <div className="px-5 pb-1.5 pt-4 text-[11.5px] font-medium text-white/65">
          Menu
        </div>
        {navItems.map(({ label, href, Icon }) => {
          const isActive = href !== "#" && pathname === href;
          return (
            <Link
              key={label}
              href={href}
              onClick={close}
              className={`relative mx-3 my-1 flex items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] font-semibold transition-colors ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/85 hover:bg-white/10"
              }`}
            >
              {isActive && (
                <span className="absolute left-1 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-white" />
              )}
              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={isActive ? "opacity-100" : "opacity-80"}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
