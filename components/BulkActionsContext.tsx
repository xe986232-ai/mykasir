"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type BulkActionsState = {
  count: number;
  // Label item buat teks konfirmasi, misal "produk" atau "transaksi".
  itemLabel: string;
  onCancel: () => void;
  onConfirmDelete: () => Promise<void>;
} | null;

type BulkActionsContextValue = {
  bulkActions: BulkActionsState;
  setBulkActions: (state: BulkActionsState) => void;
  confirmOpen: boolean;
  requestConfirm: () => void;
  closeConfirm: () => void;
};

const BulkActionsContext = createContext<BulkActionsContextValue | null>(null);

// Provider ini sengaja dipasang di level Frame (lihat AppShell), BUKAN di
// dalam panel konten yang di-scroll. Alasannya sama seperti CartBottomBar:
// panel konten punya `transform`, yang bikin `position: fixed` di
// dalamnya keanggep `absolute` relatif ke panel itu dan ikut kegeser pas
// discroll. Dengan nyimpen state di sini dan nge-render bar/modalnya di
// Frame, bar-nya beneran nempel di bawah layar.
export function BulkActionsProvider({ children }: { children: ReactNode }) {
  const [bulkActions, setBulkActions] = useState<BulkActionsState>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Kalau mode seleksi dimatikan (bulkActions jadi null) dari halaman mana
  // pun, otomatis tutup juga modal konfirmasinya biar ga nyangkut kebuka.
  useEffect(() => {
    if (!bulkActions) setConfirmOpen(false);
  }, [bulkActions]);

  function requestConfirm() {
    if (bulkActions && bulkActions.count > 0) setConfirmOpen(true);
  }

  function closeConfirm() {
    setConfirmOpen(false);
  }

  return (
    <BulkActionsContext.Provider
      value={{ bulkActions, setBulkActions, confirmOpen, requestConfirm, closeConfirm }}
    >
      {children}
    </BulkActionsContext.Provider>
  );
}

export function useBulkActions() {
  const ctx = useContext(BulkActionsContext);
  if (!ctx) {
    throw new Error("useBulkActions harus dipakai di dalam BulkActionsProvider");
  }
  return ctx;
}
