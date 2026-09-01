// Data produk & kategori sekarang datang dari Supabase (lihat
// components/ProductsDataContext.tsx), bukan hardcode lagi. File ini cuma
// nyimpen definisi tipe dan helper murni yang dipakai bareng di seluruh app.

export type CategoryId = string;

export type Category =
  | {
      id: CategoryId;
      label: string;
      type: "image";
      image: string;
    }
  | {
      id: CategoryId;
      label: string;
      type: "icon";
      bg: string;
      Icon: () => React.ReactElement;
    };

export type Product = {
  id: number;
  name: string;
  unit: string;
  price: string; // string tampilan format Rupiah, misal "Rp 15.000"
  delivery?: boolean;
  category: CategoryId;
  Icon?: () => React.ReactElement;
  image?: string;
};

/**
 * Produk di sini disimpan harganya sebagai string tampilan format Rupiah
 * (misal "Rp 15.000", titik sebagai pemisah ribuan). Buat kasir kita butuh
 * angka mentahnya biar bisa dijumlahin — fungsi ini mecah string itu jadi
 * { value, currency }. Kalau formatnya ga kebaca, fallback ke 0 biar ga
 * bikin krash pas hitung total.
 */
export function parsePrice(price: string): { value: number; currency: string } {
  const match = price.match(/^Rp\s*([\d.,]+)/);
  if (!match) return { value: 0, currency: "Rp" };

  // Titik dipakai sebagai pemisah ribuan (bukan desimal) di format Rupiah.
  const value = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  return { value: Number.isFinite(value) ? value : 0, currency: "Rp" };
}

/** Format angka jadi string Rupiah, misal 15000 -> "Rp 15.000". */
export function formatRupiah(value: number): string {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}
