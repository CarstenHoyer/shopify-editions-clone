import Hero from '@/components/sections/Hero';
import SidekickSection from '@/components/sections/SidekickSection';
import AgenticSection from '@/components/sections/AgenticSection';
import OnlineSection from '@/components/sections/OnlineSection';
import RetailSection from '@/components/sections/RetailSection';
import MarketingSection from '@/components/sections/MarketingSection';
import CheckoutSection from '@/components/sections/CheckoutSection';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background">
      <Hero />
      <SidekickSection />
      <AgenticSection />
      <OnlineSection />
      <RetailSection />
      <MarketingSection />
      <CheckoutSection />
    </main>
  );
}
