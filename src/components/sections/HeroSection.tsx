import Image from "next/image";
import { brand, foodImages } from "@/data/site";
import { ArrowIcon, BowlIcon } from "@/components/ui/Icons";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import brandLogo from "../../../public/images/logos/ddukson-gukbap.png";

export function HeroSection() {
  return (
    <section className="hero section-background-host" aria-labelledby="hero-title">
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
            <Reveal as="p" delay={0.12} className="hero-slogan display-font">{brand.hero.slogan}</Reveal>
            <Reveal as="h1" delay={0.2} duration={0.85} id="hero-title" className="display-font">
              <span>{brand.hero.title}</span>
            </Reveal>
            <Reveal as="p" delay={0.28} className="hero-description display-font">{brand.hero.description}</Reveal>
            <Reveal as="p" effect="fade" delay={0.34} className="hero-detail display-font">{brand.hero.detail}</Reveal>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit" aria-hidden="true" />
            <Reveal effect="fade" className="hero-visual-top">
              <span>THE WARMTH OF A BOWL</span>
              <span>뚝손의 한 그릇</span>
            </Reveal>
            <Reveal effect="settle" duration={0.9}>
              <MediaFrame
                image={foodImages.spoon}
                label="고기와 밥, 파를 담은 따뜻한 국밥 한 숟갈"
                englishLabel="A SPOONFUL OF WARMTH"
                className="hero-media"
                sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1299px) 52vw, 664px"
                priority
              />
            </Reveal>
            <Reveal delay={0.3} className="hero-note">
              <BowlIcon />
              <div>
                <span>뚝손이 담고 싶은 것</span>
                <strong>한 숟갈의 깊이.<br />{" "}한 끼의 든든함.</strong>
              </div>
              <span className="hero-note-index" aria-hidden="true">01</span>
            </Reveal>
          </div>
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
