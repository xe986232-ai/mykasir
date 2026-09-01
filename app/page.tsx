import HomeContent from "@/components/HomeContent";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-[#EFF1F0]">
      <div className="flex w-full max-w-[430px] flex-col bg-[#EFF1F0]">
        <main className="flex-1 pb-4 pt-4">
          <HomeContent />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
