"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowIcon, BowlIcon } from "@/components/ui/Icons";
import { brothFeature } from "@/data/site";
import { revealViewport } from "@/lib/motion";
import styles from "@/components/sections/WhyDduksonSection.module.css";

const ease = [0.22, 0.61, 0.36, 1] as const;

function PrincipleIcon({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "depth" ? (
        <>
          <path d="M5 17h22c-1 7-5 11-11 11S6 24 5 17Zm-2-3h26M11 30h10" />
          <path d="M12 10c-4-4 4-5 0-9M20 10c-4-4 4-5 0-9" />
        </>
      ) : kind === "care" ? (
        <>
          <path d="m9 28 8-13M17 15c-3-2-3-6 0-10s7-5 9-3 1 7-2 11-5 4-7 2Z" />
          <path d="M4 13h7M7.5 9.5v7M24 23h5M26.5 20.5v5" />
        </>
      ) : (
        <>
          <path d="M4 15h24c-1 7-6 11-12 11S5 22 4 15ZM11 29h10M9 11c-4-4 4-5 0-9M16 10c-4-4 4-5 0-9M23 11c-4-4 4-5 0-9" />
        </>
      )}
    </svg>
  );
}

export function BrothComposition() {
  const reducedMotion = useReducedMotion();

  const reveal = (delay: number, duration = 0.7, rise = true): Variants => ({
    hidden: { opacity: 0, y: rise ? 12 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        ease,
      },
    },
  });

  const drawLine = (delay: number, duration = 0.55): Variants => ({
    hidden: { opacity: 0, scaleX: 0 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        type: "tween",
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        ease,
      },
    },
  });

  const drawArc: Variants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        type: "tween",
        duration: reducedMotion ? 0 : 0.95,
        delay: reducedMotion ? 0 : 0.3,
        ease,
      },
    },
  };

  const steam: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 0.35,
      y: -4,
      transition: {
        type: "tween",
        duration: reducedMotion ? 0 : 1.1,
        delay: reducedMotion ? 0 : 0.45,
        ease,
      },
    },
  };

  return (
    <motion.div
      className={styles.composition}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      <div className={styles.message}>
        <motion.p
          className={styles.description}
          variants={reveal(0, 0.6)}
          data-reveal="rise"
        >
          {brothFeature.description.map((line) => <span key={line}>{line}</span>)}
        </motion.p>
        <h2 id="standards-title" className={`display-font ${styles.title}`}>
          {brothFeature.title.map((line, index) => (
            <motion.span
              key={line}
              className={index === brothFeature.title.length - 1 ? styles.emphasis : undefined}
              variants={reveal(0.1 + index * 0.08)}
              data-reveal="rise"
            >
              {line}
            </motion.span>
          ))}
        </h2>
        <motion.span
          className={styles.rule}
          variants={drawLine(1)}
          data-reveal="line"
          aria-hidden="true"
        />
        <motion.div className={styles.blend} variants={reveal(0.7, 0.7, false)} data-reveal="fade" aria-hidden="true">
          <span className={styles.blendMark}><BowlIcon /></span>
        </motion.div>
      </div>
      {brothFeature.elements.map((element, index) => (
        <motion.figure
          key={element.id}
          className={`${styles.element} ${index === 0 ? styles.broth : styles.ingredients}`}
          variants={reveal(0.12 + index * 0.12, 0.8)}
          data-reveal="rise"
        >
          <div className={styles.imageShell}>
            <div className={styles.imageFrame}>
              {element.image ? (
                <Image
                  src={element.image}
                  alt={element.alt}
                  fill
                  sizes="(max-width: 599px) 42vw, (max-width: 767px) 32vw, (max-width: 999px) 24vw, 300px"
                />
              ) : (
                <div className={styles.placeholder}>
                  <BowlIcon />
                  <span>{element.placeholder}</span>
                  <span className={styles.photoNote}>사진 준비 중</span>
                </div>
              )}
            </div>
            <svg className={styles.photoOrnament} viewBox="0 0 320 320" fill="none" aria-hidden="true">
              <path className={styles.ornamentTicks} d="M160 0v9M160 311v9M0 160h9M311 160h9M49 49l5 5M266 266l5 5M49 271l5-5M266 54l5-5" />
              <motion.path
                className={styles.ornamentArc}
                d="M52 52a153 153 0 0 1 216 0M268 268a153 153 0 0 1-216 0"
                variants={drawArc}
                data-ornament
                data-reveal="fade"
              />
              <motion.g className={styles.ornamentDot} variants={reveal(0.85, 0.55, false)} data-reveal="fade">
                <path d="m160 4 4 4-4 4-4-4Z" />
              </motion.g>
            </svg>
            {index === 0 && (
              <motion.svg className={styles.steamDecoration} viewBox="0 0 100 70" fill="none" variants={steam} data-reveal="rise" aria-hidden="true">
                <path d="M27 62c-16-15 15-21 0-39M50 52c-16-15 15-21 0-39M73 62c-16-15 15-21 0-39" />
              </motion.svg>
            )}
            <motion.span
              className={`${styles.connector} ${index === 0 ? styles.connectorLeft : styles.connectorRight}`}
              variants={drawLine(0.55 + index * 0.08, 0.6)}
              data-reveal="line"
              aria-hidden="true"
            />
          </div>
          <figcaption className={styles.caption}>
            <h3>{element.label}</h3>
          </figcaption>
        </motion.figure>
      ))}
      <motion.span
        className={styles.multiply}
        variants={reveal(0.5, 0.4, false)}
        data-reveal="fade"
        aria-hidden="true"
      >
        <BowlIcon />
      </motion.span>
      <div className={styles.principlesRail}>
        <motion.span className={styles.railLine} variants={drawLine(0.85, 0.7)} data-reveal="line" aria-hidden="true" />
        <ul className={styles.principles} aria-label="한 그릇에 담은 뚝손의 기준">
          {brothFeature.principles.map((principle, index) => (
            <motion.li key={principle.id} className={styles.principle} variants={reveal(0.95 + index * 0.1, 0.65)} data-reveal="rise">
              <span className={styles.principleIcon}><PrincipleIcon kind={principle.id} /></span>
              <div className={styles.principleCopy}>
                <h3 className={styles.principleTitle}>{principle.title}</h3>
                <p className={styles.principleDescription}>{principle.description}</p>
              </div>
            </motion.li>
          ))}
        </ul>
        <motion.div className={styles.action} variants={reveal(1.2, 0.65, false)} data-reveal="fade">
          <a href="#cooking-system" className={styles.nextLink}>
            조리 방식 보기
            <ArrowIcon />
          </a>
        </motion.div>
      </div>
      <noscript>
        <style>{`.${styles.photoOrnament} [data-ornament]{stroke-dasharray:none!important;stroke-dashoffset:0!important;opacity:1!important}.${styles.composition} .${styles.steamDecoration}{opacity:.35!important}`}</style>
      </noscript>
    </motion.div>
  );
}
