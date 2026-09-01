import AppShell from "@/components/AppShell";
import PengaturanContent from "@/components/PengaturanContent";

export default function PengaturanPage() {
  return (
    <AppShell>
      <main className="flex-1 pb-4 pt-4">
        <PengaturanContent />
      </main>
    </AppShell>
  );
}
