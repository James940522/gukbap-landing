import Image from "next/image";
import { ArrowIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import styles from "./TerritorySection.module.css";

export function TerritorySection() {
  return (
    <section id="territory" className={`section section-background-host ${styles.section}`} aria-labelledby="territory-title">
      <SectionBackground name="territory" />
      <div className={`container ${styles.content}`}>
        <div className={styles.layout}>
          <Reveal className={styles.heading}>
            <h2 id="territory-title" className={styles.title}>
              <span className={styles.titleLead}>한 그릇을 제대로.</span>
              <span className={styles.titleEmphasis}>한 상권도<br />제대로.</span>
            </h2>
            <p className={styles.intro}>
              좋은 맛이 오래 이어지려면,<br />
              매장이 자리할 상권부터.
              <span>뚝손국밥과 함께할 지역의 가능성을<br className={styles.desktopBreak} /> 차근차근 살펴보세요.</span>
            </p>

            <div className={styles.principle}>
              <svg className={styles.territoryMark} viewBox="0 0 88 88" fill="none" aria-hidden="true">
                <circle cx="44" cy="44" r="41" stroke="currentColor" strokeOpacity=".3" />
                <circle cx="44" cy="44" r="31" stroke="currentColor" strokeOpacity=".55" strokeDasharray="3 5" />
                <path d="M44 21c-9 0-16 7-16 16 0 12 16 27 16 27s16-15 16-27c0-9-7-16-16-16Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="m36 35 2-5h12l2 5v5H36v-5Zm2 5v9h12v-9m-6 4v5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              <div>
                <p className={styles.principleTitle}>1상권 <span>·</span> 1가맹점</p>
                <p className={styles.principleDescription}>한 매장의 운영에 집중하는 구상</p>
              </div>
            </div>
          </Reveal>

          <Reveal duration={0.9} delay={0.12} className={styles.visual}>
            <figure>
              <div className={styles.visualFrame}>
                <div className={styles.visualHeader}>
                  <span>한 상권에, 하나의 뚝손.</span>
                  <span className={styles.exampleBadge}>상권 구상 예시</span>
                </div>
                <div className={styles.map}>
                  <Image
                    src="/images/franchise/territory-comparison-ko.png"
                    alt="만안구를 예로 든 상권 비교. 왼쪽은 한 상권에 가·나·다·라 네 매장, 오른쪽은 뚝손국밥 한 매장이 배치된 구상도."
                    width={1448}
                    height={1086}
                    sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 999px) calc(100vw - 64px), (max-width: 1496px) 60vw, 736px"
                  />
                </div>
                <div className={styles.comparison}>
                  <div className={styles.item}>
                    <span className={styles.label}>여러 매장이 함께하는 상권</span>
                    <h3>하나의 상권,<br />여러 개의 간판.</h3>
                    <p>같은 브랜드의 여러 매장이<br />한 상권 안에 자리하는 경우</p>
                  </div>
                  <div className={`${styles.item} ${styles.highlight}`}>
                    <span className={styles.label}>뚝손국밥의 상권 구상</span>
                    <h3>한 상권에,<br /><span>하나의 뚝손.</span></h3>
                    <p>한 매장의 운영에 집중하는<br />1상권 1가맹점 구상</p>
                  </div>
                </div>
              </div>
              <figcaption className={styles.caption}>
                상권 이해를 돕기 위한 예시 이미지입니다.<br />
                실제 출점 가능 지역과 영업지역 설정 기준은 가맹 상담 시 확인해 주세요.
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal effect="fade" className={styles.footer}>
          <p>생각하고 계신 지역이 있으신가요?</p>
          <a href="#inquiry" className={`button button-primary ${styles.inquiryLink}`}>희망 지역 상담하기<ArrowIcon /></a>
        </Reveal>
      </div>
    </section>
  );
}
