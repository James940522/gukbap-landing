"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { brandGrowth, type BrandGrowthEntrance } from "@/data/brandGrowth";
import styles from "./BrandGrowthSection.module.css";

type EntranceTiming = {
  effect: BrandGrowthEntrance;
  delay: number;
  duration: number;
};

const hiddenEntrances = {
  wipe: { opacity: 0, x: -8, y: 8, clipPath: "inset(0% 100% 0% 0%)", filter: "blur(4px)" },
  rise: { opacity: 0, y: 12, filter: "blur(3px)" },
  seal: { opacity: 0, y: 12, scale: 0.92, filter: "blur(3px)" },
  unfold: { opacity: 0, clipPath: "inset(0% 50% 0% 50%)" },
};

export function BrandGrowthSection() {
  const reducedMotion = useReducedMotion();
  const entrances: Variants = {
    hidden: ({ effect }: EntranceTiming) => hiddenEntrances[effect],
    visible: ({ delay, duration }: EntranceTiming) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      filter: "blur(0px)",
      transition: {
        type: "tween",
        ease: [0.22, 0.61, 0.36, 1],
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
      },
    }),
  };

  return (
    <section id="brand-growth" className={styles.section} aria-labelledby="brand-growth-title">
      <h2 id="brand-growth-title" className="sr-only">{brandGrowth.title}</h2>
      <p className="sr-only">{brandGrowth.brands}. {brandGrowth.statement}</p>
      <p className="sr-only">{brandGrowth.badge}</p>

      <motion.div
        className={styles.scene}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        aria-hidden="true"
      >
        <Image
          src={brandGrowth.background}
          alt=""
          fill
          sizes="(max-width: 1920px) 100vw, 1920px"
          quality={90}
          className={styles.background}
          placeholder="blur"
        />

        {brandGrowth.layers.map(({ id, image, sizes, ...timing }) => (
          <div key={id} className={`${styles.layer} ${styles[id]}`}>
            <motion.div
              className={styles.entrance}
              data-growth-layer={id}
              custom={timing}
              variants={entrances}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes={sizes}
                quality={90}
                className={styles.artwork}
                draggable={false}
              />
            </motion.div>
          </div>
        ))}
      </motion.div>

      <noscript>
        <style>{`[data-growth-layer] { opacity: 1 !important; transform: none !important; clip-path: none !important; filter: none !important; }`}</style>
      </noscript>
    </section>
  );
}
