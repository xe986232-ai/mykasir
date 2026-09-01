import ProdukContent from "@/components/ProdukContent";

type ProdukPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ProdukPage({ searchParams }: ProdukPageProps) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen justify-center bg-[#EFF1F0]">
      <div className="flex w-full max-w-[430px] flex-col bg-[#EFF1F0]">
        <main className="flex-1 pb-4 pt-4">
          <ProdukContent initialCategory={params.category ?? null} />
        </main>
      </div>
    </div>
  );
}
