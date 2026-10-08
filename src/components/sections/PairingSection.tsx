import Image from "next/image";
import { pairingFeature } from "@/data/pairing";
import { BowlIcon } from "@/components/ui/Icons";
import { PairingSuggestions } from "@/components/ui/PairingSuggestions";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SectionBackground } from "@/components/ui/SectionBackground";
import styles from "./PairingSection.module.css";

function TableIcon({ kind }: { kind: string }) {
  if (kind === "bowl") return <BowlIcon className={styles.categoryIcon} />;
  return (
    <svg className={styles.categoryIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "mandu" ? (
        <>
          <path d="M12 42c0-15 11-25 20-25s20 10 20 25c-8 7-32 7-40 0Z" />
          <path d="m19 31 6 8m1-19 4 15m7-15-3 15m11-5-7 9M14 43c10-5 26-5 36 0" />
        </>
      ) : (
        <>
          <ellipse cx="32" cy="36" rx="24" ry="12" />
          <ellipse cx="32" cy="35" rx="17" ry="7" />
          <path d="M8 36v5c3 14 45 14 48 0v-5M18 15l28 7M20 10l28 7" />
        </>
      )}
    </svg>
  );
}

export function PairingSection() {
  return (
    <section id="pairing" className={`section section-background-host ${styles.section}`} aria-labelledby="pairing-title">
      <SectionBackground name="pairing" />
      <div className="container">
        <div className={styles.heading}>
          <Reveal>
            <SectionEyebrow>함께 즐기는 한 상</SectionEyebrow>
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
        <Reveal className={styles.categories}>
          <ul aria-label="한 상을 채우는 메뉴">
            {pairingFeature.categories.map((category) => (
              <li key={category.name}>
                <TableIcon kind={category.icon} />
                <div><h3>{category.name}</h3><p>{category.detail}</p></div>
              </li>
            ))}
          </ul>
        </Reveal>
        <p className={styles.footnote}>취향에 맞는 메뉴 선택을 돕기 위한 추천 조합입니다.</p>
      </div>
    </section>
  );
}
