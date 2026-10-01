import Image from "next/image";
import { bowlFeature } from "@/data/bowlFeature";
import { Reveal } from "@/components/ui/Reveal";
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
        <Reveal effect="settle" duration={0.9} className={styles.visual} aria-hidden={!bowlFeature.image || undefined}>
          {bowlFeature.image && (
            <Image
              src={bowlFeature.image.src}
              alt={bowlFeature.image.alt}
              fill
              sizes="(max-width: 767px) 100vw, 48vw"
              className={styles.food}
            />
          )}
        </Reveal>
        <div className={styles.copy}>
          <Reveal as="p" effect="fade" className={styles.eyebrow}>{bowlFeature.eyebrow}</Reveal>
          <Reveal as="span" effect="line" delay={0.08} className={styles.divider} aria-hidden />
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
