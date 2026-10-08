"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import styles from "./TtuksonProfitSection.module.css";

const BASE = "/images/ttukson-profit";
const CANVAS = { width: 1916, height: 821 } as const;

type Layer = {
  file: string;
  left: number;
  top: number;
  width: number;
  delay: number;
  className?: string;
};

// Original artwork coordinates for pixel-consistent desktop reconstruction.
const layers: Layer[] = [
  { file: "02_title_line1.png", left: 495, top: 35, width: 923, delay: 0.0 },
  { file: "03_title_line2.png", left: 735, top: 123, width: 535, delay: 0.20 },
  { file: "04_subtitle.png", left: 616, top: 218, width: 694, delay: 0.38 },
  { file: "09_profit_chart.png", left: 694, top: 258, width: 578, delay: 0.65, className: styles.chart },
  { file: "05_card_left_top.png", left: 266, top: 281, width: 368, delay: 0.90 },
  { file: "07_card_right_top.png", left: 1287, top: 283, width: 373, delay: 1.06 },
  { file: "06_card_left_bottom.png", left: 255, top: 500, width: 378, delay: 1.22 },
  { file: "08_card_right_bottom.png", left: 1329, top: 525, width: 392, delay: 1.38 },
  { file: "10_connector_left_top.png", left: 607, top: 348, width: 151, delay: 1.55 },
  { file: "11_connector_left_bottom.png", left: 605, top: 567, width: 118, delay: 1.65 },
  { file: "12_connector_right_top.png", left: 1155, top: 350, width: 115, delay: 1.75 },
  { file: "13_connector_right_bottom.png", left: 1170, top: 548, width: 141, delay: 1.85 },
  { file: "14_disclaimer.png", left: 696, top: 737, width: 554, delay: 2.00 },
];

const mobileLayers = [
  "02_title_line1.png",
  "03_title_line2.png",
  "04_subtitle.png",
  "09_profit_chart.png",
  "05_card_left_top.png",
  "06_card_left_bottom.png",
  "07_card_right_top.png",
  "08_card_right_bottom.png",
  "14_disclaimer.png",
] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, duration: 0.78, ease: [0.22, 1, 0.36, 1] },
  }),
};

const instant: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function TtuksonProfitSection() {
  const reducedMotion = useReducedMotion();
  const variants = reducedMotion ? instant : reveal;

  return (
    <section className={styles.section} aria-labelledby="profit-title">
      <h2 id="profit-title" className={styles.srOnly}>
        뚝손국밥은 매출이 끝이 아니라, 시작입니다
      </h2>
      <p className={styles.srOnly}>
        영업이익 30%, 식재료 37.1%, 인건비 22.2%, 월세 3%, 관리비 2.1%, 기타 3%의 예시 구조.
        메뉴 단순화, 원가구조 최적화, 인력 의존도 최소화, 회전율 중심 운영.
        비율은 운영 사례 일부를 바탕으로 하며 점포마다 달라질 수 있습니다.
      </p>

      <motion.div
        className={styles.desktopStage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        {layers.map((layer) => (
          <motion.img
            key={layer.file}
            src={`${BASE}/${layer.file}`}
            alt=""
            aria-hidden="true"
            draggable={false}
            variants={variants}
            custom={layer.delay}
            className={`${styles.layer} ${layer.className ?? ""}`}
            style={{
              left: `${(layer.left / CANVAS.width) * 100}%`,
              top: `${(layer.top / CANVAS.height) * 100}%`,
              width: `${(layer.width / CANVAS.width) * 100}%`,
            }}
          />
        ))}
      </motion.div>

      <div className={styles.mobileStage} aria-hidden="true">
        {mobileLayers.map((file, index) => (
          <motion.img
            key={file}
            src={`${BASE}/${file}`}
            alt=""
            draggable={false}
            className={`${styles.mobileLayer} ${styles[`mobileItem${index}`]}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={variants}
            custom={index < 4 ? 0.08 : 0.02}
          />
        ))}
      </div>
    </section>
  );
}
