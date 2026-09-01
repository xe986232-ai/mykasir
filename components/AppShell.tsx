"use client";

import type { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_GAP } from "./Sidebar";
import { CartProvider, useCart } from "./CartContext";
import CartBottomBar from "./CartBottomBar";
import CartSheet from "./CartSheet";
import StartSellingBadge from "./StartSellingBadge";

// Logic ini persis kayak di kode HTML: pas hamburger di-klik, "main-content"
// (kartu halaman) di-geser ke kanan sejauh sidebar-width + gap buat
// nampilin sidebar di belakangnya, sudutnya jadi rounded + dikasih shadow.
// Dipakai transisi CSS murni (bukan Framer Motion) biar ringan — sama
// seperti pendekatan di kode HTML aslinya, cuma pakai `transform` (GPU)
// buat geser, jadi ga bikin device lag pas buka/tutup.
//
// PENTING: elemen apa pun yang punya `transform` (walau translate3d(0,0,0))
// bikin containing block baru buat descendant `position: fixed` di
// dalamnya — jadi "fixed" itu keanggep "absolute" relatif ke div ini, ikut
// kegeser pas discroll. Makanya CartBottomBar & CartSheet SENGAJA dirender
// di luar div ini (langsung di <Frame>), biar posisi fixed-nya ngunci ke
// viewport beneran, bukan ke frame yang ke-transform.
function Frame({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar();
  const { isSheetOpen, closeSheet } = useCart();
  const shiftX = SIDEBAR_WIDTH + SIDEBAR_GAP;

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#EFF1F0]">
      <Sidebar />

      <div
        onClick={close}
        style={{ left: SIDEBAR_WIDTH }}
        className={`absolute inset-y-0 right-0 z-20 bg-gradient-to-b from-primary to-primary-dark transition-opacity duration-200 ease-out ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        style={{
          transform: isOpen
            ? `translate3d(${shiftX}px,0,0)`
            : "translate3d(0,0,0)",
        }}
        className={`absolute left-0 right-0 z-30 flex flex-col overflow-y-auto bg-[#EFF1F0] will-change-transform transition-[transform,top,bottom,border-radius,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen
            ? "top-3 bottom-3 rounded-3xl shadow-[-18px_0px_36px_rgba(0,0,0,0.20)]"
            : "top-0 bottom-0 rounded-none shadow-none"
        }`}
      >
        {children}
      </div>

      {/* Di luar div ber-transform di atas → position:fixed di sini beneran
          ngunci ke viewport, ga ikut kegeser scroll apa pun. */}
      <StartSellingBadge />
      <CartBottomBar />
      <CartSheet open={isSheetOpen} onClose={closeSheet} />
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <CartProvider>
        <Frame>{children}</Frame>
      </CartProvider>
    </SidebarProvider>
  );
}
