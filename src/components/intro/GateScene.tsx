"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { heroGate } from "@/data/heroScene";
import { INTRO_ASSETS, INTRO_TIMELINE } from "./intro.constants";
import styles from "./GateScene.module.css";

type Props = {
  playing: boolean;
  timeline: typeof INTRO_TIMELINE;
  onAssetLoad: (asset: string) => void;
  onAssetError: () => void;
  onComplete: () => void;
};

function doorPosition(box: typeof heroGate.left): CSSProperties {
  return {
    left: `${box.x / heroGate.width * 100}%`,
    top: `${box.y / heroGate.height * 100}%`,
    width: `${box.width / heroGate.width * 100}%`,
    height: `${box.height / heroGate.height * 100}%`,
    transformOrigin: box.transformOrigin,
  };
}

export function GateScene({ playing, timeline, onAssetLoad, onAssetError, onComplete }: Props) {
  return (
    <div className={styles.scene} data-intro-gate aria-hidden="true">
      <motion.div
        className={styles.camera}
        initial={false}
        animate={playing ? { scale: [1, 1.04, 4.5], y: [0, 0, "-5%"] } : { scale: 1, y: 0 }}
        transition={{ delay: timeline.approach, duration: timeline.gateEnd - timeline.approach, times: [0, (timeline.pushIn - timeline.approach) / (timeline.gateEnd - timeline.approach), 1], ease: [[0.4, 0, 0.2, 1], [0.4, 0, 0.2, 1]] }}
        style={{ "--gate-ratio": heroGate.width / heroGate.height, "--perspective-ratio": heroGate.perspective / heroGate.width } as CSSProperties}
        data-intro-camera
        onAnimationComplete={() => { if (playing) onComplete(); }}
      >
        <div className={styles.stage}>
          <div className={styles.doorSpace}>
            {(["left", "right"] as const).map((side) => (
              <motion.div key={side} className={styles.door} style={doorPosition(heroGate[side])} data-intro-door={side} initial={false} animate={{ rotateY: playing ? (side === "left" ? heroGate.angle : -heroGate.angle) : 0 }} transition={{ delay: playing ? timeline.doorOpen : 0, duration: playing ? timeline.doorDuration : 0, ease: [0.4, 0, 0.2, 1] }}>
                <Image src={side === "left" ? INTRO_ASSETS.leftDoor : INTRO_ASSETS.rightDoor} alt="" fill unoptimized priority sizes="50vw" draggable={false} onLoad={() => onAssetLoad(side)} onError={onAssetError} />
              </motion.div>
            ))}
          </div>
          <Image className={styles.frame} src={INTRO_ASSETS.frame} alt="" fill unoptimized priority sizes="100vw" draggable={false} onLoad={() => onAssetLoad("frame")} onError={onAssetError} />
        </div>
      </motion.div>
    </div>
  );
}
