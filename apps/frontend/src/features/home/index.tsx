import CTASection from "./components/ctaAction";
import FeatureSection from "./components/featureSection";
import HeroSection from "./components/heroSection";
import StatsSection from "./components/statsSection";

export function LandingHomePage() {
  return (
    <main className="min-h-screen bg-[var(--landing-background)] text-[var(--landing-text)]">
      <HeroSection />
      <FeatureSection />
      <StatsSection />
      <CTASection />
    </main>
  );
}
