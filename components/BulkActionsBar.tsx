"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { useBulkActions } from "./BulkActionsContext";

export default function BulkActionsBar() {
  const { bulkActions, confirmOpen, requestConfirm, closeConfirm } = useBulkActions();
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    if (!bulkActions) return;
    setDeleting(true);
    await bulkActions.onConfirmDelete();
    setDeleting(false);
    closeConfirm();
  }

  return (
    <>
      {/* Bar aksi bawah — pakai `absolute` (bukan `fixed`) persis kayak
          CartBottomBar, karena Frame di AppShell sudah `relative h-dvh`
          dan komponen ini dirender di luar panel yang di-scroll. */}
      <AnimatePresence>
        {bulkActions && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="absolute inset-x-0 bottom-0 z-40 mx-auto flex w-full items-center justify-between rounded-t-3xl bg-white px-5 py-4 shadow-[0_-8px_24px_rgba(20,24,20,0.15)]"
          >
            <button
              onClick={bulkActions.onCancel}
              className="text-[12.5px] font-semibold text-gray active:scale-95 transition-transform"
            >
              Batal
            </button>
            <span className="text-[12.5px] font-semibold text-ink">
              {bulkActions.count} dipilih
            </span>
            <button
              onClick={requestConfirm}
              disabled={bulkActions.count === 0}
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
        {bulkActions && confirmOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && closeConfirm()}
              className="absolute inset-0 z-50 bg-black/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="absolute inset-x-6 top-1/2 z-50 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-badge/10">
                <Trash2 size={20} className="text-badge" />
              </div>
              <h2 className="mt-3 text-center text-[14.5px] font-bold text-ink">
                Hapus {bulkActions.count} {bulkActions.itemLabel}?
              </h2>
              <p className="mt-1 text-center text-[12px] text-gray">
                Data yang dipilih akan dihapus permanen dan tidak bisa dikembalikan.
              </p>

              <div className="mt-5 flex gap-2.5">
                <button
                  onClick={closeConfirm}
                  disabled={deleting}
                  className="flex-1 rounded-2xl bg-gray-light py-3 text-[13px] font-bold text-ink active:scale-[0.98] transition-transform disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-badge py-3 text-[13px] font-bold text-white active:scale-[0.98] transition-transform disabled:opacity-60"
                >
                  {deleting ? (
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
