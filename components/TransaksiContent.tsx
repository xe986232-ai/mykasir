"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote,
  CheckCircle2,
  ChevronDown,
  Circle,
  Loader2,
  QrCode,
  Receipt,
  RefreshCw,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import AnimatedNumber from "./AnimatedNumber";
import { formatRupiah } from "@/lib/products";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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

const LONG_PRESS_MS = 480;

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
function TransaksiHeader({
  onRefresh,
  loading,
  selectMode,
  selectedCount,
  onExitSelectMode,
  onRequestBulkDelete,
}: {
  onRefresh: () => void;
  loading: boolean;
  selectMode: boolean;
  selectedCount: number;
  onExitSelectMode: () => void;
  onRequestBulkDelete: () => void;
}) {
  const { toggle } = useSidebar();

  if (selectMode) {
    return (
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-center justify-between px-5 pt-2"
      >
        <button
          onClick={onExitSelectMode}
          aria-label="Batal pilih"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform"
        >
          <X size={16} className="text-ink" />
        </button>
        <span className="text-[13px] font-bold text-ink">
          {selectedCount} transaksi dipilih
        </span>
        <button
          onClick={onRequestBulkDelete}
          disabled={selectedCount === 0}
          aria-label="Hapus transaksi terpilih"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-badge/10 text-badge shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform disabled:opacity-40"
        >
          <Trash2 size={16} />
        </button>
      </motion.header>
    );
  }

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

function TransactionCard({
  trx,
  delay,
  selectMode,
  selected,
  onLongPress,
  onToggleSelect,
}: {
  trx: TransactionRow;
  delay: number;
  selectMode: boolean;
  selected: boolean;
  onLongPress: (id: string) => void;
  onToggleSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = paymentMeta[trx.payment_method] ?? { label: trx.payment_method, Icon: Wallet };
  const itemCount = trx.transaction_items.reduce((sum, it) => sum + it.qty, 0);

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFiredRef = useRef(false);

  function clearPressTimer() {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }

  function handlePointerDown() {
    longPressFiredRef.current = false;
    clearPressTimer();
    pressTimerRef.current = setTimeout(() => {
      longPressFiredRef.current = true;
      pressTimerRef.current = null;
      onLongPress(trx.id);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(15);
      }
    }, LONG_PRESS_MS);
  }

  function handleHeaderClick() {
    if (longPressFiredRef.current) {
      longPressFiredRef.current = false;
      return;
    }
    if (selectMode) {
      onToggleSelect(trx.id);
    } else {
      setExpanded((v) => !v);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      onPointerDown={handlePointerDown}
      onPointerUp={clearPressTimer}
      onPointerLeave={clearPressTimer}
      onPointerCancel={clearPressTimer}
      className={`rounded-2xl bg-white p-3.5 shadow-[0_2px_10px_rgba(20,24,20,0.06)] transition-colors ${
        selected ? "ring-2 ring-primary bg-primary-light/30" : ""
      } ${selectMode ? "select-none" : ""}`}
    >
      <button
        onClick={handleHeaderClick}
        className="flex w-full items-center gap-3 text-left"
      >
        <AnimatePresence initial={false}>
          {selectMode && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex shrink-0 items-center overflow-hidden"
            >
              {selected ? (
                <CheckCircle2 size={22} className="text-primary" />
              ) : (
                <Circle size={22} className="text-gray/35" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
          {!selectMode && (
            <ChevronDown
              size={16}
              className={`shrink-0 text-gray transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          )}
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

  // Mode seleksi massal: aktif kalau kartu transaksi ditahan (long-press).
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  function handleLongPress(id: string) {
    setSelectMode(true);
    setSelectedIds((prev) => new Set(prev).add(id));
  }

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);
    const ids = Array.from(selectedIds);

    // Hapus dulu transaction_items yang nunjuk ke transaksi terpilih,
    // baru transaksinya sendiri — jaga-jaga kalau FK di Supabase belum
    // di-set ON DELETE CASCADE.
    const { error: itemsError } = await supabase
      .from("transaction_items")
      .delete()
      .in("transaction_id", ids);

    if (itemsError) {
      setBulkDeleting(false);
      setError(itemsError.message || "Gagal menghapus transaksi terpilih.");
      setShowBulkConfirm(false);
      return;
    }

    const { error: deleteError } = await supabase
      .from("transactions")
      .delete()
      .in("id", ids);
    setBulkDeleting(false);

    if (deleteError) {
      setError(deleteError.message || "Gagal menghapus transaksi terpilih.");
      setShowBulkConfirm(false);
      return;
    }

    setShowBulkConfirm(false);
    exitSelectMode();
    load();
  }

  async function load() {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setError(
        "Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables."
      );
      setLoading(false);
      return;
    }

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
      <TransaksiHeader
        onRefresh={load}
        loading={loading}
        selectMode={selectMode}
        selectedCount={selectedIds.size}
        onExitSelectMode={exitSelectMode}
        onRequestBulkDelete={() => selectedIds.size > 0 && setShowBulkConfirm(true)}
      />
      {!selectMode && transactions.length > 0 && (
        <p className="px-5 pt-1.5 text-[10.5px] text-gray/70">
          Tahan kartu transaksi untuk memilih beberapa sekaligus.
        </p>
      )}
      <SummaryCards transactions={transactions} />

      <div className={`mt-4 flex flex-col gap-2.5 px-5 ${selectMode ? "pb-24" : "pb-6"}`}>
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
          <TransactionCard
            key={trx.id}
            trx={trx}
            delay={0.05 + i * 0.03}
            selectMode={selectMode}
            selected={selectedIds.has(trx.id)}
            onLongPress={handleLongPress}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </div>

      {/* Bar aksi hapus massal, muncul selama mode seleksi aktif */}
      <AnimatePresence>
        {selectMode && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[430px] items-center justify-between rounded-t-3xl bg-white px-5 py-4 shadow-[0_-8px_24px_rgba(20,24,20,0.15)]"
          >
            <button
              onClick={exitSelectMode}
              className="text-[12.5px] font-semibold text-gray active:scale-95 transition-transform"
            >
              Batal
            </button>
            <span className="text-[12.5px] font-semibold text-ink">
              {selectedIds.size} dipilih
            </span>
            <button
              onClick={() => selectedIds.size > 0 && setShowBulkConfirm(true)}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-1.5 rounded-full bg-badge px-4 py-2.5 text-[12.5px] font-bold text-white shadow-[0_2px_10px_rgba(20,24,20,0.06)] active:scale-95 transition-transform disabled:opacity-40"
            >
              <Trash2 size={14} />
              Hapus
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal konfirmasi hapus massal */}
      <AnimatePresence>
        {showBulkConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !bulkDeleting && setShowBulkConfirm(false)}
              className="fixed inset-0 z-50 bg-black/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="fixed inset-x-6 top-1/2 z-50 mx-auto max-w-[380px] -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-badge/10">
                <Trash2 size={20} className="text-badge" />
              </div>
              <h2 className="mt-3 text-center text-[14.5px] font-bold text-ink">
                Hapus {selectedIds.size} transaksi?
              </h2>
              <p className="mt-1 text-center text-[12px] text-gray">
                Transaksi yang dipilih akan dihapus permanen dan tidak bisa dikembalikan.
              </p>

              <div className="mt-5 flex gap-2.5">
                <button
                  onClick={() => setShowBulkConfirm(false)}
                  disabled={bulkDeleting}
                  className="flex-1 rounded-2xl bg-gray-light py-3 text-[13px] font-bold text-ink active:scale-[0.98] transition-transform disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-badge py-3 text-[13px] font-bold text-white active:scale-[0.98] transition-transform disabled:opacity-60"
                >
                  {bulkDeleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
