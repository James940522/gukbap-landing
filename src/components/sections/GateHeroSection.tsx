import { brand } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import { GateHeroScene } from "@/components/ui/GateHeroScene";
import styles from "./GateHeroSection.module.css";

export function GateHeroSection() {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">{brand.name}</h1>
      <GateHeroScene
        actions={(
          <>
            <a href="#inquiry" className="button button-primary">창업 문의<ArrowIcon /></a>
            <a href="#brand" className="button button-secondary">브랜드 이야기<ArrowIcon /></a>
          </>
        )}
      />
    </section>
  );
}
