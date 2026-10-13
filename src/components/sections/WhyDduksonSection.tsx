import { BrothComposition } from "@/components/ui/BrothComposition";
import { SectionBackground } from "@/components/ui/SectionBackground";
import styles from "./WhyDduksonSection.module.css";

export function WhyDduksonSection() {
  return (
    <section id="standard" className={`section section-background-host ${styles.section}`} aria-labelledby="standards-title">
      <SectionBackground name="standards" />
      <div className="container">
        <BrothComposition />
      </div>
    </section>
  );
}
