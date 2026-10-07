"use client";

import { motion } from "framer-motion";
import { INTRO_TIMELINE } from "./intro.constants";
import styles from "./RevealCurtain.module.css";

export function RevealCurtain({ playing, timeline, skip = false, onComplete }: {
  playing: boolean;
  timeline: typeof INTRO_TIMELINE;
  skip?: boolean;
  onComplete: () => void;
}) {
  const transition = {
    delay: skip ? 0 : timeline.curtainStart,
    duration: skip ? 0.35 : timeline.curtainDuration,
    ease: [0.16, 1, 0.3, 1] as const,
  };
  return (
    <div className={styles.curtains} data-intro-curtains aria-hidden="true">
      <motion.div className={styles.left} data-intro-curtain="left" initial={false} animate={{ x: playing || skip ? "-100%" : "0%" }} transition={transition} />
      <motion.div className={styles.right} data-intro-curtain="right" initial={false} animate={{ x: playing || skip ? "100%" : "0%" }} transition={transition} onAnimationComplete={() => { if (playing || skip) onComplete(); }} />
    </div>
  );
}
