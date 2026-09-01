"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Bell, ChevronDown } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function Header() {
  const { isOpen, toggle } = useSidebar();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative flex items-center justify-between px-5 pt-2"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label="Buka menu navigasi"
          aria-expanded={isOpen}
          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#2FB350] to-[#1F7A32] ring-2 ring-white transition-transform active:scale-95"
        >
          <svg viewBox="0 0 44 44" className="h-full w-full">
            <circle cx="22" cy="17" r="7" fill="#FFE0C2" />
            <path d="M8 40c1-9 7-14 14-14s13 5 14 14" fill="#3B4149" />
          </svg>
        </button>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-ink leading-none">
              Muhammad Farhan
            </span>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 1l2.2 1.6 2.7-.4 1 2.5 2.5 1-.4 2.7L20 10l-1.9 2 .4 2.7-2.5 1-1 2.5-2.7-.4L10 20l-2.1-1.7-2.7.4-1-2.5-2.5-1 .4-2.7L0 10l2-2.2-.4-2.7 2.5-1 1-2.5 2.7.4L10 1z"
                fill="#3B6DF0"
              />
              <path d="M6.3 10.2l2.4 2.4 5-5.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <button className="mt-0.5 flex items-center gap-0.5 text-[12px] text-gray">
            Dubai, United Arab Emirate
            <ChevronDown size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          aria-label="Cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <ShoppingBag size={18} strokeWidth={2} className="text-ink" />
        </button>
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <Bell size={18} strokeWidth={2} className="text-ink" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-badge px-1 text-[9px] font-bold text-white ring-2 ring-[#EFF1F0]">
            12
          </span>
        </button>
      </div>
    </motion.header>
  );
}
