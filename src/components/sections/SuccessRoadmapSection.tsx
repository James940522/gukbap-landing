'use client';

import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { roadmapStrengths, roadmapSignals, type RoadmapStrength } from '@/data/roadmap';
import { ArrowIcon } from '@/components/ui/Icons';
import { revealViewport } from '@/lib/motion';
import styles from './SuccessRoadmapSection.module.css';

const stepVariants: Variants = {
  hidden: { opacity: 0, x: -16, y: 12 },
  visible: { opacity: 1, x: 0, y: 0 },
};

function TimelineItem({
  strength,
  reduceMotion,
}: {
  strength: RoadmapStrength;
  reduceMotion: boolean;
}) {
  return (
    <motion.li
      data-roadmap-step-tile
      data-roadmap-step={strength.number}
      data-reveal="rise"
      className={styles.step}
      variants={stepVariants}
      transition={{
        type: 'tween',
        duration: reduceMotion ? 0 : 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <article className={styles.card}>
        <div className={styles.cardHeading}>
          <div>
            <p className={styles.stepLabel}>{strength.number}단계 · 운영 기준</p>
            <h3>{strength.title}</h3>
          </div>
          <span className={styles.numberBadge} aria-hidden="true">
            {strength.number}
          </span>
        </div>

        <div
          data-roadmap-image-slot
          className={styles.imageSlot}
          aria-hidden={!strength.image || undefined}
        >
          {strength.image ? (
            <Image
              src={strength.image}
              alt={strength.title}
              fill
              className={styles.image}
              sizes="(max-width: 767px) calc(100vw - 86px), (max-width: 1023px) calc((100vw - 184px) / 2), (max-width: 1303px) calc((100vw - 262px) / 3), 347px"
            />
          ) : (
            <span className={styles.imageNumber}>{strength.number}</span>
          )}
        </div>

        <p className={styles.description}>{strength.desc}</p>
      </article>
    </motion.li>
  );
}

export function SuccessRoadmapSection() {
  const reduceMotion = Boolean(useReducedMotion());
  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduceMotion ? 0 : 0.08,
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  return (
    <section
      id="success-roadmap"
      aria-labelledby="success-roadmap-title"
      className={`section ${styles.section}`}
    >
      <div className={styles.container}>
        <motion.div
          data-roadmap-heading
          data-reveal="rise"
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{
            type: 'tween',
            duration: reduceMotion ? 0 : 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className={styles.introduction}>
            <p className={styles.eyebrow}>뚝손국밥의 창업 운영 체계</p>
            <h2 id="success-roadmap-title">
              성공으로 가는
              <br />
              6단계 로드맵
            </h2>
            <p className={styles.summary}>
              한 그릇의 기본부터 매장의 운영까지. 뚝손과 함께 살펴볼 여섯 가지 기준을 한눈에 담았습니다.
            </p>
          </div>

          <div className={styles.support}>
            <p className={styles.supportTitle}>뚝손의 여섯 가지 운영 기준</p>
            <dl className={styles.signals}>
              {roadmapSignals.map((signal) => (
                <div key={signal.label}>
                  <dt>{signal.label}</dt>
                  <dd>{signal.value}</dd>
                </div>
              ))}
            </dl>
            <a href="#inquiry" className={styles.inquiryLink}>
              지금 바로 시작하세요
              <ArrowIcon />
            </a>
            <p className={styles.supportCopy}>점주님의 시작을 함께 이야기하겠습니다.</p>
          </div>
        </motion.div>

        <motion.ol
          data-roadmap-grid
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={gridVariants}
        >
          {roadmapStrengths.map((strength) => (
            <TimelineItem
              key={strength.number}
              strength={strength}
              reduceMotion={reduceMotion}
            />
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
