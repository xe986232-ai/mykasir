"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType, NotFoundException } from "@zxing/library";
import { CameraOff, X } from "lucide-react";

const CAMERA_ERROR_MESSAGE =
  "Ga bisa akses kamera. Pastikan izin kamera diaktifkan di browser.";

// Konfigurasi ZXing bawaan (tanpa hints) cukup "pelan" buat barcode retail
// asli — sering gagal kalau agak miring, buram, atau di permukaan
// mengkilap/melengkung kayak kemasan produk. TRY_HARDER nyalain pass
// tambahan yang lebih toleran (lebih berat dikit secara CPU, tapi masih
// lancar buat scan sesekali kayak gini). POSSIBLE_FORMATS dibatasin ke
// format yang relevan buat kasir (barcode retail + QR) biar decoder ga
// buang waktu nyoba format yang ga bakal kepake (Aztec, PDF417, dll).
const scanHints = new Map<DecodeHintType, unknown>();
scanHints.set(DecodeHintType.TRY_HARDER, true);
scanHints.set(DecodeHintType.POSSIBLE_FORMATS, [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODABAR,
  BarcodeFormat.ITF,
  BarcodeFormat.QR_CODE,
]);

/**
 * Nyalain kamera & scan barcode terus-menerus sampe ketemu satu kode.
 * Sengaja dipisah jadi komponen sendiri (bukan nyatu di BarcodeScannerModal)
 * biar tiap kali modal dibuka ulang, React remount komponen ini dari nol
 * (lewat `key` di pemanggil) — jadi state error/deteksi otomatis balik ke
 * awal tanpa perlu reset manual lewat setState di dalam effect.
 */
function ScannerView({ onDetected }: { onDetected: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let controls: Awaited<ReturnType<BrowserMultiFormatReader["decodeFromConstraints"]>> | null =
      null;
    const reader = new BrowserMultiFormatReader(scanHints);

    // Minta resolusi tinggi (bukan cuma facingMode kayak decodeFromVideoDevice
    // bawaan) — kamera default browser sering milih resolusi rendah yang
    // bikin barcode kecil/rapat susah kebaca. "ideal" = permintaan, bukan
    // syarat mutlak, jadi tetep jalan di device yang kameranya lebih rendah.
    reader
      .decodeFromConstraints(
        {
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        },
        videoRef.current ?? undefined,
        (result, err) => {
          if (cancelled || detectedRef.current) return;
          if (result) {
            detectedRef.current = true;
            onDetected(result.getText());
            return;
          }
          // NotFoundException dilempar terus-terusan tiap frame yang ga ada
          // barcode-nya — itu normal, bukan error beneran. Error lain (misal
          // izin kamera ditolak) baru kita tampilin ke user.
          if (err && !(err instanceof NotFoundException)) {
            setError(CAMERA_ERROR_MESSAGE);
          }
        }
      )
      .then((c) => {
        if (cancelled) {
          c.stop();
          return;
        }
        controls = c;
      })
      .catch(() => {
        if (!cancelled) setError(CAMERA_ERROR_MESSAGE);
      });

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [onDetected]);

  return (
    <>
      <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />

      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 px-8 text-center">
          <CameraOff size={28} className="text-white/70" />
          <p className="text-[12.5px] text-white/80">{error}</p>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[38%] w-[78%] rounded-2xl border-2 border-white/80" />
        </div>
      )}
    </>
  );
}

type BarcodeScannerModalProps = {
  open: boolean;
  onClose: () => void;
  /** Dipanggil sekali begitu satu kode berhasil ke-scan. Modal ga otomatis
   *  nutup diri sendiri — biar pemanggil yang nentuin (misal: nutup lalu
   *  nambahin ke keranjang, atau nutup sambil ngisi field form). */
  onDetected: (code: string) => void;
  title?: string;
  helperText?: string;
};

/**
 * Modal full-screen buat scan barcode pakai kamera device, pakai ZXing
 * (mendukung banyak browser, ga bergantung ke BarcodeDetector native yang
 * cuma jalan di Chromium). Dirender lewat portal ke document.body karena
 * halaman ini dibungkus wrapper ber-`transform` (lihat AppShell) yang bikin
 * `position: fixed` biasa keanggep relatif ke wrapper itu, bukan viewport.
 */
export default function BarcodeScannerModal({
  open,
  onClose,
  onDetected,
  title = "Scan Barcode",
  helperText = "Arahkan kamera ke barcode produk",
}: BarcodeScannerModalProps) {
  // Pola "adjust state saat render" dari dokumentasi React: nambahin
  // sessionKey pas `open` baru aja jadi true, dipakai buat `key` di
  // <ScannerView> biar tiap sesi scan dapet instance & state yang bener-bener
  // baru — tanpa perlu setState di dalam useEffect buat reset-nya.
  const [wasOpen, setWasOpen] = useState(open);
  const [sessionKey, setSessionKey] = useState(0);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSessionKey((k) => k + 1);
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black"
        >
          <div className="flex items-center justify-between px-5 pb-3 pt-[calc(env(safe-area-inset-top)+16px)]">
            <div>
              <h2 className="text-[14px] font-bold text-white">{title}</h2>
              <p className="text-[11.5px] text-white/60">{helperText}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup scanner"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white active:scale-95 transition-transform"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative mx-5 mb-8 flex-1 overflow-hidden rounded-3xl bg-black">
            <ScannerView key={sessionKey} onDetected={onDetected} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
