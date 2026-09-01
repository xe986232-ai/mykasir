import AppShell from "@/components/AppShell";
import KasirContent from "@/components/KasirContent";

export default function KasirPage() {
  return (
    <AppShell>
      <main className="flex-1 pb-4 pt-4">
        <KasirContent />
      </main>
    </AppShell>
  );
}
