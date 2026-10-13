import { CostRatioChart } from "@/components/ui/CostRatioChart";
import { SectionBackground } from "@/components/ui/SectionBackground";
import styles from "./CostRatioSection.module.css";

export function CostRatioSection() {
  return (
    <section
      id="cost-ratio"
      className={`section section-light section-background-host ${styles.section}`}
      aria-labelledby="cost-ratio-title"
    >
      <SectionBackground name="cost" />
      <div className="container">
        <h2 id="cost-ratio-title" className="sr-only">
          업계 최저 수준의 원가율
        </h2>
        <CostRatioChart />
      </div>
    </section>
  );
}
