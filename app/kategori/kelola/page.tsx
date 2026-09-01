import AppShell from "@/components/AppShell";
import KelolaKategoriContent from "@/components/KelolaKategoriContent";

export default function KelolaKategoriPage() {
  return (
    <AppShell>
      <main className="flex-1 pb-4 pt-4">
        <KelolaKategoriContent />
      </main>
    </AppShell>
  );
}
