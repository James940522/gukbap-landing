"use client";

import Image from "next/image";
import { motion, type Easing, type Transition, type Variants } from "framer-motion";
import { useMemo } from "react";
import { INTRO_ASSETS, INTRO_COPIES, INTRO_TIMELINE } from "./intro.constants";
import styles from "./BrandScene.module.css";

type IntroTimeline = typeof INTRO_TIMELINE;

type BrandSceneProps = {
  timeline: IntroTimeline;
  reducedMotion: boolean;
  onAssetLoad: (asset: string) => void;
  onAssetError: () => void;
  playing: boolean;
};

const impactEase = [0.22, 0.75, 0.24, 1] as const;

function timelineTransition(total: number, times: number[], ease: Easing): Transition {
  return {
    duration: total,
    times: times.map((time) => time / total),
    // Native Motion applies a lone easing curve to the whole animation clock.
    // An easing per segment preserves the absolute times of the holds/reveals.
    ease: times.slice(1).map(() => ease),
  };
}

function tableVariants(timeline: IntroTimeline, reducedMotion: boolean): Variants {
  if (reducedMotion) return { hidden: { opacity: 0 }, playing: { opacity: 0 } };

  const exitEnd = timeline.brandExit + timeline.brandExitDuration;
  return {
    // The photograph is already behind the closed gate at the first paint.
    hidden: { opacity: 1 },
    playing: {
      opacity: [1, 1, 0, 0],
      transition: timelineTransition(timeline.total, [0, timeline.brandExit, exitEnd, timeline.total], "easeInOut"),
    },
  };
}

function tableZoomVariants(timeline: IntroTimeline, reducedMotion: boolean): Variants {
  return {
    hidden: { scale: 1 },
    playing: reducedMotion ? { scale: 1 } : {
      scale: 1.18,
      transition: { delay: timeline.tableZoomStart, duration: timeline.tableZoomDuration, ease: impactEase },
    },
  };
}

function logoVariants(timeline: IntroTimeline, reducedMotion: boolean): Variants {
  const { logoIn, logoDuration, brandExit, brandExitDuration, total } = timeline;
  const exitEnd = brandExit + brandExitDuration;

  if (reducedMotion) {
    const times = [0, logoIn, logoIn + logoDuration, brandExit, exitEnd, total];
    return {
      hidden: { opacity: 0, scale: 1, filter: "blur(0px)" },
      playing: {
        opacity: [0, 0, 1, 1, 0, 0],
        transition: timelineTransition(total, times, "easeInOut"),
      },
    };
  }

  const times = [0, logoIn, logoIn + logoDuration * 0.38, logoIn + logoDuration * 0.65, logoIn + logoDuration, brandExit, exitEnd, total];
  return {
    hidden: { opacity: 0, scale: 1.6, filter: "blur(8px)" },
    playing: {
      opacity: [0, 0, 1, 1, 1, 1, 0, 0],
      scale: [1.6, 1.6, 0.94, 1.03, 1, 1, 0.92, 0.92],
      filter: ["blur(8px)", "blur(8px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"],
      transition: timelineTransition(total, times, impactEase),
    },
  };
}

function shakeVariants(timeline: IntroTimeline, reducedMotion: boolean): Variants {
  if (reducedMotion) return { hidden: { x: 0, y: 0 }, playing: { x: 0, y: 0 } };

  const impact = timeline.logoIn + timeline.logoDuration * 0.38;
  const duration = 0.15;
  const times = [0, 0.035, 0.07, 0.11, duration];
  return {
    hidden: { x: 0, y: 0 },
    playing: {
      x: [0, -3, 3, -1, 0],
      y: [0, 2, -1, 1, 0],
      transition: { ...timelineTransition(duration, times, "linear"), delay: impact },
      transitionEnd: { x: 0, y: 0 },
    },
  };
}

function copyVariants(timeline: IntroTimeline, index: number): Variants {
  const start = timeline.copyIn[index];
  const end = timeline.copyOut[index];
  const next = timeline.copyIn[index + 1] ?? timeline.brandExit;
  const exitDuration = Math.min(timeline.copyDuration, next - end);
  const times = [0, start, start + timeline.copyDuration, end, end + exitDuration, timeline.total];

  return {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    playing: {
      opacity: [0, 0, 1, 1, 0, 0],
      y: [16, 16, 0, 0, -12, -12],
      filter: ["blur(4px)", "blur(4px)", "blur(0px)", "blur(0px)", "blur(4px)", "blur(4px)"],
      transition: timelineTransition(timeline.total, times, "easeInOut"),
    },
  };
}

export function BrandScene({ timeline, reducedMotion, onAssetLoad, onAssetError, playing }: BrandSceneProps) {
  const animations = useMemo(() => ({
    table: tableVariants(timeline, reducedMotion),
    tableZoom: tableZoomVariants(timeline, reducedMotion),
    logo: logoVariants(timeline, reducedMotion),
    shake: shakeVariants(timeline, reducedMotion),
    copies: reducedMotion ? [] : INTRO_COPIES.map((_, index) => copyVariants(timeline, index)),
  }), [timeline, reducedMotion]);
  const state = playing ? "playing" : "hidden";

  return (
    <motion.div className={styles.scene} data-intro-scene="brand" data-reduced-motion={reducedMotion || undefined} aria-hidden="true" initial="hidden" animate={state} variants={animations.shake}>
      {!reducedMotion && <motion.figure className={styles.table} data-intro-table initial="hidden" animate={state} variants={animations.table}>
        <motion.div className={styles.tableZoom} data-intro-table-zoom initial="hidden" animate={state} variants={animations.tableZoom}>
          <Image
            src={INTRO_ASSETS.table}
            alt="검은 뚝배기에 담긴 국밥과 곁들임으로 차린 뚝손국밥 한 상"
            fill
            sizes="(max-aspect-ratio: 1672/941) 210vh, 118vw"
            unoptimized
            priority
            draggable={false}
            onLoad={() => onAssetLoad("table")}
            onError={onAssetError}
          />
        </motion.div>
        <div className={styles.tableShade} />
      </motion.figure>}

      <div className={styles.logoPosition}>
        <motion.figure className={styles.logo} data-intro-logo initial="hidden" animate={state} variants={animations.logo}>
          <Image
            src={INTRO_ASSETS.logo}
            alt="뚝손국밥"
            sizes="(max-width: 599px) 82vw, 560px"
            priority
            draggable={false}
            onLoad={() => onAssetLoad("logo")}
            onError={onAssetError}
          />
        </motion.figure>
      </div>

      {!reducedMotion && (
        <div className={styles.copyPosition}>
          {INTRO_COPIES.map((copy, index) => (
            <motion.p key={copy} className={styles.copy} data-intro-copy={index} initial="hidden" animate={state} variants={animations.copies[index]}>
              {copy.split(", ").map((line, lineIndex, lines) => (
                <span key={line} className={styles.copyLine}>
                  {line}{lineIndex < lines.length - 1 ? ", " : ""}
                </span>
              ))}
            </motion.p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
