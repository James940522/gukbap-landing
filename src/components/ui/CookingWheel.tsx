"use client";

import Image from "next/image";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { BowlIcon } from "@/components/ui/Icons";
import { cooking } from "@/data/cooking";
import styles from "./CookingWheel.module.css";

// Source: dongnamjip.com #section06, inline GSAP timeline + strokeAni CSS.
// The ring repeats linearly every 5s. Right: 0–1.5s; bottom: 1.5–3s;
// left: 2.5–5s (0.5s overlap). power1.inOut is a quadratic ease.
const ease = (value: number) => value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
const cycleDuration = 5;

export function CookingWheel() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wheelRef, { amount: 0.25 });
  const reducedMotion = useReducedMotion();
  const time = useMotionValue(0);
  const rightOpacity = useTransform(time, [0, 1.5, 5], [0, 1, 1], { ease });
  const bottomOpacity = useTransform(time, [0, 1.5, 3, 5], [0, 0, 1, 1], { ease });
  const leftOpacity = useTransform(time, [0, 2.5, 5], [0, 0, 1], { ease });
  const dashOffset = useTransform(time, [0, 5], [1911, 0]);
  const opacity = [rightOpacity, bottomOpacity, leftOpacity];

  useEffect(() => {
    if (!isInView || reducedMotion) return;
    const controller = animate(time, cycleDuration, {
      duration: cycleDuration,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });
    return () => { controller.stop(); time.set(0); };
  }, [isInView, reducedMotion, time]);

  return (
    <figure className={styles.figure} aria-labelledby="cooking-wheel-caption">
      <div ref={wheelRef} className={styles.wheel}>
        <div className={styles.pictures} aria-hidden="true">
          <Image
            src={cooking.image.src}
            alt=""
            fill
            sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 899px) 80vw, 660px"
            className={styles.baseImage}
          />
          {cooking.steps.map((step, index) => (
            <motion.div
              key={step.number}
              className={`${styles.piece} ${styles[step.position]}`}
              style={{ opacity: opacity[index] }}
            >
              <div className={styles.photoArea}>
                <Image src={step.image.src} alt="" fill sizes="(max-width: 599px) 80vw, 600px" style={{ objectPosition: step.image.objectPosition }} />
              </div>
              <div className={styles.shade} />
              <div className={styles.caption}>
                <BowlIcon />
                <span className={styles.stepLabel}>{step.label}</span>
                <p>{step.caption.map((line) => <span key={line}>{line}</span>)}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <svg className={styles.ring} viewBox="0 0 610 610" fill="none" aria-hidden="true">
          <circle className={styles.track} cx="305" cy="305" r="298" />
          <motion.circle
            className={styles.progress}
            cx="305" cy="305" r="298"
            transform="rotate(-90 305 305)"
            strokeDasharray="1911"
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
      </div>
      <figcaption id="cooking-wheel-caption" className="sr-only">
        {cooking.image.alt}. 준비, 조리, 완성의 세 장면으로 이어지는 뚝손의 한 그릇.
      </figcaption>
      <ol className="sr-only">
        {cooking.steps.map((step) => <li key={step.number}>{step.label}: {step.description.join(" ")}</li>)}
      </ol>
      <noscript>
        <style>{`.${styles.piece}{opacity:1!important}.${styles.progress}{stroke-dasharray:none!important;stroke-dashoffset:0!important}`}</style>
      </noscript>
    </figure>
  );
}
