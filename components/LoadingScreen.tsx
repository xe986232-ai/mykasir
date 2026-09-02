import { MorphingInfinity } from "./MorphingInfinity";

type LoadingScreenProps = {
  /** Teks kecil di bawah icon, opsional. */
  label?: string;
  /** Ukuran icon (tailwind size classes), default gede: h-16 w-16. */
  iconClassName?: string;
};

// Loading tunggal buat seluruh app: nempel "fixed" tapi karena kena trik
// containing-block dari AppShell (parent-nya punya `transform`), posisinya
// jadi relatif ke frame app, BUKAN ke viewport browser — jadi tetep bener
// di tengah-tengah (titik 0,0 dari frame, horizontal & vertikal) dan ga
// ikut kegeser pas discroll. Cuma satu titik ini yang boleh dipakein
// loading per halaman, biar ga dobel sama komponen lain yang mantau
// `loading` flag yang sama.
export default function LoadingScreen({
  label,
  iconClassName = "h-16 w-16",
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-page text-center">
      <MorphingInfinity className={`${iconClassName} text-[#ea4c89]`} />
      {label && <p className="text-[13px] text-gray">{label}</p>}
    </div>
  );
}
