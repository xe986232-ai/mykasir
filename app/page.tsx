import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import PromoBanner from "@/components/PromoBanner";
import Categories from "@/components/Categories";
import ProductSection from "@/components/ProductSection";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-[#EFF1F0]">
      <div className="flex w-full max-w-[430px] flex-col bg-[#EFF1F0]">
        <main className="flex-1 pb-4 pt-4">
          <Header />
          <SearchBar />
          <PromoBanner />
          <Categories />
          <ProductSection />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
