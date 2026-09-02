"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const SPLASH_DURATION_MS = 1700;

// Splash screen simple: cuma nongol pas halaman UTAMA ("/") pertama kali
// dibuka, logo Jarwoo "nyapu" muncul dari kiri ke kanan, terus abis
// SPLASH_DURATION_MS fade-out ilang sendiri, nampilin isi app di baliknya.
// Dirender sebagai "absolute inset-0" (bukan fixed) karena ditaro di dalam
// Frame yang udah "relative" — jadi nutupin persis area app frame-nya aja
// (h-dvh, max-w-430), sama kayak trik yang dipake CartBottomBar/CartSheet.
//
// Sengaja dicek `pathname === "/"` biar splash CUMA muncul di halaman utama
// (bukan tiap kali pindah/refresh halaman lain kayak /kasir, /transaksi,
// dll) — komponen ini dirender sekali di AppShell yang membungkus semua
// route, jadi filternya harus di sini.
//
// PENTING: ini SVG ASLI dari file public/jarwoo-logo.svg, di-inline
// langsung sebagai JSX (bukan <img src="...svg">). Kalau dipanggil lewat
// <img>, browser ngeblok external resource (di sini: @import font Pacifico
// dari Google Fonts) demi keamanan — makanya kemarin bentuknya beda/font-nya
// ga sesuai aslinya. Di-inline gini, @import-nya jalan normal kayak CSS
// biasa di halaman.
export default function SplashScreen() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [visible, setVisible] = useState(isHomePage);

  useEffect(() => {
    if (!isHomePage) return;
    const timer = setTimeout(() => setVisible(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isHomePage]);

  if (!isHomePage) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-[#2563eb]"
        >
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            className="w-72"
          >
            <svg
              viewBox="0 0 400 150"
              xmlns="http://www.w3.org/2000/svg"
              className="h-auto w-full"
            >
              <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
                .logo-text {
                  font-family: 'Pacifico', cursive;
                  font-size: 72px;
                  fill: #ffffff;
                }
              `}</style>
              <text
                x="200"
                y="90"
                textAnchor="middle"
                className="logo-text"
                transform="rotate(-4 200 90)"
              >
                Jarwoo
              </text>
            </svg>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            className="text-[13px] font-medium text-white"
          >
            Sistem Kasir
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
