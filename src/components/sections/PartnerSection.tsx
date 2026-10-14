import Image from "next/image";
import { ArrowIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { partnerQualities, partnerVisual } from "@/data/partners";
import styles from "./PartnerSection.module.css";

export function PartnerSection() {
  return (
    <section
      id="partners"
      className={`section section-light section-background-host ${styles.section}`}
      aria-labelledby="partners-title"
    >
      <SectionBackground name="partners" className={styles.paper} />
      <div className={`container ${styles.content}`}>
        <div className={styles.invitation}>
          <Reveal duration={0.7}>
            <p className={styles.eyebrow}>OUR PARTNERS</p>
            <h2 id="partners-title" className={`section-title ${styles.title}`}>
              이런 점주님과<br />
              <span>함께하고 싶습니다.</span>
            </h2>
            <p className={styles.intro}>
              같은 마음으로,<br />오래 함께할 인연을 기다립니다.
            </p>
          </Reveal>
          <Reveal effect="fade" delay={0.1} duration={0.75} className={styles.photoFrame}>
            <Image
              src={partnerVisual.src}
              alt={partnerVisual.alt}
              fill
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1303px) calc((100vw - 128px) * 0.4), 470px"
              className={styles.photo}
            />
          </Reveal>
        </div>

        <div className={styles.qualities}>
          <ol className={styles.list} aria-label="뚝손국밥과 함께할 점주님의 다섯 가지 마음">
            {partnerQualities.map((quality, index) => (
              <li key={quality.id}>
                <Reveal delay={index * 0.06} duration={0.7} className={styles.item}>
                  <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{quality.title}</h3>
                    <p className={styles.description}>{quality.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal as="p" effect="fade" duration={0.7} className={styles.signature}>
            좋은 한 그릇, 좋은 동행.
          </Reveal>
        </div>

        <Reveal effect="fade" duration={0.7} className={styles.contact}>
          <a href="#inquiry" className={`button button-primary ${styles.link}`}>
            창업 문의하기<ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
