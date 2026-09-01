import AppShell from "@/components/AppShell";
import TambahProdukForm from "@/components/TambahProdukForm";

export default function TambahProdukPage() {
  return (
    <AppShell>
      <main className="flex-1 pb-4 pt-2">
        <TambahProdukForm />
      </main>
    </AppShell>
  );
}
