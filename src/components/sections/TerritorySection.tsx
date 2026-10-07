import Image from "next/image";
import { ArrowIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import styles from "./TerritorySection.module.css";

export function TerritorySection() {
  return (
    <section id="territory" className={`section ${styles.section}`} aria-labelledby="territory-title">
      <div className={`container ${styles.content}`}>
        <Reveal className={styles.heading}>
          <SectionEyebrow>상권 안내</SectionEyebrow>
          <h2 id="territory-title" className="section-title">
            한 그릇을 제대로.<br />
            <span>한 상권도 제대로.</span>
          </h2>
          <p className="body-copy">
            좋은 맛이 오래 이어지려면, 매장이 자리할 상권부터.<br />
            뚝손국밥과 함께할 지역의 가능성을 차근차근 살펴보세요.
          </p>
        </Reveal>

        <div className={styles.layout}>
          <div className={styles.comparison}>
            <Reveal effect="from-left" className={styles.item}>
              <span className={styles.label}>여러 매장이 함께하는 상권</span>
              <h3>하나의 상권, <br />여러 개의 간판.</h3>
              <p>같은 브랜드의 여러 매장이<br />한 상권 안에 자리하는 경우</p>
              <span className={styles.index} aria-hidden="true">01 / 함께하는 상권</span>
            </Reveal>
            <Reveal effect="from-left" delay={0.14} className={`${styles.item} ${styles.highlight}`}>
              <span className={styles.label}>뚝손국밥의 상권 구상</span>
              <h3>한 상권에, <br /><span>하나의 뚝손.</span></h3>
              <p>한 매장의 운영에 집중하는<br />1상권 1가맹점 구상</p>
              <span className={styles.index} aria-hidden="true">02 / 뚝손의 상권</span>
            </Reveal>
          </div>

          <Reveal effect="settle" duration={0.9} delay={0.12} className={styles.visual}>
            <figure>
              <div className={styles.map}>
                <Image
                  src="/images/franchise/territory-comparison-ko.png"
                  alt="만안구를 예로 든 상권 비교. 왼쪽은 한 상권에 가·나·다·라 네 매장, 오른쪽은 뚝손국밥 한 매장이 배치된 구상도."
                  width={1448}
                  height={1086}
                  sizes="(max-width: 899px) calc(100vw - 40px), (max-width: 1304px) 60vw, 756px"
                />
                <div className={styles.mapLabels} aria-hidden="true">
                  <span>한 상권 내 복수 매장</span>
                  <span>1상권 1가맹점 구상</span>
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
          <a href="#inquiry" className="text-link">희망 지역 상담하기<ArrowIcon /></a>
        </Reveal>
      </div>
    </section>
  );
}
