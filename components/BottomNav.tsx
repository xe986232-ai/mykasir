"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Store, Search, Activity, User } from "lucide-react";

const items = [
  { label: "Home", Icon: Home },
  { label: "Stores", Icon: Store },
  { label: "Search", Icon: Search },
  { label: "Activity", Icon: Activity },
  { label: "Profile", Icon: User },
];

export default function BottomNav() {
  const [active, setActive] = useState(0);

  return (
    <div className="sticky bottom-0 mt-auto border-t border-[--color-gray-light] bg-white/95 backdrop-blur px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
      <div className="flex items-center justify-between">
        {items.map(({ label, Icon }, i) => {
          const isActive = active === i;
          return (
            <button
              key={label}
              onClick={() => setActive(i)}
              className="flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              <div className="relative flex h-6 items-center justify-center">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={isActive ? "text-[--color-primary]" : "text-[--color-gray]"}
                />
              </div>
              <span
                className={`text-[10px] ${
                  isActive
                    ? "font-bold text-[--color-primary]"
                    : "font-medium text-[--color-gray]"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -bottom-0 h-1 w-1 rounded-full bg-[--color-primary]"
                  transition={{ duration: 0.25 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
