"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type AlertType = "success" | "error" | "info";

export type AlertItem = {
  id: number;
  message: string;
  type: AlertType;
};

type AlertContextValue = {
  alerts: AlertItem[];
  showAlert: (message: string, type?: AlertType) => void;
  dismissAlert: (id: number) => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

let nextAlertId = 1;

// Provider ini CUMA nyimpen state + expose showAlert/dismissAlert lewat
// context — UI toast-nya sendiri dirender terpisah oleh <AlertOverlay />
// (lihat AlertOverlay.tsx), yang sengaja dipasang langsung di dalam Frame
// (AppShell.tsx), SEJAJAR dengan CartBottomBar/BulkActionsBar/SplashScreen.
// Kenapa dipisah gini? Supaya toast-nya render DI LUAR div konten yang
// ber-transform & scrollable, jadi posisinya selalu nempel di atas Frame
// (bukan ikut ke-scroll atau ke-geser pas sidebar dibuka) — pola yang sama
// persis kayak yang dijelasin di komentar AppShell.tsx buat CartBottomBar.
export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const dismissAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = useCallback((message: string, type: AlertType = "info") => {
    const id = nextAlertId++;
    setAlerts((prev) => [...prev, { id, message, type }]);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, showAlert, dismissAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return ctx;
}
