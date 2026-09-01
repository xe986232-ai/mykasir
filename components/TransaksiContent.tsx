"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote,
  ChevronDown,
  QrCode,
  Receipt,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import AnimatedNumber from "./AnimatedNumber";
import { formatRupiah } from "@/lib/products";
import { supabase } from "@/lib/supabase";

type TransactionItemRow = {
  id: number;
  name: string;
  unit: string | null;
  price: number;
  qty: number;
  subtotal: number;
};

type TransactionRow = {
  id: string;
  subtotal: number;
  payment_method: "cash" | "qris" | "card" | string;
  cash_received: number | null;
  change_amount: number | null;
  currency: string;
  created_at: string;
  transaction_items: TransactionItemRow[];
};

const paymentMeta: Record<string, { label: string; Icon: typeof Banknote }> = {
  cash: { label: "Tunai", Icon: Banknote },
  qris: { label: "QRIS", Icon: QrCode },
  card: { label: "Kartu", Icon: Wallet },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Header sederhana, konsisten sama gaya header halaman lain (tombol
// hamburger bulat putih) tapi tanpa profil user — cuma judul halaman.
function TransaksiHeader({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) {
  const { toggle } = useSidebar();
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex items-center justify-between px-5 pt-2"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label="Buka menu navigasi"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <Receipt size={17} className="text-ink" />
        </button>
        <span className="text-[15px] font-bold text-ink">Riwayat Transaksi</span>
      </div>

      <button
        onClick={onRefresh}
        aria-label="Muat ulang"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
      >
        <RefreshCw size={16} className={`text-ink ${loading ? "animate-spin" : ""}`} />
      </button>
    </motion.header>
  );
}

function SummaryCards({ transactions }: { transactions: TransactionRow[] }) {
  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.subtotal), 0);
  const totalTrx = transactions.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
      className="mt-4 grid grid-cols-2 gap-3 px-5"
    >
      <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
        <p className="text-[11px] font-medium text-gray">Total Pendapatan</p>
        <p className="mt-1 text-[16px] font-extrabold text-primary">
          <AnimatedNumber value={totalRevenue} format={(v) => formatRupiah(v)} />
        </p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(20,24,20,0.06)]">
        <p className="text-[11px] font-medium text-gray">Jumlah Transaksi</p>
        <p className="mt-1 text-[16px] font-extrabold text-ink">
          <AnimatedNumber value={totalTrx} />
        </p>
      </div>
    </motion.div>
  );
}

function TransactionCard({ trx, delay }: { trx: TransactionRow; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const meta = paymentMeta[trx.payment_method] ?? { label: trx.payment_method, Icon: Wallet };
  const itemCount = trx.transaction_items.reduce((sum, it) => sum + it.qty, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="rounded-2xl bg-white p-3.5 shadow-[0_2px_10px_rgba(20,24,20,0.06)]"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light">
          <meta.Icon size={17} className="text-primary" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold text-ink">
            {formatDateTime(trx.created_at)}
          </p>
          <p className="text-[11px] text-gray">
            {meta.label} &middot; {itemCount} item
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[13.5px] font-extrabold text-ink">
            {formatRupiah(Number(trx.subtotal))}
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-gray transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex flex-col gap-2 border-t border-black/5 pt-3">
              {trx.transaction_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-[12px]">
                  <span className="text-ink">
                    {item.name}{" "}
                    <span className="text-gray">
                      &times;{item.qty}
                      {item.unit ? ` (${item.unit})` : ""}
                    </span>
                  </span>
                  <span className="font-semibold text-ink">
                    {formatRupiah(Number(item.subtotal))}
                  </span>
                </div>
              ))}

              {trx.payment_method === "cash" && trx.cash_received != null && (
                <div className="mt-1 flex items-center justify-between border-t border-black/5 pt-2 text-[12px]">
                  <span className="text-gray">Uang diterima</span>
                  <span className="font-semibold text-ink">
                    {formatRupiah(Number(trx.cash_received))}
                  </span>
                </div>
              )}
              {trx.payment_method === "cash" && trx.change_amount != null && (
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-gray">Kembalian</span>
                  <span className="font-semibold text-primary">
                    {formatRupiah(Number(trx.change_amount))}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TransaksiContent() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("transactions")
      .select("*, transaction_items(*)")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setTransactions((data as TransactionRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <TransaksiHeader onRefresh={load} loading={loading} />
      <SummaryCards transactions={transactions} />

      <div className="mt-4 flex flex-col gap-2.5 px-5 pb-6">
        {loading && transactions.length === 0 && (
          <p className="py-10 text-center text-[12.5px] text-gray">Memuat transaksi...</p>
        )}

        {error && (
          <p className="py-10 text-center text-[12.5px] font-medium text-badge">{error}</p>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-14">
            <Receipt size={32} className="text-gray" strokeWidth={1.6} />
            <p className="text-[12.5px] text-gray">Belum ada transaksi.</p>
          </div>
        )}

        {transactions.map((trx, i) => (
          <TransactionCard key={trx.id} trx={trx} delay={0.05 + i * 0.03} />
        ))}
      </div>
    </>
  );
}
