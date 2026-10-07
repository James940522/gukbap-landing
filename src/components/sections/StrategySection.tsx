"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useId, useRef, useSyncExternalStore, type CSSProperties } from "react";
import {
  strategyAssets,
  strategyContent,
  strategyGraphs,
  strategyPoints,
  strategyTiming as timing,
} from "@/data/strategy";
import icons from "@/data/strategy-icons.json";
import styles from "./StrategySection.module.css";

const viewport = { once: true, amount: "some", margin: "0px 0px -60px 0px" } as const;
const ease = [0.22, 0.61, 0.36, 1] as const;

function subscribeToLayout(onChange: () => void) {
  const query = window.matchMedia("(max-width: 899px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getCompactLayout = () => window.matchMedia("(max-width: 899px)").matches;
const getServerLayout = () => false;

function entrance(delay: number, reduced: boolean | null, duration = 0.5): Variants {
  return {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "tween", delay: reduced ? 0 : delay, duration: reduced ? 0 : duration, ease },
    },
  };
}

function StrategyBoard() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={styles.board}
      data-strategy-layer="board"
      data-strategy-reveal
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={entrance(timing.board, reduced, 0.7)}
    >
      <Image src={strategyAssets.board} alt="" fill sizes="(max-width: 899px) 94vw, 34vw" className={styles.boardImage} />
      <div className={styles.boardContent} data-strategy-layer="text">
        <motion.h2 id="strategy-title" className={styles.title} data-strategy-reveal variants={entrance(timing.title, reduced)}>
          <span className={styles.threeWay}>{strategyContent.title}</span>
          <span>{strategyContent.titleSuffix}</span>
        </motion.h2>
        <motion.p className={styles.description} data-strategy-reveal variants={entrance(timing.description, reduced)}>
          {strategyContent.description[0]}<br />{strategyContent.description[1]}
        </motion.p>
        <ul className={styles.checklist}>
          {strategyContent.checklist.map((label, index) => {
            const delay = timing.checklist + index * timing.checklistStagger;
            return (
              <motion.li key={label} data-strategy-reveal variants={entrance(delay, reduced)}>
                <svg className={styles.check} viewBox={icons.check.viewBox} fill="none" aria-hidden="true">
                  <motion.path
                    d={icons.check.paths[0]}
                    stroke="currentColor"
                    strokeWidth={icons.check.strokeWidth}
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    data-strategy-draw
                    variants={{
                      hidden: { pathLength: 0 },
                      visible: { pathLength: 1, transition: { delay: reduced ? 0 : delay + timing.checkLag, duration: reduced ? 0 : 0.3 } },
                    }}
                  />
                </svg>
                <span>{label}</span>
                <motion.strong
                  className={styles.ok}
                  data-strategy-reveal
                  variants={entrance(delay + timing.okLag, reduced, 0.25)}
                >
                  {strategyContent.emphasis}
                </motion.strong>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}

function ArrowGraph({ mode }: { mode: keyof typeof strategyGraphs }) {
  const reduced = useReducedMotion();
  const revealId = useId();
  const graph = strategyGraphs[mode];
  const nodeBorder = mode === "desktop" ? 6 : 4;

  return (
    <>
    <svg className={styles.graphSvg} viewBox={`0 0 ${graph.width} ${graph.height}`} preserveAspectRatio="none" fill="none" aria-hidden="true" data-strategy-graph={mode}>
      <defs>
        <mask id={revealId} maskUnits="userSpaceOnUse" x={-graph.revealWidth} y={-graph.revealWidth} width={graph.width + graph.revealWidth * 2} height={graph.height + graph.revealWidth * 2} style={{ maskType: "alpha" }}>
          <motion.path
            // Animate a normally scaled mask, so dash lengths follow the path
            // even when the SVG stretches to match a different screen ratio.
            d={graph.revealPath}
            stroke="white"
            strokeWidth={graph.revealWidth}
            strokeLinecap="butt"
            strokeLinejoin="round"
            data-strategy-draw
            data-strategy-sweep
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: {
                  pathLength: { type: "tween", delay: reduced ? 0 : timing.graph, duration: reduced ? 0 : timing.graphDuration, ease: "linear" },
                  opacity: { delay: reduced ? 0 : timing.graph, duration: 0 },
                },
              },
            }}
          />
        </mask>
      </defs>
      <g mask={`url(#${revealId})`}>
        <path
          d={graph.path}
          stroke="currentColor"
          style={{ strokeWidth: `${graph.strokeWidth / graph.width * 100}cqw` }}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
        <path d={graph.arrow} fill="currentColor" />
      </g>
      {strategyPoints.map((point) => {
        const position = point[mode];
        const delay = timing.graph + timing.graphDuration * point.progress[mode];
        return (
          <g key={point.id}>
            <motion.path
              // Extend behind the badge so its circular shape can stay unchanged
              // while the graph stretches vertically to fill the viewport.
              d={`M ${position.x} ${position.y} V ${position.badgeY}`}
              className={styles.stem}
              strokeWidth={mode === "desktop" ? 3 : 2}
              data-strategy-draw
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { type: "tween", delay: reduced ? 0 : delay, duration: reduced ? 0 : 0.35, ease } },
              }}
            />
          </g>
        );
      })}
    </svg>
    {strategyPoints.map((point) => {
      const position = point[mode];
      const delay = timing.graph + timing.graphDuration * point.progress[mode];
      return (
        <div
          key={point.id}
          className={styles.nodePosition}
          aria-hidden="true"
          style={{
            left: `${position.x / graph.width * 100}%`,
            top: `${position.y / graph.height * 100}%`,
            width: `${(graph.nodeRadius * 2 + nodeBorder) / graph.width * 100}%`,
            "--node-border": `${nodeBorder / graph.width * 100}cqw`,
          } as CSSProperties}
        >
          <motion.div
            className={styles.node}
            data-strategy-reveal
            variants={{
              hidden: { opacity: 0, scale: 0.7 },
              visible: { opacity: 1, scale: 1, transition: { type: "tween", delay: reduced ? 0 : delay, duration: reduced ? 0 : 0.3, ease } },
            }}
          />
        </div>
      );
    })}
    </>
  );
}

