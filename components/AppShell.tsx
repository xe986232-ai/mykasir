"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_GAP } from "./Sidebar";
import {
  CircleBurstProvider,
  useCircleBurst,
  getBurstItemLayout,
} from "./CircleBurstContext";

// Logic ini persis kayak di kode HTML: pas hamburger di-klik, "main-content"
// (kartu halaman) di-geser ke kanan sejauh sidebar-width + gap buat
// nampilin sidebar di belakangnya, sudutnya jadi rounded + dikasih shadow.
// Dipakai transisi CSS murni (bukan Framer Motion) biar ringan — sama
// seperti pendekatan di kode HTML aslinya, cuma pakai `transform` (GPU)
// buat geser, jadi ga bikin device lag pas buka/tutup.
function Frame({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar();
  const { burstSignal, burstItems } = useCircleBurst();
  const shiftX = SIDEBAR_WIDTH + SIDEBAR_GAP;

  // burstSignal 0 = belum pernah diklik sama sekali -> jangan animasi pas
  // pertama kali render, biar ga muncul "pop" pas halaman baru dibuka.
  const hasBurst = burstSignal > 0;

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#EFF1F0]">
      {/* Lingkaran dekoratif: HILANG total di awal (belum pernah ada yang
          klik "+"), baru muncul dengan animasi begitu burst() dipanggil.
          Dikunci pas di POJOK kanan-bawah — kepotong di 2 sisi sekaligus
          (kanan & bawah) pakai offset -radius, jadi yang nongol cuma
          seperempat lingkarannya di sudut, gak melebar ke tengah layar. */}
      <div
        key={burstSignal}
        style={
          hasBurst
            ? {
                animation:
                  "circle-burst 0.6s cubic-bezier(0.34,1.56,0.64,1) 1",
              }
            : { opacity: 0, transform: "scale(0)" }
        }
        className="pointer-events-none absolute -bottom-[280px] -right-[280px] z-40 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-primary to-primary-dark opacity-90"
      />

      {/* Logo produk yang barusan di-"+" nempel di pinggir lingkaran dekoratif
          di atas, tiap logo dikasih card lingkaran putih tipis di belakangnya
          biar kebaca meski nempel di atas background hijau. Posisinya dihitung
          dari sudut kanan-bawah yang sama persis dengan lingkaran gede,
          mengikuti lengkungan pinggirnya (paling baru = paling deket sudut). */}
      <AnimatePresence initial={false}>
        {burstItems.map((item, index) => {
          const { right, bottom, size } = getBurstItemLayout(index);
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{
                right,
                bottom,
                width: size,
                height: size,
              }}
              className="pointer-events-none absolute z-40"
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white/40 p-[2px] shadow-[0_3px_8px_rgba(20,24,20,0.15)] backdrop-blur-[1px]">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white/70">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={size}
                      height={size}
                      className="h-full w-full scale-110 object-contain"
                    />
                  ) : item.Icon ? (
                    <div className="h-[88%] w-[88%]">
                      <item.Icon />
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

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
