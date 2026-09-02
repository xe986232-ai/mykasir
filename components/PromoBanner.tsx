"use client";

import { useEffect, useRef, useState } from "react";
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

const AUTOPLAY_MS = 4500;
const FALLBACK_COLOR = "#2FB350";

// cache biar 1 gambar cuma dianalisa sekali per sesi, bukan tiap slide balik lagi
const colorCache = new Map<string, string>();

/**
 * Ambil warna paling dominan dari sebuah gambar dengan menggambarnya
 * ke canvas kecil lalu menghitung warna mana yang paling sering muncul.
 * Hasilnya sedikit digelapkan biar tetap kebaca kalau dipakai di atas
 * background putih (tombol "Get Now").
 */
function getDominantColor(src: string): Promise<string> {
  const cached = colorCache.get(src);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      try {
        const size = 40;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(FALLBACK_COLOR);

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        const buckets = new Map<
          string,
          { count: number; r: number; g: number; b: number }
        >();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 200) continue;

          // kuantisasi ringan biar warna yang mirip-mirip dianggap satu kelompok
          const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
          const entry = buckets.get(key);
          if (entry) {
            entry.count++;
          } else {
            buckets.set(key, { count: 1, r, g, b });
          }
        }

        let best = { count: 0, r: 0, g: 0, b: 0 };
        buckets.forEach((entry) => {
          if (entry.count > best.count) best = entry;
        });

        if (best.count === 0) return resolve(FALLBACK_COLOR);

        // gelapkan sedikit biar teks tetap kontras di atas tombol putih
        const darken = 0.82;
        const r = Math.round(best.r * darken);
        const g = Math.round(best.g * darken);
        const b = Math.round(best.b * darken);
        const hex = `#${[r, g, b]
          .map((c) => c.toString(16).padStart(2, "0"))
          .join("")}`;

        colorCache.set(src, hex);
        resolve(hex);
      } catch {
        resolve(FALLBACK_COLOR);
      }
    };
    img.onerror = () => resolve(FALLBACK_COLOR);
  });
}

export default function PromoBanner() {
  const [index, setIndex] = useState(0);
  const [accentColor, setAccentColor] = useState(FALLBACK_COLOR);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[index];

  // deteksi warna dominan tiap kali slide aktif berganti
  useEffect(() => {
    let cancelled = false;
    getDominantColor(slide.image).then((color) => {
      if (!cancelled) setAccentColor(color);
    });
    return () => {
      cancelled = true;
    };
  }, [slide.image]);

  // ganti slide otomatis; timer di-reset tiap kali index berubah
  // (baik lewat autoplay sendiri maupun swipe/klik dot manual)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [index]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) {
      setIndex((i) => (i + 1) % slides.length);
    } else if (info.offset.x > 60) {
      setIndex((i) => (i - 1 + slides.length) % slides.length);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
      className="mt-5 px-5"
    >
      <div className="relative">
        {/* kartu belakang: solid putih, ngintip tipis di sekeliling banner
            (jarak dikecilin dari -inset-2 ke -inset-1 biar lebih halus). */}
        <div className="absolute -inset-1 rounded-[28px] bg-white" />

        {/* kartu banner utama — shadow dihapus biar nyatu sama kartu putih
            di belakangnya, bukan keliatan ngambang terpisah. */}
        <div className="relative h-[168px] w-full overflow-hidden rounded-3xl">
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
                <button
                  style={{ color: accentColor }}
                  className="w-fit rounded-full bg-white px-5 py-2 text-[12px] font-bold shadow-[0_6px_14px_rgba(20,24,20,0.25)] transition-transform active:scale-95"
                >
                  {slide.cta}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* potongan kecil di tengah-bawah banner, tempat dot slider nangkring.
            Padding dibalikin simetris & digedein lagi (py-1.5). Posisi
            diangkat (translate-y-1, bukan translate-y-2) biar pas masih
            di dalam batas kartu putih di belakang banner (yang cuma
            ngintip 4px / -inset-1 dari banner). */}
        <div className="absolute left-1/2 bottom-0 z-20 flex -translate-x-1/2 translate-y-1 items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5">
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
