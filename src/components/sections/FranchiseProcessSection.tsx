import Image from "next/image";
import { franchiseProcessSteps } from "@/data/franchiseProcess";
import { ArrowIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./FranchiseProcessSection.module.css";

export function FranchiseProcessSection() {
  return (
    <section
      id="franchise-process"
      className={styles.section}
      aria-labelledby="franchise-process-title"
    >
      <div className={`container ${styles.content}`}>
        <Reveal effect="rise" duration={0.7} className={styles.header}>
          <div>
            <p className={styles.eyebrow}>FRANCHISE OPENING</p>
            <p className={styles.stepCount}>4 STEPS TO OPEN</p>
            <h2 id="franchise-process-title">가맹절차</h2>
          </div>
          <p className={styles.introduction}>
            상담부터 오픈까지,
            <br />
            필요한 준비를 네 단계로 정리했습니다.
          </p>
        </Reveal>

        <ol className={styles.grid}>
          {franchiseProcessSteps.map((step, index) => (
            <li key={step.id} className={styles.step}>
              <Reveal
                as="article"
                effect="rise"
                duration={0.7}
                delay={index * 0.06}
                className={styles.card}
              >
                <div className={styles.imageSlot}>
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(max-width: 599px) calc(100vw - 42px), (max-width: 1099px) calc((100vw - 68px) / 2), (max-width: 1303px) calc((100vw - 124px) / 4), 293px"
                    className={styles.image}
                    style={{ objectPosition: step.position }}
                  />
                  <span className={styles.stepBadge}>STEP {step.number}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardHeading}>
                    <h3>{step.title}</h3>
                    <span className={styles.number} aria-hidden="true">
                      {step.number}
                    </span>
                  </div>
                  <p className={styles.description}>{step.description}</p>
                  <p className={styles.checkpoint}>{step.checkpoint}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal effect="fade" duration={0.7} className={styles.footer}>
          <p className={styles.note}>
            세부 절차와 일정은 점포 조건에 따라 상담 시 안내합니다.
            <span>단계별 이미지는 이해를 돕기 위한 참고 이미지입니다.</span>
          </p>
          <a href="#inquiry" className={`button button-primary ${styles.cta}`}>
            창업 상담 신청
            <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
