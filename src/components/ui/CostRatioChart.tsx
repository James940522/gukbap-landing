"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState, type CSSProperties } from "react";
import { costComparison } from "@/data/costComparison";
import styles from "./CostRatioChart.module.css";

export function CostRatioChart() {
  const chartRef = useRef<HTMLElement>(null);
  const entered = useInView(chartRef, { once: true, amount: 0.35 });
  const reducedMotion = useReducedMotion();
  const [finishedBars, setFinishedBars] = useState<string[]>([]);
  const showValues = reducedMotion || finishedBars.length === costComparison.length;
  const fillBars = entered || reducedMotion;

  return (
    <figure
      ref={chartRef}
      className={styles.chart}
      data-cost-chart={showValues ? "complete" : entered ? "growing" : "waiting"}
    >
      <figcaption className="sr-only">
        원가율 비교: {costComparison.map((item) => `${item.label} ${item.value}${item.qualifier ? ` ${item.qualifier}` : ""}`).join(", ")}.
      </figcaption>
      <div className={styles.rows} aria-hidden="true">
        {costComparison.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.row} ${item.featured ? styles.featured : ""}`}
          >
            <div className={styles.rail}>
              <div
                className={styles.bar}
                style={{ "--bar-size": item.relativeWidth } as CSSProperties}
              >
                <motion.div
                  className={styles.fill}
                  data-reveal="cost-bar"
                  data-cost-bar={item.id}
                  initial="empty"
                  animate={fillBars ? "filled" : "empty"}
                  // CSS chooses the growth axis without changing the animation
                  // or restarting it when the viewport crosses the breakpoint.
                  variants={{
                    empty: { "--bar-progress": 0 },
                    filled: { "--bar-progress": 1 },
                  }}
                  transition={{
                    type: "tween",
                    duration: reducedMotion ? 0 : 1.6,
                    delay: reducedMotion ? 0 : index * 0.18,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                  onAnimationComplete={(definition) => {
                    if (definition !== "filled") return;
                    // Reveal both values only after BOTH bars actually finish.
                    setFinishedBars((previous) =>
                      previous.includes(item.id) ? previous : [...previous, item.id],
                    );
                  }}
                />
                <motion.span
                  className={styles.name}
                  data-reveal="fade"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: fillBars ? 1 : 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.8 + index * 0.18 }}
                >
                  {item.label}
                </motion.span>
                <motion.span
                  className={styles.value}
                  data-reveal="rise"
                  data-cost-value={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={showValues ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ type: "tween", duration: reducedMotion ? 0 : 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <strong>{item.value}</strong>
                  {item.qualifier && <span>{item.qualifier}</span>}
                </motion.span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
