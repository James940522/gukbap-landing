import Image from "next/image";
import { pairingFeature } from "@/data/pairing";
import { PairingSuggestions } from "@/components/ui/PairingSuggestions";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import styles from "./PairingSection.module.css";

export function PairingSection() {
  return (
    <section id="pairing" className={`section section-background-host ${styles.section}`} aria-labelledby="pairing-title">
      <SectionBackground name="pairing" />
      <div className="container">
        <div className={styles.heading}>
          <Reveal>
            <h2 id="pairing-title" className="section-title">한 그릇에서,<br />한 상으로.</h2>
          </Reveal>
          <Reveal effect="fade" delay={0.15} className={styles.intro}>
            <p className="body-copy">
              {pairingFeature.description.map((line) => <span key={line}>{line}</span>)}
            </p>
            <p className={styles.tableNote}><span aria-hidden="true" />한 그릇의 든든함에, 함께 먹는 즐거움을 더하다.</p>
          </Reveal>
        </div>
        <div className={styles.table}>
          <Reveal effect="fade" duration={0.9} className={styles.visual}>
            <figure className={styles.assortment}>
              <div className={styles.assortmentImage}>
                <Image src={pairingFeature.image} alt={pairingFeature.imageAlt} fill sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 899px) calc(100vw - 64px), (max-width: 1299px) 56vw, 720px" />
                <div className={styles.imageTag} aria-hidden="true"><span>뚝손의</span><strong>한 상</strong></div>
              </div>
              <figcaption className={styles.caption}>
                <span>뚝손의 맛을, 한자리에.</span>
                <span>DDUKSON TABLE</span>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal effect="rise" delay={0.12} className={styles.suggestionPanel}><PairingSuggestions /></Reveal>
        </div>
        <p className={styles.footnote}>취향에 맞는 메뉴 선택을 돕기 위한 추천 조합입니다.</p>
      </div>
    </section>
  );
}
