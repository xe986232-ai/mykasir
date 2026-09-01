import AppShell from "@/components/AppShell";
import TambahKategoriForm from "@/components/TambahKategoriForm";

export default function TambahKategoriPage() {
  return (
    <AppShell>
      <main className="flex-1 pb-4 pt-2">
        <TambahKategoriForm />
      </main>
    </AppShell>
  );
}
