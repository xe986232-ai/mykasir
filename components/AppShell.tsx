"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_GAP } from "./Sidebar";

// Logic ini persis kayak di kode HTML: pas hamburger di-klik, "main-content"
// (kartu halaman) di-geser ke kanan sejauh sidebar-width + gap buat
// nampilin sidebar di belakangnya. Sudutnya jadi rounded semua (atas &
// bawah) plus dikasih sedikit ruang/jarak di atas & bawah, sama seperti
// `.main-content.shifted{ top:...; bottom:12px; border-radius:24px }`
// di kode aslinya.
function Frame({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar();
  const shiftX = SIDEBAR_WIDTH + SIDEBAR_GAP;

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-[#EFF1F0]">
      <Sidebar />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            style={{ left: SIDEBAR_WIDTH }}
            className="absolute inset-y-0 right-0 z-20 bg-primary-dark/85"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={
          isOpen
            ? {
                x: shiftX,
                top: 12,
                bottom: 12,
                borderRadius: 24,
                boxShadow: "-18px 0px 36px rgba(0,0,0,0.20)",
              }
            : {
                x: 0,
                top: 0,
                bottom: 0,
                borderRadius: 0,
                boxShadow: "0px 0px 0px rgba(0,0,0,0)",
              }
        }
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="absolute left-0 right-0 z-30 flex flex-col overflow-y-auto bg-[#EFF1F0]"
      >
        {children}
      </motion.div>
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
