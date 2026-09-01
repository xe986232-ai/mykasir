"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, CheckCircle2, ChevronLeft, Minus, Plus, QrCode, Trash2, Wallet, X } from "lucide-react";
import { useCart } from "./CartContext";
import AnimatedNumber from "./AnimatedNumber";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type Step = "cart" | "payment" | "success";
type PaymentMethod = "cash" | "qris" | "card";

const paymentMethods: { id: PaymentMethod; label: string; Icon: typeof Banknote }[] = [
  { id: "cash", label: "Tunai", Icon: Banknote },
  { id: "qris", label: "QRIS", Icon: QrCode },
  { id: "card", label: "Kartu", Icon: Wallet },
];

function formatMoney(value: number, currency: string) {
  return `${currency} ${Math.round(value).toLocaleString("id-ID")}`;
}

export default function CartSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, subtotal, currency, increment, decrement, removeItem, clearCart } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [cashInput, setCashInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const cashReceived = parseFloat(cashInput.replace(",", ".")) || 0;
  const change = cashReceived - subtotal;

  function handleClose() {
    onClose();
    // reset sedikit delay biar ga keliatan "reset" pas sheet lagi nutup
    setTimeout(() => {
      setStep("cart");
      setMethod("cash");
      setCashInput("");
      setSaveError(null);
    }, 250);
  }

  async function handleFinish() {
    setSaving(true);
    setSaveError(null);

    if (!isSupabaseConfigured) {
      setSaveError(
        "Supabase belum dikonfigurasi di server ini. Set env NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      setSaving(false);
      return;
    }

    // Simpan transaksi + item-nya ke Supabase (tabel transactions & transaction_items).
    const { data: trx, error: trxError } = await supabase
      .from("transactions")
      .insert({
        subtotal,
        payment_method: method,
        cash_received: method === "cash" ? cashReceived : null,
        change_amount: method === "cash" ? Math.max(change, 0) : null,
        currency,
      })
      .select()
      .single();

    if (trxError || !trx) {
      setSaveError(trxError?.message ?? "Gagal menyimpan transaksi.");
      setSaving(false);
      return;
    }

    const { error: itemsError } = await supabase.from("transaction_items").insert(
      items.map((item) => ({
        transaction_id: trx.id,
        product_id: item.id,
        name: item.name,
        unit: item.unit,
        price: item.priceValue,
        qty: item.qty,
        subtotal: item.priceValue * item.qty,
      }))
    );

    setSaving(false);

    if (itemsError) {
      setSaveError(itemsError.message);
      return;
    }

    clearCart();
    setStep("success");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 z-50 bg-black/40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="absolute inset-x-0 bottom-0 z-50 flex max-h-[85%] flex-col rounded-t-3xl bg-[#EFF1F0]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              {step === "payment" ? (
                <button
                  onClick={() => setStep("cart")}
                  aria-label="Kembali"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm active:scale-90 transition-transform"
                >
                  <ChevronLeft size={17} className="text-ink" />
                </button>
              ) : (
                <span className="text-[15px] font-bold text-ink">
                  {step === "cart" ? "Keranjang" : "Selesai"}
                </span>
              )}
              {step !== "success" && (
                <button
                  onClick={handleClose}
                  aria-label="Tutup"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm active:scale-90 transition-transform"
                >
                  <X size={16} className="text-ink" />
                </button>
              )}
            </div>

            {/* STEP: cart */}
            {step === "cart" && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-5 pb-3">
                  {items.length === 0 ? (
                    <p className="py-10 text-center text-[13px] text-gray">
                      Keranjang masih kosong.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3 py-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-[0_2px_8px_rgba(20,24,20,0.05)]"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-light">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="h-full w-full object-contain"
                              />
                            ) : item.Icon ? (
                              <div className="h-9 w-9">
                                <item.Icon />
                              </div>
                            ) : null}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12.5px] font-semibold text-ink">
                              {item.name}
                            </p>
                            <p className="text-[11.5px] font-bold text-primary">
                              <AnimatedNumber
                                value={item.priceValue * item.qty}
                                format={(v) => formatMoney(v, item.currency)}
                              />
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                item.qty === 1 ? removeItem(item.id) : decrement(item.id)
                              }
                              aria-label={`Kurangi ${item.name}`}
                              className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-light text-ink active:scale-90 transition-transform"
                            >
                              {item.qty === 1 ? (
                                <Trash2 size={12} />
                              ) : (
                                <Minus size={12} strokeWidth={2.6} />
                              )}
                            </button>
                            <span className="w-4 text-center text-[12.5px] font-bold text-ink">
                              <AnimatedNumber value={item.qty} />
                            </span>
                            <button
                              onClick={() => increment(item.id)}
                              aria-label={`Tambah ${item.name}`}
                              className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white active:scale-90 transition-transform"
                            >
                              <Plus size={12} strokeWidth={2.6} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="border-t border-black/5 bg-[#EFF1F0] px-5 pb-6 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] text-gray">Subtotal</span>
                      <span className="text-[15px] font-extrabold text-ink">
                        <AnimatedNumber
                          value={subtotal}
                          format={(v) => formatMoney(v, currency)}
                        />
                      </span>
                    </div>
                    <button
                      onClick={() => setStep("payment")}
                      className="mt-3 w-full rounded-2xl bg-primary py-3.5 text-[13.5px] font-bold text-white active:scale-[0.98] transition-transform"
                    >
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP: payment */}
            {step === "payment" && (
              <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-6">
                <p className="text-[12px] font-semibold text-gray">Metode Pembayaran</p>
                <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                  {paymentMethods.map(({ id, label, Icon }) => {
                    const active = method === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setMethod(id)}
                        className={`flex flex-col items-center gap-1.5 rounded-2xl py-3.5 text-[11.5px] font-semibold transition-colors ${
                          active
                            ? "bg-primary text-white"
                            : "bg-white text-ink shadow-[0_2px_8px_rgba(20,24,20,0.05)]"
                        }`}
                      >
                        <Icon size={18} strokeWidth={2} />
                        {label}
                      </button>
                    );
                  })}
                </div>

                {method === "cash" && (
                  <div className="mt-4">
                    <p className="text-[12px] font-semibold text-gray">Uang Diterima</p>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={cashInput}
                      onChange={(e) => setCashInput(e.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-[15px] font-bold text-ink shadow-[0_2px_8px_rgba(20,24,20,0.05)] outline-none placeholder:text-gray"
                    />
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(20,24,20,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] text-gray">Total Tagihan</span>
                    <span className="text-[13.5px] font-bold text-ink">
                      <AnimatedNumber
                        value={subtotal}
                        format={(v) => formatMoney(v, currency)}
                      />
                    </span>
                  </div>
                  {method === "cash" && (
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] text-gray">Kembalian</span>
                      <span
                        className={`text-[13.5px] font-bold ${
                          change < 0 ? "text-badge" : "text-primary"
                        }`}
                      >
                        <AnimatedNumber
                          value={Math.max(change, 0)}
                          format={(v) => formatMoney(v, currency)}
                        />
                      </span>
                    </div>
                  )}
                </div>

                {saveError && (
                  <p className="mt-3 text-center text-[11.5px] font-medium text-badge">
                    {saveError}
                  </p>
                )}

                <button
                  disabled={(method === "cash" && cashReceived < subtotal) || saving}
                  onClick={handleFinish}
                  className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-[13.5px] font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
                >
                  {saving ? "Menyimpan..." : "Selesaikan Transaksi"}
                </button>
              </div>
            )}

            {/* STEP: success */}
            {step === "success" && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 pb-10 pt-4 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <CheckCircle2 size={56} className="text-primary" strokeWidth={1.6} />
                </motion.div>
                <p className="text-[15px] font-bold text-ink">Transaksi Berhasil</p>
                <p className="text-[12.5px] text-gray">
                  Pembayaran sudah tercatat, keranjang otomatis dikosongkan.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-3 w-full rounded-2xl bg-primary py-3.5 text-[13.5px] font-bold text-white active:scale-[0.98] transition-transform"
                >
                  Transaksi Baru
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
