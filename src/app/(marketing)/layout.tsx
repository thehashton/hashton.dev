import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full max-w-none">
      <div className="relative z-10 flex min-h-screen w-full flex-col items-stretch">
        <Header />
        <main className="w-full min-w-0 flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
