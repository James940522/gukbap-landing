import Image from "next/image";
import { brand } from "@/data/site";
import { heroSlides } from "@/data/heroSlides";
import { ArrowIcon } from "@/components/ui/Icons";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import brandLogo from "../../../public/images/logos/ddukson-gukbap.png";

export function HeroSection() {
  return (
    <section id="hero" className="hero section-background-host" aria-labelledby="hero-title">
      <SectionBackground name="hero" />
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <Reveal as="p" effect="fade" className="hero-eyebrow">
              <span />
              {brand.hero.eyebrow}
            </Reveal>
            <Reveal as="p" effect="fade" delay={0.06} className="hero-brand">
              <Image
                src={brandLogo}
                alt="뚝손국밥"
                className="hero-logo"
                sizes="(max-width: 599px) 220px, (max-width: 899px) 240px, 280px"
                priority
              />
              <span>DDUKSON GUKBAP</span>
            </Reveal>
            <Reveal as="h1" delay={0.2} duration={0.85} id="hero-title" className="display-font">
              {brand.hero.title.map((line) => <span key={line}>{line}</span>)}
            </Reveal>
            <Reveal as="p" delay={0.28} className="hero-description display-font">{brand.hero.description}</Reveal>
            <Reveal as="p" effect="fade" delay={0.34} className="hero-detail display-font">{brand.hero.detail}</Reveal>
          </div>
          <HeroCarousel slides={heroSlides} />
          <Reveal effect="fade" delay={0.36} className="hero-actions">
            <a href="#inquiry" className="button button-primary">
              창업 문의
              <ArrowIcon />
            </a>
            <a href="#brand" className="button button-secondary">
              브랜드 이야기
              <ArrowIcon />
            </a>
          </Reveal>
        </div>
        <Reveal effect="fade" delay={0.16} className="hero-foot">
          <div>
            <span><small>DEPTH</small>진한 육수</span>
            <span><small>CARE</small>정직한 손맛</span>
            <span><small>WARMTH</small>든든한 한 끼</span>
          </div>
          <a href="#brand">
            SCROLL TO DISCOVER
            <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