function StrategyBadges() {
  const reduced = useReducedMotion();
  const compact = useSyncExternalStore(subscribeToLayout, getCompactLayout, getServerLayout);

  return (
    <ul className={styles.badges} aria-label="세 가지 운영 전략" data-strategy-layer="badges">
      {strategyPoints.map((point) => {
        const icon = icons[point.icon];
        const position = {
          "--badge-x": `${point.desktop.x / strategyGraphs.desktop.width * 100}%`,
          "--badge-y": `${point.desktop.badgeY / strategyGraphs.desktop.height * 100}%`,
          "--mobile-badge-x": `${point.mobile.x / strategyGraphs.mobile.width * 100}%`,
          "--mobile-badge-y": `${point.mobile.badgeY / strategyGraphs.mobile.height * 100}%`,
        } as CSSProperties;

        return (
          <li key={point.id} className={styles.badgePosition} style={position}>
            <motion.div
              className={styles.badge}
              data-strategy-reveal
              variants={entrance(timing.graph + timing.graphDuration * point.progress[compact ? "mobile" : "desktop"] + timing.badgeLag, reduced)}
            >
              <svg viewBox={icon.viewBox} fill="none" stroke="currentColor" strokeWidth={icon.strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {icon.paths.map((path) => <path key={path} d={path} />)}
              </svg>
              <span>{point.label[0]}<br />{point.label[1]}</span>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}

/** The landing page's second section, immediately after the hero. */
export function StrategySection() {
  const reduced = useReducedMotion();
  const graphTriggerRef = useRef<HTMLDivElement>(null);
  const graphInView = useInView(graphTriggerRef, { once: true, margin: "0px 0px -40px 0px" });
  const clipStyles = {
    "--food-clip": strategyGraphs.desktop.foodClip,
    "--food-clip-mobile": strategyGraphs.mobile.foodClip,
  } as CSSProperties;

  return (
    <section id="strategy" className={styles.section} aria-labelledby="strategy-title" style={clipStyles}>
      <noscript>
        <style>{`#strategy [data-strategy-reveal] { opacity: 1 !important; transform: none !important; } #strategy [data-strategy-draw] { opacity: 1 !important; stroke-dasharray: none !important; stroke-dashoffset: 0 !important; }`}</style>
      </noscript>
      <div className={styles.canvas}>
        <Image src={strategyAssets.paper} alt="" fill sizes="100vw" className={styles.paper} data-strategy-layer="paper" />
        <div className={styles.hanok} data-strategy-layer="hanok">
          <Image src={strategyAssets.hanok} alt="" fill sizes="(max-width: 899px) 100vw, 52vw" />
        </div>
        <StrategyBoard />
        <motion.div className={styles.graphStage} initial="hidden" animate={graphInView ? "visible" : "hidden"} data-strategy-graph-started={graphInView}>
          <div ref={graphTriggerRef} className={styles.graphTrigger} aria-hidden="true" />
          <div className={styles.food} data-strategy-layer="food">
            <Image
              src={strategyAssets.food}
              alt="석재 테이블 위에 놓인 여섯 가지 국밥과 순대, 수육 한 상"
              fill
              sizes="100vw"
              className={styles.foodImage}
            />
          </div>
          <div className={styles.desktopGraph} data-strategy-layer="graph"><ArrowGraph mode="desktop" /></div>
          <div className={styles.mobileGraph} data-strategy-layer="graph"><ArrowGraph mode="mobile" /></div>
          <StrategyBadges />
          <div className={styles.captionPosition} data-strategy-layer="caption">
            <motion.p className={styles.graphCaption} data-strategy-reveal variants={entrance(timing.graphCaption, reduced)}>
              <span>{strategyContent.graphCaption[0]}</span>
              <strong>{strategyContent.graphCaption[1]}</strong>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
