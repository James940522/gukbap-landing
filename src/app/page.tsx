import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingInquiry } from "@/components/layout/FloatingInquiry";
import { HeroSection } from "@/components/sections/HeroSection";
import { StrategySection } from "@/components/sections/StrategySection";
import { BrandStorySection } from "@/components/sections/BrandStorySection";
import { NurungjiSection } from "@/components/sections/NurungjiSection";
import { SignatureMenuSection } from "@/components/sections/SignatureMenuSection";
import { FeaturedMenuSection } from "@/components/sections/FeaturedMenuSection";
import { PairingSection } from "@/components/sections/PairingSection";
import { WhyDduksonSection } from "@/components/sections/WhyDduksonSection";
import { FranchiseSection } from "@/components/sections/FranchiseSection";
import { TerritorySection } from "@/components/sections/TerritorySection";
import { InquirySection } from "@/components/sections/InquirySection";
import { StartupBenefitsSection } from "@/components/sections/StartupBenefitsSection";
import { LandscapeSection } from "@/components/sections/LandscapeSection";
import { PartnerSection } from "@/components/sections/PartnerSection";
import { CostRatioSection } from "@/components/sections/CostRatioSection";
import { ProfitStructureSection } from "@/components/sections/ProfitStructureSection";
import { CookingSystemSection } from "@/components/sections/CookingSystemSection";
import { SuccessRoadmapSection } from "@/components/sections/SuccessRoadmapSection";
import { BrandIntro } from "@/components/intro/BrandIntro";

export default function Home() {
  return (
    <div id="top">
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>
      <Header />
      <main id="main">
        <HeroSection />
        <StrategySection />
        <LandscapeSection />
        <BrandStorySection />
        <NurungjiSection />
        <FeaturedMenuSection />
        <SignatureMenuSection />
        <PairingSection />
        <WhyDduksonSection />
        <CookingSystemSection />
        <TerritorySection />
        <CostRatioSection />
        <ProfitStructureSection />
        <SuccessRoadmapSection />
        <FranchiseSection />
        <PartnerSection />
        <StartupBenefitsSection />
        <InquirySection />
      </main>
      <Footer />
      <FloatingInquiry />
      <BrandIntro />
    </div>
  );
}
