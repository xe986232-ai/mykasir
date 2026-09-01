"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, Palette } from "lucide-react";
import { useTheme, THEMES } from "./ThemeContext";

export default function PengaturanContent() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-3 px-5"
      >
        <Link
          href="/"
          aria-label="Kembali"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} className="text-ink" />
        </Link>
        <div>
          <h1 className="text-[15px] font-bold text-ink">Pengaturan</h1>
          <p className="text-[11.5px] text-gray">Atur tampilan dan preferensi tokomu</p>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
        className="mt-4 flex flex-col gap-3 px-5 pb-10"
      >
        <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light">
              <Palette size={16} className="text-primary" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-ink">Palet warna</h2>
              <p className="text-[11px] text-gray">Pilih nuansa warna sidebar & aksen tokomu</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {THEMES.map((option) => {
              const selected = option.id === theme;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border border-black/[0.06] p-3 text-left transition-colors ${
                    selected ? "ring-2 ring-primary bg-primary-light/30" : "bg-gray-light/40"
                  }`}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 overflow-hidden rounded-lg"
                    aria-hidden="true"
                  >
                    <span className="h-full w-1/2" style={{ background: option.sidebar }} />
                    <span className="h-full w-1/2" style={{ background: option.accent }} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">{option.name}</p>
                    <p className="truncate text-[11px] text-gray">{option.description}</p>
                  </div>

                  {selected ? (
                    <CheckCircle2 size={22} className="shrink-0 text-primary" />
                  ) : (
                    <Circle size={22} className="shrink-0 text-gray/35" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <p className="px-1 text-[11px] text-gray">
          Pilihan palet tersimpan otomatis di perangkat ini dan langsung berlaku ke seluruh halaman.
        </p>
      </motion.section>
    </>
  );
}
