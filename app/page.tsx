import AppShell from "@/components/AppShell";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <AppShell>
      <main className="flex-1 pb-4">
        <HomeContent />
      </main>
    </AppShell>
  );
}
