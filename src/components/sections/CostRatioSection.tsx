import { CostRatioChart } from "@/components/ui/CostRatioChart";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import styles from "./CostRatioSection.module.css";

export function CostRatioSection() {
  return (
    <section
      id="cost-ratio"
      className={`section section-light section-background-host ${styles.section}`}
      aria-labelledby="cost-ratio-title"
      aria-describedby="cost-ratio-description"
    >
      <SectionBackground name="cost" />
      <div className={`container ${styles.content}`}>
        <div className={styles.composition}>
          <Reveal className={styles.heading}>
            <p className={styles.kicker}>품질을 먼저 생각합니다</p>
            <h2 id="cost-ratio-title" className={styles.title}>
              업계 최저 수준의 <span>원가율</span>
            </h2>
            <p id="cost-ratio-description" className={styles.description}>
              명인이 만든 고품질 물류를<br />
              <strong>최저가로 공급</strong>받습니다.
            </p>
          </Reveal>
          <div className={styles.comparison}>
            <div className={styles.chartHeading}>
              <h3>원가율 비교</h3>
              <span>뚝손국밥 · 업계 평균</span>
            </div>
            <div className={styles.chartBody}>
              <CostRatioChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
