import { MorphingInfinity } from "./MorphingInfinity";

type LoadingScreenProps = {
  /** Teks kecil di bawah icon, opsional. */
  label?: string;
  /** Override tinggi area loading, default nge-fill sisa layar biar center bener. */
  className?: string;
  /** Ukuran icon (tailwind size classes), default h-10 w-10. */
  iconClassName?: string;
};

// Dipakai buat SEMUA state loading full-section/full-page di seluruh app
// (memuat produk, kategori, transaksi, detail produk, dll) supaya
// posisinya konsisten: bener-bener di tengah area kontennya.
export default function LoadingScreen({
  label,
  className = "",
  iconClassName = "h-10 w-10",
}: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center ${className}`}
    >
      <MorphingInfinity className={`${iconClassName} text-primary`} />
      {label && <p className="text-[12px] text-gray">{label}</p>}
    </div>
  );
}
