"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Animasiin angka (harga, qty, kembalian, dll) biar transisinya beneran
 * "ngerol" halus pas nilainya berubah — bukan cuma ganti teks kaku.
 * Pakai spring buat nge-tween nilai numeriknya sendiri, terus tiap frame
 * di-format ulang jadi string (mata uang / angka biasa) lewat `format`.
 */
export default function AnimatedNumber({
  value,
  format,
  className,
}: {
  value: number;
  /** Fungsi format angka mentah -> string tampilan, misal "Rp 32.000". */
  format?: (value: number) => string;
  className?: string;
}) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, {
    stiffness: 140,
    damping: 22,
    mass: 0.7,
  });
  const display = useTransform(spring, (v) =>
    format ? format(v) : Math.round(v).toLocaleString("id-ID")
  );

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span className={className}>{display}</motion.span>;
}
