"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const SPLASH_DURATION_MS = 1900;
const LOGO_TEXT = "Jarwoo";

// Container ngatur jeda antar huruf (staggerChildren), tiap huruf sendiri
// yang punya animasi masuk-nya (letterVariants). Dipisah gini biar bisa
// nge-orchestrate urutan tanpa nyentuh transform si container.
const letterContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, x: -6, y: 14 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

// Splash screen simple: cuma nongol pas app pertama kali dibuka, logo Jarwoo
// muncul huruf-per-huruf berurutan sepanjang garis, terus abis
// SPLASH_DURATION_MS fade-out ilang sendiri, nampilin isi app di baliknya.
// Dirender sebagai "absolute inset-0" (bukan fixed) karena ditaro di dalam
// Frame yang udah "relative" — jadi nutupin persis area app frame-nya aja
// (h-dvh, max-w-430), sama kayak trik yang dipake CartBottomBar/CartSheet.
//
// PENTING: rotasi logo ditaro di <div> BIASA (bukan motion.*) yang
// membungkus <motion.h1>. Kalo transform dipasang lewat inline style
// langsung di elemen yang sama dengan yang dipegang Framer Motion (yang
// punya animate/variants berisi x/y/scale/dll), Framer bakal generate &
// nimpa CSS transform elemen itu sendiri — rotasi manual jadi ke-overwrite
// dan keliatannya "ga ada bedanya".
export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-white"
        >
          <div className="-rotate-2">
            <motion.h1
              variants={letterContainer}
              initial="hidden"
              animate="show"
              style={{ fontFamily: "'Pacifico', cursive", color: "#ea4c89" }}
              className="flex text-6xl"
            >
              {LOGO_TEXT.split("").map((char, i) => (
                <motion.span key={i} variants={letterVariants} className="inline-block">
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="text-[13px] font-medium text-gray"
          >
            Sistem Kasir
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
