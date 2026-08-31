"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "Vegetable Offers",
    discount: "20% OFF",
    date: "10 October, 2025",
    cta: "Get Now",
  },
  {
    id: 2,
    title: "Fresh Fruit Bundle",
    discount: "15% OFF",
    date: "14 October, 2025",
    cta: "Get Now",
  },
  {
    id: 3,
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
      <div className="relative h-[168px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#F2F7EE] to-[#E4EFDC]">
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
            className="absolute inset-0 flex cursor-grab items-center justify-between px-5 pt-4 active:cursor-grabbing"
          >
            <div className="z-10 flex h-full flex-col justify-between py-1">
              <div>
                <p className="text-[13px] font-semibold text-[--color-ink]">
                  {slide.title}
                </p>
                <p className="mt-1 text-[26px] font-extrabold leading-none text-[--color-primary-dark]">
                  {slide.discount}
                </p>
                <p className="mt-1.5 text-[11px] text-[--color-gray]">
                  {slide.date}
                </p>
              </div>
              <button className="w-fit rounded-full bg-[--color-primary] px-5 py-2 text-[12px] font-bold text-white shadow-[0_6px_14px_rgba(47,179,80,0.35)] active:scale-95 transition-transform">
                {slide.cta}
              </button>
            </div>

            <div className="pointer-events-none absolute right-[-8px] top-1/2 h-[150px] w-[150px] -translate-y-1/2">
              <ProduceCluster />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className="py-1"
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
    </motion.div>
  );
}

function ProduceCluster() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full">
      <ellipse cx="80" cy="90" rx="8" ry="34" fill="#3E9142" transform="rotate(-18 80 90)" />
      <path
        d="M62 70c9 0 14 4 12 12l-8 34c-2 6-8 6-10 0l-7-30c-2-8 4-16 13-16z"
        fill="#E8871C"
        transform="rotate(-8 70 90)"
      />
      <circle cx="105" cy="95" r="22" fill="#8B1E24" />
      <path d="M105 73c0-5 3-8 6-10-1 4-1 6-1 10h-5z" fill="#3E9142" />
      <circle cx="45" cy="105" r="20" fill="#6E1F73" opacity="0.9" />
      <circle cx="35" cy="90" r="10" fill="#7A2A80" opacity="0.9" />
      <circle cx="55" cy="88" r="9" fill="#7A2A80" opacity="0.9" />
    </svg>
  );
}
