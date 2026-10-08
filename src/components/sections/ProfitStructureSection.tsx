"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useRef, useState, type ReactNode } from "react";
import {
  profitConnections,
  profitLayers,
  profitPrinciples,
  profitScene,
  profitStructure,
  type ProfitEntrance,
} from "@/data/profitStructure";
import styles from "./ProfitStructureSection.module.css";

type Timing = { effect: ProfitEntrance; delay: number; duration: number };

const hiddenEntrances = {
  rise: { opacity: 0, y: 16 },
  emphasis: { opacity: 0, y: 12, scale: 0.98 },
  chart: { opacity: 0, y: 20, scale: 0.97 },
  left: { opacity: 0, x: -18 },
  right: { opacity: 0, x: 18 },
  fade: { opacity: 0 },
};
const ease = [0.22, 0.61, 0.36, 1] as const;
const source = (file: string) => `${profitScene.base}/${file}`;

function MobileReveal({
  children,
  className,
  variants,
  timing,
}: {
  children: ReactNode;
  className?: string;
  variants: Variants;
  timing: Timing;
}) {
  return (
    <motion.div
      className={className}
      data-profit-entrance
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: "some", margin: "0px 0px -48px 0px" }}
      variants={variants}
      custom={timing}
    >
      {children}
    </motion.div>
  );
}

