import { CostRatioChart } from "@/components/ui/CostRatioChart";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import styles from "./CostRatioSection.module.css";

const locationSupport = [
  {
    title: "정밀한 ‘상권 분석’",
    description: ["유동 인구와 소비 계층의", "구조를 모두 고려한"],
  },
  {
    title: "‘매출 가능성’ 검토",
    description: ["주변 경쟁 브랜드 및", "업종 분포를 반영한"],
  },
  {
    title: "최적 입지 도출 및 제안",
    description: ["상권 특성과", "브랜드 적합도를 고려한"],
  },
];

export function CostRatioSection() {
  return (
    <section
      id="cost-ratio"
      className={`section section-light section-background-host ${styles.section}`}
      aria-labelledby="cost-ratio-title"
    >
      <SectionBackground name="cost" />
      <div className="container">
        <Reveal effect="fade" className={styles.masthead}>
          <SectionEyebrow>COST &amp; QUALITY</SectionEyebrow>
          <span>뚝손의 운영 기준</span>
        </Reveal>

        <div className={styles.layout}>
          <div className={styles.comparison}>
            <Reveal>
              <h2 id="cost-ratio-title" className={styles.title}>
                업계 최저 수준의 원가율
              </h2>
            </Reveal>
            <Reveal delay={0.12} className={styles.intro}>
              <p>
                명인이 만든 고품질 물류를<br />
                <strong>최저가로 공급</strong>받는<br className={styles.mobileBreak} /> 이중적 매력을 동반합니다.
              </p>
            </Reveal>
            <CostRatioChart />
          </div>

          <div className={styles.principle}>
            <Reveal as="span" effect="line" className={styles.accent} aria-hidden />
            <Reveal delay={0.12}>
              <h3>타협을 모르는<br />뚝손의 기준</h3>
            </Reveal>
            <Reveal delay={0.22} className={styles.statement}>
              <p>제대로 된 가치의 음식을 만들고<br />제대로 된 가격의 가치를 인정받습니다.</p>
              <p>
                원가율의 무리한 절감을 위해<br />
                <strong>식자재의 품질을 낮추는 일은<br />하지 않습니다.</strong>
              </p>
            </Reveal>
            <Reveal effect="fade" delay={0.36} className={styles.signature}>
              <span aria-hidden="true" />
              QUALITY FIRST
            </Reveal>
          </div>
        </div>

        <div id="location-support" className={styles.locationSupport}>
          <Reveal className={styles.supportHeading}>
            <h3 id="location-support-title">입지 선정도, 꼼꼼하게.</h3>
            <span aria-hidden="true">LOCATION SUPPORT</span>
          </Reveal>
          <ol className={styles.supportList} aria-labelledby="location-support-title">
            {locationSupport.map((item, index) => (
              <li key={item.title}>
                <Reveal delay={index * 0.12} className={styles.supportItem}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p>
                      {item.description[0]}<br />
                      {item.description[1]}
                    </p>
                    <h4>{item.title}</h4>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
