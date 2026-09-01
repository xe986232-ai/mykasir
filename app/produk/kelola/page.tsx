import AppShell from "@/components/AppShell";
import KelolaProdukContent from "@/components/KelolaProdukContent";

export default function KelolaProdukPage() {
  return (
    <AppShell>
      <main className="flex-1 pb-4 pt-4">
        <KelolaProdukContent />
      </main>
    </AppShell>
  );
}
