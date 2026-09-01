"use client";

import type { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_GAP } from "./Sidebar";

// Logic ini persis kayak di kode HTML: pas hamburger di-klik, "main-content"
// (kartu halaman) di-geser ke kanan sejauh sidebar-width + gap buat
// nampilin sidebar di belakangnya, sudutnya jadi rounded + dikasih shadow.
// Dipakai transisi CSS murni (bukan Framer Motion) biar ringan — sama
// seperti pendekatan di kode HTML aslinya, cuma pakai `transform` (GPU)
// buat geser, jadi ga bikin device lag pas buka/tutup.
function Frame({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar();
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
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Frame>{children}</Frame>
    </SidebarProvider>
  );
}
