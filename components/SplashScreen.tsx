"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPLASH_DURATION_MS = 1400;

// Splash screen simple: cuma nongol pas app pertama kali dibuka, logo Jarwoo
// muncul di tengah dengan fade+scale-in, terus abis SPLASH_DURATION_MS
// fade-out ilang sendiri, nampilin isi app di baliknya. Dirender sebagai
// "absolute inset-0" (bukan fixed) karena ditaro di dalam Frame yang udah
// "relative" — jadi nutupin persis area app frame-nya aja (h-dvh, max-w-430),
// sama kayak trik yang dipake CartBottomBar/CartSheet.
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
          <motion.img
            src="/jarwoo-logo.svg"
            alt="Jarwoo"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-48"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-[13px] font-medium text-gray"
          >
            Sistem Kasir
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
