import { ArrowIcon, BowlIcon } from "@/components/ui/Icons";
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
          <Reveal effect="fade">
            <SectionEyebrow>{cooking.eyebrow}</SectionEyebrow>
            <p className={styles.lead}>{cooking.lead}</p>
          </Reveal>
          <h2 id="cooking-system-title" className={`display-font ${styles.title}`}>
            <Reveal as="span" delay={0.08}>{cooking.title}</Reveal>
            <Reveal as="span" delay={0.2} className={styles.highlight}>
              {cooking.highlight}
            </Reveal>
          </h2>
          <Reveal as="p" effect="fade" delay={0.3} className={styles.description}>
            {cooking.description.map((line) => <span key={line}>{line}</span>)}
          </Reveal>

          <ul className={styles.principles} aria-label="뚝손의 조리 기준">
            {cooking.principles.map((principle, index) => (
              <li key={principle.emphasis}>
                <Reveal delay={0.12 + index * 0.12} effect="from-left">
                  <span className={styles.dot} aria-hidden="true" />
                  <p><strong>{principle.emphasis}</strong>{principle.detail}</p>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal effect="fade" delay={0.35} className={styles.action}>
            <a href="#inquiry" className="text-link">
              조리·운영 상담하기<ArrowIcon />
            </a>
          </Reveal>
        </div>

        <div className={styles.process}>
          <Reveal effect="fade" className={styles.processHeading}>
            <BowlIcon />
            <p id="cooking-steps-title">한 그릇으로 이어지는 세 단계</p>
          </Reveal>
          <ol className={styles.steps} aria-labelledby="cooking-steps-title">
            {cooking.steps.map((step, index) => (
              <li key={step.number} className={styles.step}>
                <Reveal
                  as="article"
                  effect="settle"
                  duration={0.9}
                  delay={index * 0.14}
                  className={styles.circle}
                >
                  <span className={styles.stepNumber}>STEP {step.number}</span>
                  <span className={styles.stepLabel}>{step.label}</span>
                  <h3>{step.title}</h3>
                  <Reveal as="span" effect="line" delay={0.25 + index * 0.14} className={styles.stepRule} aria-hidden />
                  <p>{step.description.map((line) => <span key={line}>{line}</span>)}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal effect="fade" delay={0.4} className={styles.signature} aria-hidden>
            PREPARE<span />COOK<span />SERVE
          </Reveal>
        </div>
      </div>
    </section>
  );
}
