"use client";

import type { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_GAP } from "./Sidebar";
import { CartProvider, useCart } from "./CartContext";
import { ProductsDataProvider } from "./ProductsDataContext";
import { BulkActionsProvider } from "./BulkActionsContext";
import { ThemeProvider } from "./ThemeContext";
import { AlertProvider } from "./AlertContext";
import AlertOverlay from "./AlertOverlay";
import CartBottomBar from "./CartBottomBar";
import CartSheet from "./CartSheet";
import BulkActionsBar from "./BulkActionsBar";
import SplashScreen from "./SplashScreen";

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
// di luar div ini (langsung di <Frame>, yang "relative" & h-dvh), pakai
// `position: absolute` (BUKAN fixed) biar nempel ke bottom Frame yang
// tingginya udah pas — ga kepotong sama address bar/gesture-nav browser
// kayak yang kejadian kalau pakai `fixed`.
function Frame({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar();
  const { isSheetOpen, closeSheet } = useCart();
  const shiftX = SIDEBAR_WIDTH + SIDEBAR_GAP;

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-page">
      <Sidebar />

      <div
        onClick={close}
        style={{ left: SIDEBAR_WIDTH }}
        className={`absolute inset-y-0 right-0 z-20 bg-gradient-to-b from-sidebar to-sidebar-dark transition-opacity duration-200 ease-out ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        style={{
          transform: isOpen
            ? `translate3d(${shiftX}px,0,0)`
            : "translate3d(0,0,0)",
        }}
        className={`absolute left-0 right-0 z-30 flex flex-col overflow-y-auto bg-page will-change-transform transition-[transform,top,bottom,border-radius,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen
            ? "top-3 bottom-3 rounded-3xl shadow-[-18px_0px_36px_rgba(0,0,0,0.20)]"
            : "top-0 bottom-0 rounded-none shadow-none"
        }`}
      >
        {children}
      </div>

      {/* Di luar div ber-transform di atas → position:absolute di sini
          nempel bener ke bottom Frame, ga ikut kegeser scroll apa pun. */}
      <CartBottomBar />
      <CartSheet open={isSheetOpen} onClose={closeSheet} />
      <BulkActionsBar />

      {/* Nutup seluruh Frame pas app pertama kali mount, ilang sendiri
          abis sekejap. z-[60] biar di atas modal cart/bulk actions (z-50). */}
      <SplashScreen />

      {/* Toast alert kustom (pengganti window.alert bawaan browser) —
          z-[70] biar selalu di paling atas, di atas splash screen sekalipun. */}
      <AlertOverlay />
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ProductsDataProvider>
        <SidebarProvider>
          <CartProvider>
            <BulkActionsProvider>
              <AlertProvider>
                <Frame>{children}</Frame>
              </AlertProvider>
            </BulkActionsProvider>
          </CartProvider>
        </SidebarProvider>
      </ProductsDataProvider>
    </ThemeProvider>
  );
}
