"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCart } from "./CartContext";
import {
  PapayaIcon,
  CarrotIcon,
  TomatoIcon,
  OnionIcon,
} from "./icons/Produce";
import { WaterBottleIcon } from "./icons/Drinks";

// Kumpulan "logo" produk yang dipamerin gantian di badge. Campur antara
// foto produk asli (webp, transparan) sama ilustrasi vektor kategori,
// biar kelihatan hidup & representatif ("kunci mas", "mi instan", buah,
// sayur, minuman).
type Logo =
  | { type: "image"; src: string; alt: string }
  | { type: "icon"; Icon: () => React.ReactElement; alt: string };

const LOGOS: Logo[] = [
  { type: "image", src: "/categories/kunci-mas.webp", alt: "Kunci Mas" },
  { type: "icon", Icon: TomatoIcon, alt: "Tomat" },
  { type: "image", src: "/categories/mie-instan.webp", alt: "Mi Instan" },
  { type: "icon", Icon: PapayaIcon, alt: "Pepaya" },
  { type: "icon", Icon: WaterBottleIcon, alt: "Minuman" },
  { type: "icon", Icon: CarrotIcon, alt: "Wortel" },
  { type: "icon", Icon: OnionIcon, alt: "Bawang" },
];

const CYCLE_MS = 2200;

// Badge mengambang "Mulai Jual" di pojok kanan-bawah halaman utama, ngarah
// ke /kasir. Dirender langsung di AppShell, di luar div ber-transform.
//
// PENTING: pakai `absolute` (nempel ke bottom Frame yang udah h-dvh),
// BUKAN `position: fixed`. Fixed itu ngukur ke "layout viewport" browser,
// yang di Chrome/Android sering lebih tinggi dari area yang keliatan
// (gara-gara address bar / gesture-nav bar), jadi elemen fixed-bottom
// suka kepotong / ketutupan di ujung layar. Absolute relatif ke Frame
// (yang tingginya udah pas dvh) ga kena masalah itu.
export default function StartSellingBadge() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [logoIndex, setLogoIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLogoIndex((i) => (i + 1) % LOGOS.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  if (pathname !== "/") return null;

  const logo = LOGOS[logoIndex];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        // Naik dikit pas CartBottomBar lagi muncul biar ga numpuk.
        y: itemCount > 0 ? -78 : 0,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="pointer-events-none absolute inset-x-0 bottom-5 z-30 h-0 w-full"
    >
      <Link
        href="/kasir"
        className="pointer-events-auto absolute right-5 flex h-12 items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-dark py-3 pl-5 pr-4 text-white shadow-[0_10px_26px_rgba(34,145,64,0.45)] transition-transform active:scale-95"
      >
        <span className="whitespace-nowrap text-[13.5px] font-bold tracking-tight">
          Mulai Jual
        </span>
        <ArrowRight size={15} strokeWidth={2.6} className="shrink-0" />

        {/* Panggung logo: sengaja overflow-visible & lebih gede dari
            tinggi card, biar logonya "meledak" keluar dari badge. */}
        <span className="pointer-events-none absolute -right-3.5 -top-4 flex h-[62px] w-[62px] items-center justify-center overflow-visible">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={logoIndex}
              initial={{ opacity: 0, scale: 0.5, rotate: -14, y: 6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.55, rotate: 12, y: -6 }}
              transition={{ duration: 0.5, ease: [0.34, 1.4, 0.4, 1] }}
              className="absolute flex h-[62px] w-[62px] items-center justify-center drop-shadow-[0_6px_10px_rgba(0,0,0,0.28)]"
            >
              {logo.type === "image" ? (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={62}
                  height={62}
                  className="h-full w-full object-contain"
                />
              ) : (
                <logo.Icon />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
      </Link>
    </motion.div>
  );
}
