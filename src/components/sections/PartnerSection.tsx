import type { ReactNode } from "react";
import { ArrowIcon, BowlIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { partnerQualities, type PartnerQualityId } from "@/data/partners";
import styles from "./PartnerSection.module.css";

function PartnerIcon({ kind }: { kind: PartnerQualityId }) {
  const paths: Record<PartnerQualityId, ReactNode> = {
    purpose: <>
      <circle cx="23" cy="25" r="15" />
      <circle cx="23" cy="25" r="8" />
      <path d="m23 25 17-17M32 8h8v8" />
    </>,
    service: <>
      <path d="M8 32h32M12 29a12 12 0 0 1 24 0M24 17v-4M21 13h6M10 37h9l5 4 11-6M10 37v5" />
      <path d="M35 10h6M38 7v6" />
    </>,
    trust: <>
      <path d="m6 22 18-15 18 15M11 18v23h26V18" />
      <path d="M24 26c-6-6-12 2 0 9 12-7 6-15 0-9Z" />
    </>,
    warmth: <>
      <circle cx="24" cy="25" r="15" />
      <path d="M17 23v1M31 23v1M17 30c3 5 11 5 14 0M24 4v2M7 9l3 3M41 9l-3 3" />
    </>,
    principle: <>
      <path d="M24 13c-5-4-11-5-17-4v29c6-1 12 0 17 4 5-4 11-5 17-4V9c-6-1-12 0-17 4Zm0 0v29" />
      <path d="m28 24 4 4 6-8M12 18l7 2M12 25l7 2" />
    </>,
  };

  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  );
}

export function PartnerSection() {
  return (
    <section
      id="partners"
      className={`section section-light section-background-host ${styles.section}`}
      aria-labelledby="partners-title"
    >
      <SectionBackground name="partners" />
      <div className={styles.backgroundRings} aria-hidden="true" />
      <div className={`container ${styles.content}`}>
        <Reveal effect="fade" className={styles.masthead}>
          <span>뚝손국밥</span>
          <span>사람과 사람, 한 그릇으로 잇다.</span>
        </Reveal>

        <div className={styles.heading}>
          <Reveal effect="fade" className={styles.eyebrow}>
            <span aria-hidden="true" />
            함께할 점주님
            <span aria-hidden="true" />
          </Reveal>
          <Reveal as="h2" id="partners-title" delay={0.08} className={`section-title ${styles.title}`}>
            이런 점주님과<br />
            <span>함께하고 싶습니다.</span>
          </Reveal>
          <Reveal as="p" effect="fade" delay={0.18} className={styles.intro}>
            같은 마음으로, 오래 함께할 인연을 기다립니다.
          </Reveal>
        </div>

        <div className={styles.qualities}>
          <Reveal effect="line" duration={0.9} className={styles.connectingLine} aria-hidden />
          <ol className={styles.list} aria-label="뚝손국밥과 함께할 점주님의 다섯 가지 마음">
            {partnerQualities.map((quality, index) => (
              <li key={quality.id}>
                <Reveal delay={index * 0.09} duration={0.8} className={styles.item}>
                  <span className={styles.marker} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.icon}><PartnerIcon kind={quality.id} /></div>
                  <span className={styles.keyword}>{quality.keyword}</span>
                  <h3>{quality.title}</h3>
                  <p className={styles.description}>
                    {quality.description.map((line) => <span key={line}>{line}</span>)}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal effect="fade" className={styles.footer}>
          <div className={styles.signature}>
            <BowlIcon />
            <p>좋은 한 그릇, <strong>좋은 동행.</strong></p>
          </div>
          <a href="#inquiry" className={`text-link ${styles.link}`}>
            뚝손과 함께 이야기 나누기<ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
