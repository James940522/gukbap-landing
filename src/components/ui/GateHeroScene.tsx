"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { heroFood, heroGate, heroTimeline as timeline } from "@/data/heroScene";
import styles from "./GateHeroScene.module.css";

type Phase = "closed" | "opening" | "complete";
const INTRO_STORAGE_KEY = "ddukson-gate-intro-seen";
const ease = [0.4, 0, 0.2, 1] as const;
const instant = { duration: 0, delay: 0 };

const foodVariants: Variants = {
  closed: { opacity: 0, transition: instant },
  opening: { opacity: 1, transition: { delay: timeline.foodDelay, duration: timeline.foodDuration, ease } },
  complete: { opacity: 1, transition: instant },
};
const gateVariants: Variants = {
  closed: { opacity: 1, transition: instant },
  opening: { opacity: 0, transition: { delay: timeline.frameDelay, duration: timeline.frameDuration, ease } },
  complete: { opacity: 0, transition: instant },
};
const brandVariants: Variants = {
  closed: { opacity: 0, y: 12, transition: instant },
  opening: { opacity: 1, y: 0, transition: { delay: timeline.logoDelay, duration: timeline.logoDuration, ease } },
  complete: { opacity: 1, y: 0, transition: instant },
};

function doorVariants(angle: number): Variants {
  return {
    closed: { rotateY: 0, transition: instant },
    opening: { rotateY: angle, transition: { delay: timeline.doorDelay, duration: timeline.doorDuration, ease } },
    complete: { rotateY: angle, transition: instant },
  };
}

function doorPosition(box: typeof heroGate.left): CSSProperties {
  return {
    left: `${box.x / heroGate.width * 100}%`,
    top: `${box.y / heroGate.height * 100}%`,
    width: `${box.width / heroGate.width * 100}%`,
    height: `${box.height / heroGate.height * 100}%`,
    transformOrigin: box.transformOrigin,
  };
}

export function GateHeroScene({ children, actions, afterIntro }: {
  children: ReactNode;
  actions: ReactNode;
  afterIntro?: ReactNode;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(new Set<string>());
  const started = useRef(false);
  const firstVisit = useRef<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>("closed");
  const [assetsReady, setAssetsReady] = useState(false);
  const [assetFailed, setAssetFailed] = useState(false);
  const reducedMotion = useReducedMotion();
  const inView = useInView(sceneRef, { once: true, amount: 0.15 });

  const finish = useCallback(() => {
    started.current = true;
    setPhase("complete");
  }, []);

  function markLoaded(asset: string) {
    loaded.current.add(asset);
    if (loaded.current.size === 4) setAssetsReady(true);
  }

  useEffect(() => {
    if (firstVisit.current === null) {
      try {
        firstVisit.current = window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true";
        if (firstVisit.current) window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
      } catch {
        // If storage is unavailable, prefer showing the intended entrance once.
        firstVisit.current = true;
      }
    }

    if (!firstVisit.current || reducedMotion || assetFailed) {
      const frame = requestAnimationFrame(finish);
      return () => cancelAnimationFrame(frame);
    }
    if (!inView || !assetsReady || started.current) return;
    const frame = requestAnimationFrame(() => {
      started.current = true;
      setPhase("opening");
    });
    return () => cancelAnimationFrame(frame);
  }, [assetsReady, assetFailed, inView, reducedMotion, finish]);

  useEffect(() => {
    if (phase !== "closed" || assetsReady) return;
    // Failed/slow gate assets must never leave the brand hidden indefinitely.
    const timeout = setTimeout(finish, timeline.assetTimeoutMs);
    return () => clearTimeout(timeout);
  }, [assetsReady, phase, finish]);

  return (
    <>
      <div
        ref={sceneRef}
        className={styles.scene}
        data-gate-phase={phase}
        style={{ "--gate-ratio": heroGate.width / heroGate.height, "--perspective-ratio": heroGate.perspective / heroGate.width } as CSSProperties}
      >
        <motion.figure className={styles.food} data-gate-content initial="closed" animate={phase} variants={foodVariants}>
          <Image
            src={heroFood.src}
            alt={heroFood.alt}
            fill
            sizes="(max-width: 599px) 100vw, (max-width: 899px) 100vw, 1100px"
            priority
            onLoad={() => markLoaded("food")}
            onError={() => setAssetFailed(true)}
          />
        </motion.figure>
        <motion.div className={styles.brand} data-gate-content initial="closed" animate={phase} variants={brandVariants}>
          {children}
        </motion.div>
        <motion.div
          className={styles.gate}
          data-gate-layer
          aria-hidden="true"
          initial="closed"
          animate={phase}
          variants={gateVariants}
          onAnimationComplete={(definition) => {
            if (definition === "opening") setPhase("complete");
          }}
        >
          <div className={styles.gateStage}>
            <div className={styles.doorSpace}>
              {(["left", "right"] as const).map((side) => {
                const box = heroGate[side];
                return (
                  <motion.div
                    key={side}
                    data-gate-plane={side}
                    className={styles.door}
                    style={doorPosition(box)}
                    initial="closed"
                    animate={phase}
                    variants={doorVariants(side === "left" ? heroGate.angle : -heroGate.angle)}
                  >
                    {/* Keep all three gate layers on the identical pixel grid. */}
                    <Image src={`/images/hero/${box.asset}`} alt="" fill unoptimized priority draggable={false} onLoad={() => markLoaded(side)} onError={() => setAssetFailed(true)} />
                  </motion.div>
                );
              })}
            </div>
            <Image className={styles.frame} src="/images/hero/gate-frame.webp" alt="" fill unoptimized priority draggable={false} onLoad={() => markLoaded("frame")} onError={() => setAssetFailed(true)} />
          </div>
        </motion.div>
      </div>
      <div className={styles.footer}>
        <p className={styles.footnote}>한 그릇을 제대로.</p>
        <div className={styles.actions}>{actions}</div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{phase === "complete" ? "뚝손국밥 한 상을 만나보세요." : ""}</p>
      {phase === "complete" && afterIntro}
      <noscript>
        <style>{`[data-gate-layer] { display: none !important; } [data-gate-content] { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
    </>
  );
}
