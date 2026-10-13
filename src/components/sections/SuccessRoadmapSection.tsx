'use client';

import Image, { getImageProps } from 'next/image';
import type { CSSProperties } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { roadmapStrengths, roadmapSignals, type RoadmapStrength } from '@/data/roadmap';
import { ArrowIcon } from '@/components/ui/Icons';
import { revealViewport } from '@/lib/motion';
import styles from './SuccessRoadmapSection.module.css';

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const accentVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: { opacity: 1, scaleX: 1 },
};

const backgroundProps = {
  alt: '',
  fill: true,
  sizes: '100vw',
};

const { props: desktopBackground } = getImageProps({
  ...backgroundProps,
  src: '/images/backgrounds/roadmap-desktop.webp',
  sizes: '(max-width: 1023px) 1536px, 100vw',
});

const { props: mobileBackground } = getImageProps({
  ...backgroundProps,
  src: '/images/backgrounds/roadmap-mobile.webp',
  // The tall list makes cover scale beyond the viewport width; keep wall detail.
  sizes: '941px',
});

function TimelineItem({
  strength,
  index,
  reduceMotion,
}: {
  strength: RoadmapStrength;
  index: number;
  reduceMotion: boolean;
}) {
  const delay = reduceMotion ? 0 : (index % 3) * 0.12;

  return (
    <motion.li
      data-roadmap-step-tile
      data-roadmap-step={strength.number}
      data-reveal="rise"
      className={styles.step}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={stepVariants}
      transition={{
        type: 'tween',
        delay,
        duration: reduceMotion ? 0 : 0.75,
        ease: [0.22, 0.61, 0.36, 1],
      }}
    >
      <article className={styles.card}>
        <motion.span
          aria-hidden="true"
          data-reveal="line"
          className={styles.stepAccent}
          variants={accentVariants}
          transition={{
            type: 'tween',
            delay: reduceMotion ? 0 : delay + 0.25,
            duration: reduceMotion ? 0 : 0.9,
            ease: [0.22, 0.61, 0.36, 1],
          }}
        />
        <div className={styles.cardHeading}>
          <h3>{strength.title}</h3>
          <span className={styles.stepNumber} aria-hidden="true">{strength.number}</span>
        </div>

        <div
          data-roadmap-image-slot
          className={styles.imageSlot}
          aria-hidden={!strength.image || undefined}
        >
          {strength.image ? (
            <Image
              src={strength.image}
              alt={strength.imageAlt}
              fill
              className={styles.image}
              style={{
                objectPosition: strength.imagePosition ?? '50% 50%',
                transformOrigin: strength.imageOrigin ?? 'center',
                '--roadmap-image-scale': strength.imageScale ?? 1,
              } as CSSProperties}
              sizes="(max-width: 767px) calc(100vw - 88px), (max-width: 1023px) calc((100vw - 188px) / 2), (max-width: 1303px) calc((100vw - 268px) / 3), 345px"
            />
          ) : null}
        </div>

        <p className={styles.description}>{strength.desc}</p>
      </article>
    </motion.li>
  );
}

export function SuccessRoadmapSection() {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section
      id="success-roadmap"
      aria-labelledby="success-roadmap-title"
      className={`section ${styles.section}`}
    >
      <div className={styles.background} aria-hidden="true">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={mobileBackground.srcSet}
            sizes={mobileBackground.sizes}
          />
          <img {...desktopBackground} alt="" className={styles.backgroundImage} fetchPriority="low" />
        </picture>
      </div>
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
            duration: reduceMotion ? 0 : 0.8,
            ease: [0.22, 0.61, 0.36, 1],
          }}
        >
          <div className={styles.introduction}>
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

        <ol
          data-roadmap-grid
          className={styles.grid}
        >
          {roadmapStrengths.map((strength, index) => (
            <TimelineItem
              key={strength.number}
              strength={strength}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
