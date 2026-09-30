import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandStorySection } from "@/components/sections/BrandStorySection";
import { SignatureMenuSection } from "@/components/sections/SignatureMenuSection";
import { WhyDduksonSection } from "@/components/sections/WhyDduksonSection";
import { FranchiseSection } from "@/components/sections/FranchiseSection";
import { InquirySection } from "@/components/sections/InquirySection";

export default function Home() {
  return (
    <div id="top">
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>
      <Header />
      <main id="main">
        <HeroSection />
        <BrandStorySection />
        <SignatureMenuSection />
        <WhyDduksonSection />
        <FranchiseSection />
        <InquirySection />
      </main>
      <Footer />
    </div>
  );
}
