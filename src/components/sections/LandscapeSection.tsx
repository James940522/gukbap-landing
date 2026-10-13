import Image from "next/image";
import { bowlFeature } from "@/data/bowlFeature";
import { Reveal } from "@/components/ui/Reveal";
import { RotatingBowl } from "@/components/ui/RotatingBowl";
import styles from "./LandscapeSection.module.css";

export function LandscapeSection() {
  return (
    <section
      id="one-bowl"
      className={styles.section}
      aria-labelledby="one-bowl-title"
    >
      <Image
        src="/images/backgrounds/hanji-landscape.webp"
        alt=""
        fill
        sizes="100vw"
        className={styles.background}
      />
      <div className={styles.layout}>
        <div className={styles.visual} aria-hidden={!bowlFeature.image || undefined}>
          {bowlFeature.image && (
            <Reveal effect="rotate-in" duration={1.1} delay={0.12} className={styles.bowl}>
              <RotatingBowl className={styles.bowlRotation}>
                <Image
                  src={bowlFeature.image.src}
                  alt={bowlFeature.image.alt}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1599px) 43vw, 680px"
                  className={styles.food}
                />
              </RotatingBowl>
            </Reveal>
          )}
        </div>
        <div className={styles.copy}>
          <h2 id="one-bowl-title" className={styles.title}>
            <Reveal as="span" delay={0.12} duration={0.9}>{bowlFeature.title}</Reveal>
            <Reveal as="span" delay={0.24} duration={0.9} className={styles.accent}>{bowlFeature.highlight}</Reveal>
          </h2>
          <Reveal as="p" effect="fade" delay={0.3} duration={0.9} className={styles.description}>
            {bowlFeature.description.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
