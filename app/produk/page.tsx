import AppShell from "@/components/AppShell";
import ProdukContent from "@/components/ProdukContent";

type ProdukPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ProdukPage({ searchParams }: ProdukPageProps) {
  const params = await searchParams;

  return (
    <AppShell>
      <main className="flex-1 pb-4 pt-4">
        <ProdukContent initialCategory={params.category ?? null} />
      </main>
    </AppShell>
  );
}
