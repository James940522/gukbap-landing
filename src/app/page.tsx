import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingInquiry } from "@/components/layout/FloatingInquiry";
import { HeroSection } from "@/components/sections/HeroSection";
import { StrategySection } from "@/components/sections/StrategySection";
import { NurungjiSection } from "@/components/sections/NurungjiSection";
import { SignatureMenuSection } from "@/components/sections/SignatureMenuSection";
import { FeaturedMenuSection } from "@/components/sections/FeaturedMenuSection";
import { MenuOrbitSection } from "@/components/sections/MenuOrbitSection/MenuOrbitSection";
import { PairingSection } from "@/components/sections/PairingSection";
import { WhyDduksonSection } from "@/components/sections/WhyDduksonSection";
import { TerritorySection } from "@/components/sections/TerritorySection";
import { InquirySection } from "@/components/sections/InquirySection";
import { StoreDirectorySection } from "@/components/sections/StoreDirectorySection";
import { StartupBenefitsSection } from "@/components/sections/StartupBenefitsSection";
import { FranchiseProcessSection } from "@/components/sections/FranchiseProcessSection";
import { LandscapeSection } from "@/components/sections/LandscapeSection";
import { PartnerSection } from "@/components/sections/PartnerSection";
import { CostRatioSection } from "@/components/sections/CostRatioSection";
import { ProfitStructureSection } from "@/components/sections/ProfitStructureSection";
import { CookingSystemSection } from "@/components/sections/CookingSystemSection";
import { SuccessRoadmapSection } from "@/components/sections/SuccessRoadmapSection";
// 기존 코드 인트로는 보관하고 영상 인트로를 사용합니다.
// import { BrandIntro } from "@/components/intro/BrandIntro";
import { VideoIntro } from "@/components/intro/VideoIntro";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

export const metadata = createPageMetadata({ path: "/", title: SITE_TITLE, description: SITE_DESCRIPTION });

export default function Home() {
  return (
    <div id="top">
      <StructuredData title={SITE_TITLE} description={SITE_DESCRIPTION} />
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>
      <Header />
      <main id="main">
        <HeroSection />
        <StrategySection />
        <LandscapeSection />
        <NurungjiSection />
        <MenuOrbitSection />
        <FeaturedMenuSection />
        <SignatureMenuSection />
        <PairingSection />
        <WhyDduksonSection />
        <CookingSystemSection />
        <TerritorySection />
        <CostRatioSection />
        <ProfitStructureSection />
        <SuccessRoadmapSection />
        <PartnerSection />
        <StartupBenefitsSection />
        <FranchiseProcessSection />
        <StoreDirectorySection />
        <InquirySection />
      </main>
      <Footer />
      <FloatingInquiry />
      {/* <BrandIntro /> */}
      <VideoIntro />
    </div>
  );
}
