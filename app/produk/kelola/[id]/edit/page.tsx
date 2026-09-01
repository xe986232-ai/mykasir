import AppShell from "@/components/AppShell";
import EditProdukForm from "@/components/EditProdukForm";

type EditProdukPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProdukPage({ params }: EditProdukPageProps) {
  const { id } = await params;
  const productId = Number(id);

  return (
    <AppShell>
      <main className="flex-1 pb-4 pt-2">
        <EditProdukForm productId={productId} />
      </main>
    </AppShell>
  );
}
