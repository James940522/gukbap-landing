import Image from "next/image";
import type { ReactNode } from "react";
import { heroFood } from "@/data/heroScene";
import styles from "./GateHeroScene.module.css";

export function GateHeroScene({ children, actions }: {
  children: ReactNode;
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
        <div className={styles.brand}>
          {children}
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.footnote}>한 그릇을 제대로.</p>
        <div className={styles.actions}>{actions}</div>
      </div>
    </>
  );
}
