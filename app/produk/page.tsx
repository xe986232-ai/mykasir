import SearchHeader from "@/components/SearchHeader";
import FilterChips from "@/components/FilterChips";
import StoreRow from "@/components/StoreRow";
import TopItemsGrid from "@/components/TopItemsGrid";

export default function ProdukPage() {
  return (
    <div className="flex min-h-screen justify-center bg-[#EFF1F0]">
      <div className="flex w-full max-w-[430px] flex-col bg-[#EFF1F0]">
        <main className="flex-1 pb-4 pt-4">
          <SearchHeader />
          <FilterChips />
          <StoreRow />
          <TopItemsGrid />
        </main>
      </div>
    </div>
  );
}
