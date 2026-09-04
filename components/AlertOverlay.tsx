"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useAlert, type AlertItem, type AlertType } from "./AlertContext";

const AUTO_DISMISS_MS = 3200;

// Ikon + warna per tipe alert. Class-nya ditulis LENGKAP sebagai literal
// string (bukan digabung pas runtime kayak `${x}/10`) supaya Tailwind JIT
// bisa nge-detect & generate class-nya dari scan source code.
const ALERT_STYLES: Record<
  AlertType,
  { icon: typeof CheckCircle2; badgeClass: string; iconClass: string }
> = {
  success: { icon: CheckCircle2, badgeClass: "bg-primary/10", iconClass: "text-primary" },
  error: { icon: XCircle, badgeClass: "bg-badge/10", iconClass: "text-badge" },
  info: { icon: Info, badgeClass: "bg-delivery/10", iconClass: "text-delivery" },
};

function ToastCard({ alert, onDismiss }: { alert: AlertItem; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert.id]);

  const { icon: Icon, badgeClass, iconClass } = ALERT_STYLES[alert.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ type: "spring", damping: 28, stiffness: 340 }}
      onClick={onDismiss}
      className="pointer-events-auto flex w-full items-start gap-2.5 overflow-hidden rounded-2xl bg-white p-3.5 pr-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
    >
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${badgeClass}`}
      >
        <Icon size={16} className={iconClass} />
      </span>
      <p className="min-w-0 flex-1 pt-1 text-[12.5px] font-medium leading-snug text-ink">
        {alert.message}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        aria-label="Tutup notifikasi"
        className="mt-0.5 shrink-0 rounded-full p-1 text-gray active:scale-90 transition-transform"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// Sengaja dirender sebagai komponen terpisah (bukan langsung di dalam
// AlertProvider) & dipasang di Frame (AppShell.tsx) sejajar dengan
// CartBottomBar/BulkActionsBar/SplashScreen — lihat komentar di
// AlertContext.tsx buat alasan lengkapnya.
export default function AlertOverlay() {
  const { alerts, dismissAlert } = useAlert();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-[70] flex flex-col items-center gap-2 px-4">
      <AnimatePresence initial={false}>
        {alerts.map((a) => (
          <ToastCard key={a.id} alert={a} onDismiss={() => dismissAlert(a.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
