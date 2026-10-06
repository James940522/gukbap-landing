import Image from "next/image";
import { brand } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import { GateHeroScene } from "@/components/ui/GateHeroScene";
import { BrandNoticePopup } from "@/components/ui/BrandNoticePopup";
import brandLogo from "../../../public/images/logos/ddukson-gukbap.png";
import styles from "./GateHeroSection.module.css";

export function GateHeroSection() {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-title">
      <GateHeroScene
        afterIntro={<BrandNoticePopup />}
        actions={(
          <>
            <a href="#inquiry" className="button button-primary">창업 문의<ArrowIcon /></a>
            <a href="#brand" className="button button-secondary">브랜드 이야기<ArrowIcon /></a>
          </>
        )}
      >
        <p className={styles.eyebrow}>{brand.englishName}</p>
        <h1 id="hero-title" className={styles.title}>
          <Image src={brandLogo} alt={brand.name} className={styles.logo} sizes="(max-width: 599px) 226px, 300px" priority />
        </h1>
        <p className={`${styles.tagline} display-font`}>{brand.hero.title.join(" ")}</p>
      </GateHeroScene>
    </section>
  );
}
