import Image from "next/image";
import type { ReactNode } from "react";
import { heroFood } from "@/data/heroScene";
import styles from "./GateHeroScene.module.css";

export function GateHeroScene({ actions }: {
  actions: ReactNode;
}) {
  return (
    <>
      <div className={styles.scene}>
        <figure className={styles.food}>
          <picture>
            <source media="(max-width: 899px)" srcSet={heroFood.mobileSrc} />
            <Image
              src={heroFood.src}
              alt={heroFood.alt}
              fill
              sizes="100vw"
              unoptimized
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </figure>
      </div>
      <div className={styles.footer}>
        <div className={styles.actions}>{actions}</div>
      </div>
    </>
  );
}
