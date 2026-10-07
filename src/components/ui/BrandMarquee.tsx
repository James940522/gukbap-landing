"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";
import { marquees, type MarqueeTheme } from "@/data/marquees";
import styles from "./BrandMarquee.module.css";

type BrandMarqueeProps = {
  theme: MarqueeTheme;
  variant?: "band" | "backdrop" | "rail";
  tone?: "gold" | "dark" | "paper";
  className?: string;
};

function MarqueeTrack({
  words,
  reverse,
  duration,
  vertical,
  active,
}: {
  words: readonly string[];
  reverse: boolean;
  duration: number;
  vertical: boolean;
  active: boolean;
}) {
  const progress = useMotionValue(0);
  const offset = useTransform(progress, (value) => `${value}%`);
  const playback = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    // Identical halves include their own trailing space, so the loop never jumps.
    playback.current = animate(progress, reverse ? [-50, 0] : [0, -50], {
      duration,
      ease: "linear",
      repeat: Infinity,
    });
    playback.current.pause();
    return () => playback.current?.stop();
  }, [progress, reverse, duration]);

  useEffect(() => {
    if (active) playback.current?.play();
    else playback.current?.pause();
  }, [active]);

  return (
    <div className={styles.row}>
      <motion.div className={styles.track} style={vertical ? { y: offset } : { x: offset }}>
        {[0, 1].map((copy) => (
          <div className={styles.group} key={copy}>
            {[0, 1].flatMap((repeat) => words.map((word, index) => (
              <span className={styles.phrase} key={`${repeat}-${word}`}>
                <span className={index % 2 === 1 ? styles.outline : undefined}>{word}</span>
                <span className={styles.separator}>✦</span>
              </span>
            )))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function BrandMarquee({
  theme,
  variant = "band",
  tone = "gold",
  className = "",
}: BrandMarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "120px", amount: "some" });
  const reducedMotion = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(true);
  const active = inView && !reducedMotion && pageVisible;
  const rowCount = variant === "band" ? 1 : 3;

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <div
      ref={root}
      className={`${styles.marquee} ${styles[variant]} ${styles[tone]} ${className}`}
      aria-hidden="true"
      data-marquee={theme}
      data-marquee-variant={variant}
      data-marquee-active={active}
    >
      {Array.from({ length: rowCount }, (_, index) => (
        <MarqueeTrack
          key={index}
          words={index === 1 ? [...marquees[theme]].reverse() : marquees[theme]}
          reverse={index % 2 === 1}
          duration={variant === "band" ? 100 : 150 + index * 15}
          vertical={variant === "rail"}
          active={active}
        />
      ))}
    </div>
  );
}
