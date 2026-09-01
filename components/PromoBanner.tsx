"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/promo/promo-banner.webp",
    title: "Vegetable Offers",
    discount: "20% OFF",
    date: "10 October, 2025",
    cta: "Get Now",
  },
  {
    id: 2,
    image: "/promo/promo-banner-kopi.webp",
    title: "Promo Kopi Sachet",
    discount: "15% OFF",
    date: "14 October, 2025",
    cta: "Get Now",
  },
  {
    id: 3,
    image: "/promo/promo-banner.webp",
    title: "Dairy Essentials",
    discount: "10% OFF",
    date: "18 October, 2025",
    cta: "Get Now",
  },
];

export default function PromoBanner() {
  const [index, setIndex] = useState(0);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) {
      setIndex((i) => (i + 1) % slides.length);
    } else if (info.offset.x > 60) {
      setIndex((i) => (i - 1 + slides.length) % slides.length);
    }
  }

  const slide = slides[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
      className="mt-5 px-5"
    >
      <div className="relative">
        {/* kartu belakang (efek stack), sedikit ngintip di sisi & bawah */}
        <div className="absolute inset-x-2 -bottom-2 top-2 rounded-[26px] bg-[#DCEBD9]" />

        {/* kartu banner utama */}
        <div className="relative h-[168px] w-full overflow-hidden rounded-3xl shadow-[0_10px_24px_rgba(20,24,20,0.08)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 flex cursor-grab items-center px-5 pt-4 pb-5 active:cursor-grabbing"
            >
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="430px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/5 to-transparent" />

              <div className="relative z-10 flex h-full flex-col justify-between py-1">
                <div>
                  <p className="text-[13px] font-semibold text-white">
                    {slide.title}
                  </p>
                  <p className="mt-1 text-[26px] font-extrabold leading-none text-white">
                    {slide.discount}
                  </p>
                  <p className="mt-1.5 text-[11px] text-white/80">
                    {slide.date}
                  </p>
                </div>
                <button className="w-fit rounded-full bg-white px-5 py-2 text-[12px] font-bold text-primary-dark shadow-[0_6px_14px_rgba(20,24,20,0.25)] active:scale-95 transition-transform">
                  {slide.cta}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* potongan kecil di tengah-bawah banner, tempat dot slider nangkring */}
        <div className="absolute left-1/2 bottom-0 z-20 flex -translate-x-1/2 translate-y-1/2 items-center gap-1.5 rounded-full bg-[#EFF1F0] px-3 py-1.5 shadow-[0_2px_6px_rgba(20,24,20,0.10)]">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="py-0.5"
            >
              <motion.span
                animate={{
                  width: i === index ? 18 : 6,
                  backgroundColor: i === index ? "#2FB350" : "#D7DBD6",
                }}
                transition={{ duration: 0.25 }}
                className="block h-1.5 rounded-full"
              />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
