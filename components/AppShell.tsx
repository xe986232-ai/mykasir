"use client";

import type { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_GAP } from "./Sidebar";
import { CircleBurstProvider, useCircleBurst } from "./CircleBurstContext";

// Logic ini persis kayak di kode HTML: pas hamburger di-klik, "main-content"
// (kartu halaman) di-geser ke kanan sejauh sidebar-width + gap buat
// nampilin sidebar di belakangnya, sudutnya jadi rounded + dikasih shadow.
// Dipakai transisi CSS murni (bukan Framer Motion) biar ringan — sama
// seperti pendekatan di kode HTML aslinya, cuma pakai `transform` (GPU)
// buat geser, jadi ga bikin device lag pas buka/tutup.
function Frame({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar();
  const { burstSignal } = useCircleBurst();
  const shiftX = SIDEBAR_WIDTH + SIDEBAR_GAP;

  // burstSignal 0 = belum pernah diklik sama sekali -> jangan animasi pas
  // pertama kali render, biar ga muncul "pop" pas halaman baru dibuka.
  const hasBurst = burstSignal > 0;

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#EFF1F0]">
      {/* Lingkaran dekoratif: cuma kepotong di sisi BAWAH (jadi bentuknya
          separo lingkaran yang mulus), lalu digeser ke kanan lewat `right`
          positif (bukan negatif) supaya sisi kanannya gak ikut kepotong. */}
      <div
        key={burstSignal}
        style={
          hasBurst
            ? {
                animation:
                  "circle-burst 0.6s cubic-bezier(0.34,1.56,0.64,1) 1",
              }
            : undefined
        }
        className="pointer-events-none absolute -bottom-[160px] right-5 z-40 h-[320px] w-[320px] rounded-full bg-gradient-to-br from-primary to-primary-dark opacity-90"
      />

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
      <CircleBurstProvider>
        <Frame>{children}</Frame>
      </CircleBurstProvider>
    </SidebarProvider>
  );
}
