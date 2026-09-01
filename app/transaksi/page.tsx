import AppShell from "@/components/AppShell";
import TransaksiContent from "@/components/TransaksiContent";

export default function TransaksiPage() {
  return (
    <AppShell>
      <main className="flex-1 pb-4 pt-4">
        <TransaksiContent />
      </main>
    </AppShell>
  );
}
