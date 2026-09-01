"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_GAP } from "./Sidebar";

// Logic ini persis kayak di kode HTML: pas hamburger di-klik, "main-content"
// (kartu halaman) di-geser ke kanan sejauh sidebar-width + gap buat
// nampilin sidebar di belakangnya, sudutnya jadi rounded + dikasih shadow.
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
            ? { x: shiftX, borderRadius: 24 }
            : { x: 0, borderRadius: 0 }
        }
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className={`relative z-30 flex min-h-screen w-full flex-col bg-[#EFF1F0] ${
          isOpen ? "shadow-[-18px_0_36px_rgba(0,0,0,0.20)]" : ""
        }`}
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
