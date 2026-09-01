import AppShell from "@/components/AppShell";
import EditKategoriForm from "@/components/EditKategoriForm";

type EditKategoriPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditKategoriPage({ params }: EditKategoriPageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <main className="flex-1 pb-4 pt-2">
        <EditKategoriForm categoryId={id} />
      </main>
    </AppShell>
  );
}
