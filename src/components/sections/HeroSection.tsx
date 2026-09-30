import Image from "next/image";
import { brand, foodImages } from "@/data/site";
import { ArrowIcon, BowlIcon } from "@/components/ui/Icons";
import { MediaFrame } from "@/components/ui/MediaFrame";
import brandLogo from "../../../public/images/logos/ddukson-gukbap.png";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span />
              {brand.hero.eyebrow}
            </p>
            <p className="hero-brand">
              <Image
                src={brandLogo}
                alt="뚝손국밥"
                className="hero-logo"
                sizes="(max-width: 599px) 220px, (max-width: 899px) 240px, 280px"
                priority
              />
              <span>DDUKSON GUKBAP</span>
            </p>
            <h1 id="hero-title" className="display-font">
              {brand.hero.title[0]}
              <br />
              <span>{brand.hero.title[1]}</span>
            </h1>
            <p className="hero-description">{brand.hero.description}</p>
            <p className="hero-detail">{brand.hero.detail}</p>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit" aria-hidden="true" />
            <div className="hero-visual-top">
              <span>THE WARMTH OF A BOWL</span>
              <span>뚝손의 한 그릇</span>
            </div>
            <MediaFrame
              image={foodImages.spoon}
              label="고기와 밥, 파를 담은 따뜻한 국밥 한 숟갈"
              englishLabel="A SPOONFUL OF WARMTH"
              className="hero-media"
              sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1299px) 52vw, 664px"
              priority
            />
            <div className="hero-note">
              <BowlIcon />
              <div>
                <span>뚝손이 담고 싶은 것</span>
                <strong>한 숟갈의 깊이.<br />{" "}한 끼의 든든함.</strong>
              </div>
              <span className="hero-note-index" aria-hidden="true">01</span>
            </div>
          </div>
          <div className="hero-actions">
            <a href="#inquiry" className="button button-primary">
              창업 문의
              <ArrowIcon />
            </a>
            <a href="#brand" className="button button-secondary">
              브랜드 이야기
              <ArrowIcon />
            </a>
          </div>
        </div>
        <div className="hero-foot">
          <div>
            <span><small>DEPTH</small>진한 육수</span>
            <span><small>CARE</small>정직한 손맛</span>
            <span><small>WARMTH</small>든든한 한 끼</span>
          </div>
          <a href="#brand">
            SCROLL TO DISCOVER
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
