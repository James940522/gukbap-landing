import Image from "next/image";
import { ArrowIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./TerritorySection.module.css";

export function TerritorySection() {
  return (
    <section id="territory" className={`section ${styles.section}`} aria-labelledby="territory-title">
      <div className={styles.backdrop} aria-hidden="true">
        <svg className={styles.boundary} viewBox="0 0 800 760" fill="none">
          <path d="m134 116 126-53 111 27 103-65 112 58 127-17 66 117-31 117 40 119-115 73-15 124-121 67-106-37-104 19-65-100-121-52 30-130-43-111Z" />
          <path d="m210 178 84-35 91 27 96-52 76 43 97-8 43 66-24 95 31 90-81 52-16 100-81 47-79-27-78 15-44-76-87-41 24-90-29-82Z" strokeDasharray="5 12" />
        </svg>
        <div className={styles.bowlRim} />
      </div>
      <div className={`container ${styles.content}`}>
        <div className={styles.heading}>
          <Reveal className={styles.titleBlock}>
            <p className={styles.eyebrow}>TERRITORY PLANNING</p>
            <h2 id="territory-title" className={styles.title}>
              <span className={styles.titleLead}>한 그릇을 제대로.</span>
              <span className={styles.titleLine}><span className={styles.titleAccent}>한 상권도</span> 제대로.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08} className={styles.context}>
            <p className={styles.intro}>
              좋은 맛이 오래 이어지려면,<br />
              매장이 자리할 상권부터.
              <span>뚝손국밥과 함께할 지역의 가능성을<br className={styles.desktopBreak} /> 차근차근 살펴보세요.</span>
            </p>
            <div className={styles.principle}>
              <p className={styles.principleTitle}>1상권 <span>·</span> 1가맹점</p>
              <p className={styles.principleDescription}>한 매장의 운영에 집중하는 구상</p>
            </div>
          </Reveal>
        </div>

        <div className={styles.layout}>
          <Reveal as="figure" duration={0.9} className={styles.visual}>
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
                  sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 899px) calc(100vw - 48px), (max-width: 999px) calc(100vw - 64px), (max-width: 1304px) calc(68vw - 63px), 824px"
                />
              </div>
            </div>
            <figcaption className={styles.caption}>
              상권 이해를 돕기 위한 예시 이미지입니다.<br />
              실제 출점 가능 지역과 영업지역 설정 기준은 가맹 상담 시 확인해 주세요.
            </figcaption>
          </Reveal>

          <Reveal delay={0.08} className={styles.comparison} aria-label="상권 구상 비교">
            <div className={styles.item}>
              <div className={styles.itemLabel}>
                <span className={styles.number} aria-hidden="true">01</span>
                <span className={styles.label}>여러 매장이 함께하는 상권</span>
              </div>
              <h3>하나의 상권,<br />여러 개의 간판.</h3>
              <p>같은 브랜드의 여러 매장이 한 상권 안에 자리하는 경우</p>
            </div>
            <div className={`${styles.item} ${styles.highlight}`}>
              <div className={styles.itemLabel}>
                <span className={styles.number} aria-hidden="true">02</span>
                <span className={styles.label}>뚝손국밥의 상권 구상</span>
              </div>
              <h3>한 상권에,<br /><span>하나의 뚝손.</span></h3>
              <p>한 매장의 운영에 집중하는 1상권 1가맹점 구상</p>
            </div>
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
