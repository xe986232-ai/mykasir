// Icon dashboard di kode HTML aslinya pakai 4 lingkaran (bukan 4 kotak
// kayak lucide LayoutGrid), jadi di-custom biar sama persis. Dipisah ke
// file sendiri biar bisa dipakai bareng di Sidebar dan tempat lain
// (misal button "View More Categories").
export default function DashboardIcon({
  size = 18,
  strokeWidth = 1.8,
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="6.4" cy="6.4" r="5" />
      <circle cx="17.6" cy="6.4" r="5" />
      <circle cx="6.4" cy="17.6" r="5" />
      <circle cx="17.6" cy="17.6" r="5" />
    </svg>
  );
}
