import { ArrowIcon } from "@/components/ui/Icons";
import { CookingWheel } from "@/components/ui/CookingWheel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { cooking } from "@/data/cooking";
import styles from "./CookingSystemSection.module.css";

export function CookingSystemSection() {
  return (
    <section
      id="cooking-system"
      className={`section section-background-host ${styles.section}`}
      aria-labelledby="cooking-system-title"
    >
      <SectionBackground name="cooking" />
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <Reveal effect="fade"><SectionEyebrow>{cooking.eyebrow}</SectionEyebrow></Reveal>
          <h2 id="cooking-system-title" className={`display-font ${styles.title}`}>
            <Reveal as="span">{cooking.title}</Reveal>{" "}
            <Reveal as="span" delay={0.12} className={styles.highlight}>{cooking.highlight}</Reveal>
          </h2>
          <Reveal as="p" delay={0.2} className={styles.lead}>{cooking.lead}</Reveal>
          <Reveal as="p" effect="fade" delay={0.3} className={styles.description}>
            {cooking.description.map((line) => <span key={line}>{line}</span>)}
          </Reveal>
        </div>
        <CookingWheel />
        <Reveal effect="fade" className={styles.action}>
          <a href="#inquiry" className="text-link">조리·운영 상담하기<ArrowIcon /></a>
        </Reveal>
      </div>
    </section>
  );
}
