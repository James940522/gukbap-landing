import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandStorySection } from "@/components/sections/BrandStorySection";
import { NurungjiSection } from "@/components/sections/NurungjiSection";
import { SignatureMenuSection } from "@/components/sections/SignatureMenuSection";
import { PairingSection } from "@/components/sections/PairingSection";
import { WhyDduksonSection } from "@/components/sections/WhyDduksonSection";
import { FranchiseSection } from "@/components/sections/FranchiseSection";
import { TerritorySection } from "@/components/sections/TerritorySection";
import { InquirySection } from "@/components/sections/InquirySection";
import { StartupBenefitsSection } from "@/components/sections/StartupBenefitsSection";
import { LandscapeSection } from "@/components/sections/LandscapeSection";
import { PartnerSection } from "@/components/sections/PartnerSection";
import { CostRatioSection } from "@/components/sections/CostRatioSection";

export default function Home() {
  return (
    <div id="top">
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>
      <Header />
      <main id="main">
        <HeroSection />
        <LandscapeSection />
        <BrandStorySection />
        <NurungjiSection />
        <SignatureMenuSection />
        <PairingSection />
        <WhyDduksonSection />
        <TerritorySection />
        <CostRatioSection />
        <FranchiseSection />
        <PartnerSection />
        <StartupBenefitsSection />
        <InquirySection />
      </main>
      <Footer />
    </div>
  );
}
