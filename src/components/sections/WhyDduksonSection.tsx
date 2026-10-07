import Image from "next/image";
import { brothFeature } from "@/data/site";
import { BowlIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SectionBackground } from "@/components/ui/SectionBackground";
import styles from "./WhyDduksonSection.module.css";

export function WhyDduksonSection() {
  return (
    <section id="standard" className={`section section-background-host ${styles.section}`} aria-labelledby="standards-title">
      <SectionBackground name="standards" />
      <div className="container">
        <Reveal effect="fade" className={styles.heading}>
          <SectionEyebrow number="05">뚝손의 기준</SectionEyebrow>
          <p className={styles.kicker}>한 그릇을 완성하는 두 가지</p>
        </Reveal>
        <div className={styles.composition}>
          <Reveal delay={0.1} className={styles.message}>
            <span className={styles.seal} aria-hidden="true">뚝손의 기준</span>
            <p className={styles.description}>
              <span>{brothFeature.description[0]}</span>
              <span>{brothFeature.description[1]}</span>
            </p>
            <h2 id="standards-title" className={`display-font ${styles.title}`}>
              <span>{brothFeature.title[0]}</span>
              <span>{brothFeature.title[1]}</span>
              <span className={styles.emphasis}>{brothFeature.title[2]}</span>
            </h2>
            <span className={styles.rule} aria-hidden="true" />
          </Reveal>
          {brothFeature.elements.map((element, index) => (
            <Reveal as="figure" effect={index === 0 ? "from-left" : "from-right"} duration={0.9} delay={index * 0.12} key={element.id} className={`${styles.element} ${index === 0 ? styles.broth : styles.ingredients}`}>
              <div className={styles.imageFrame}>
                {element.image ? (
                  <Image src={element.image} alt={element.alt} fill sizes="(max-width: 599px) 42vw, (max-width: 999px) 32vw, 320px" />
                ) : (
                  <div className={styles.placeholder}>
                    <BowlIcon />
                    <span>{element.placeholder}</span>
                    <span className={styles.photoNote}>사진 준비 중</span>
                  </div>
                )}
              </div>
              <figcaption className={styles.caption}>
                <span className={styles.captionLabel}>{element.caption}</span>
                <h3>{element.label}</h3>
              </figcaption>
            </Reveal>
          ))}
          <Reveal as="span" effect="fade" delay={0.3} className={styles.multiply} aria-hidden>×</Reveal>
        </div>
        <Reveal effect="fade" delay={0.2} className={styles.signature} aria-hidden><span>뚝손국밥</span></Reveal>
      </div>
    </section>
  );
}
