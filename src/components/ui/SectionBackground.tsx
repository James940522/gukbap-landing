import Image from "next/image";
import type { CSSProperties } from "react";
import { getSectionBackground, type SectionBackgroundName } from "@/data/sectionBackgrounds";
import styles from "./SectionBackground.module.css";

export function SectionBackground({
  name,
  className = "",
}: {
  name: SectionBackgroundName;
  className?: string;
}) {
  const background = getSectionBackground(name);
  const style = {
    "--background-image-opacity": background.opacity,
    "--background-image-opacity-mobile": background.mobileOpacity,
    "--background-image-position": background.position ?? "center",
    "--background-image-position-mobile": background.mobilePosition ?? background.position ?? "center",
  } as CSSProperties;

  return (
    <div className={`${styles.layer} ${className}`} style={style} data-section-background={name} aria-hidden="true">
      <Image
        src={`/images/backgrounds/${background.image}.webp`}
        alt=""
        fill
        sizes="100vw"
        className={styles.image}
        loading={background.eager ? "eager" : "lazy"}
        fetchPriority="low"
      />
    </div>
  );
}