export function ProfitStructureSection() {
  const reducedMotion = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const entered = useInView(sceneRef, { once: true, margin: "0px 0px -96px 0px" });
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const markLoaded = useCallback((file: string) => {
    setLoadedImages((current) => current.includes(file) ? current : [...current, file]);
  }, []);
  // Start the shared clock only when the lazy-loaded layers and final image
  // can actually be painted, even on a slow connection.
  const ready = loadedImages.length === profitLayers.length + 2;
  const variants: Variants = {
    hidden: ({ effect }: Timing) => hiddenEntrances[effect],
    visible: ({ delay, duration }: Timing) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { type: "tween", ease, delay: reducedMotion ? 0 : delay, duration: reducedMotion ? 0 : duration },
    }),
  };
  const imageLayer = (id: typeof profitLayers[number]["id"]) => profitLayers.find((layer) => layer.id === id)!;

  return (
    <section id="profit-structure" className={styles.section} aria-labelledby="profit-structure-title">
      <h2 id="profit-structure-title" className="sr-only">
        {profitStructure.headline} {profitStructure.emphasis}
      </h2>
      <p className="sr-only">
        {profitStructure.description.before}{profitStructure.description.emphasis}{profitStructure.description.after}
      </p>
      <ul className="sr-only">
        {profitPrinciples.map((principle) => <li key={principle.id}>{principle.label}</li>)}
      </ul>
      <p className="sr-only">
        제공된 운영 사례의 수익 구조: {profitStructure.ratios.map((ratio) => `${ratio.label} ${ratio.value}`).join(", ")}.
        {profitStructure.notes.join(" ")}
      </p>

      <motion.div
        ref={sceneRef}
        className={styles.desktopScene}
        data-profit-scene
        initial="hidden"
        animate={entered && ready ? "visible" : "hidden"}
        aria-hidden="true"
      >
        <Image
          src={source(profitScene.background)}
          alt=""
          fill
          sizes="(min-width: 1916px) 1916px, 100vw"
          unoptimized
          className={styles.background}
          onLoad={() => markLoaded(profitScene.background)}
        />

        {profitLayers.map((layer) => (
          <motion.div
            key={layer.id}
            className={`${styles.layer} ${styles[layer.id] ?? ""}`}
            data-profit-entrance
            data-profit-layer={layer.id}
            style={{
              left: `${layer.left / profitScene.width * 100}%`,
              top: `${layer.top / profitScene.height * 100}%`,
              width: `${layer.width / profitScene.width * 100}%`,
              aspectRatio: `${layer.width} / ${layer.height}`,
            }}
            variants={variants}
            custom={layer}
          >
            <Image
              src={source(layer.file)}
              alt=""
              width={layer.width}
              height={layer.height}
              sizes={`${Math.ceil(layer.width / profitScene.width * 100)}vw`}
              // Preserve the already lossless lettering and alpha edges.
              unoptimized
              className={styles.artwork}
              draggable={false}
              onLoad={() => markLoaded(layer.file)}
            />
          </motion.div>
        ))}

        <svg className={styles.connections} viewBox={`0 0 ${profitScene.width} ${profitScene.height}`} fill="none">
          {profitConnections.map(({ id, from, to, delay }) => (
            <motion.g
              key={id}
              data-profit-entrance
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delay: reducedMotion ? 0 : delay, duration: reducedMotion ? 0 : 0.4, ease } },
              }}
            >
              <path
                d={`M${to[0]} ${to[1]}L${from[0]} ${from[1]}`}
                stroke="#67452c"
                strokeWidth="1.8"
                strokeDasharray="3 4"
                strokeLinecap="round"
              />
              <circle cx={from[0]} cy={from[1]} r="6.4" fill="#b58a40" stroke="#795026" strokeWidth="1.2" />
              <circle cx={from[0] - 1.6} cy={from[1] - 1.8} r="2.9" fill="#ead29f" />
            </motion.g>
          ))}
        </svg>

        <motion.div
          className={styles.finalArtwork}
          data-profit-final
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { ease, delay: reducedMotion ? 0 : profitScene.finish.delay, duration: reducedMotion ? 0 : profitScene.finish.duration } },
          }}
        >
          <Image
            src={source(profitScene.final)}
            alt=""
            fill
            sizes="(min-width: 1916px) 1916px, 100vw"
            unoptimized
            className={styles.artwork}
            draggable={false}
            onLoad={() => markLoaded(profitScene.final)}
          />
        </motion.div>
      </motion.div>

      <div className={styles.mobileScene} data-profit-mobile aria-hidden="true">
        <Image src={source(profitScene.mobileBackground)} alt="" fill sizes="100vw" unoptimized className={styles.mobileBackground} />
        <div className={styles.mobileContent}>
          <header className={styles.mobileHeading}>
            {(["title", "emphasis"] as const).map((id) => {
              const layer = imageLayer(id);
              return (
                <MobileReveal key={id} className={styles[`mobile${id}`]} variants={variants} timing={layer}>
                  <Image src={source(layer.file)} alt="" width={layer.width} height={layer.height} unoptimized className={styles.artwork} draggable={false} />
                </MobileReveal>
              );
            })}
            <MobileReveal className={styles.mobileSubtitle} variants={variants} timing={imageLayer("subtitle")}>
              <p>{profitStructure.description.before}<strong>{profitStructure.description.emphasis}</strong>{profitStructure.description.after}</p>
            </MobileReveal>
          </header>

          <MobileReveal className={styles.mobileChart} variants={variants} timing={{ effect: "chart", delay: 0.12, duration: 0.8 }}>
            <Image src={source(imageLayer("chart").file)} alt="" width={578} height={497} unoptimized className={styles.artwork} draggable={false} />
            <dl className={styles.mobileRatios}>
              {profitStructure.ratios.map((ratio) => <div key={ratio.label}><dt>{ratio.label}</dt><dd>{ratio.value}</dd></div>)}
            </dl>
          </MobileReveal>

          <div className={styles.mobilePrinciples}>
            {profitPrinciples.map((principle) => {
              const layer = imageLayer(principle.id);
              return (
                <MobileReveal key={principle.id} className={styles.mobileCard} variants={variants} timing={{ effect: "rise", delay: 0.08, duration: 0.7 }}>
                  <Image src={source(layer.file)} alt="" width={layer.width} height={layer.height} unoptimized className={styles.artwork} draggable={false} />
                </MobileReveal>
              );
            })}
          </div>

          <MobileReveal className={styles.mobileNotes} variants={variants} timing={{ effect: "fade", delay: 0.1, duration: 0.6 }}>
            {profitStructure.notes.map((note) => <p key={note}>* {note}</p>)}
          </MobileReveal>
        </div>
      </div>

      <noscript>
        <style>{`#profit-structure [data-profit-final], #profit-structure [data-profit-entrance] { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
    </section>
  );
}
