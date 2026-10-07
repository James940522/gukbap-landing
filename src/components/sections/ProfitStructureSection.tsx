import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { profitArtwork, profitPrinciples, profitStructure } from "@/data/profitStructure";
import styles from "./ProfitStructureSection.module.css";

type ArtworkCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function ArtworkWindow({ crop }: { crop: ArtworkCrop }) {
  const style = {
    aspectRatio: `${crop.width} / ${crop.height}`,
    "--artwork-width": `${profitArtwork.width / crop.width * 100}%`,
    "--artwork-left": `${-crop.x / crop.width * 100}%`,
    "--artwork-top": `${-crop.y / crop.height * 100}%`,
  } as CSSProperties;

  return (
    <div className={styles.artworkWindow} style={style} aria-hidden="true">
      <Image
        src={profitArtwork.src}
        alt=""
        width={profitArtwork.width}
        height={profitArtwork.height}
        // The lossless WebP preserves the supplied lettering and diagram.
        // Every window reuses the same encoded asset and browser cache entry.
        unoptimized
        className={styles.artwork}
      />
    </div>
  );
}

export function ProfitStructureSection() {
  return (
    <section
      id="profit-structure"
      className={`section section-light section-background-host ${styles.section}`}
      aria-labelledby="profit-structure-title"
    >
      <div className={styles.background} aria-hidden="true">
        <Image
          src="/images/profit/hanji-background.webp"
          alt=""
          fill
          sizes="100vw"
          className={styles.backgroundImage}
          fetchPriority="low"
        />
      </div>

      <div className={`container ${styles.content}`}>
        <header className={styles.heading}>
          <Reveal as="h2" id="profit-structure-title" className={styles.title} duration={0.8}>
            <span>{profitStructure.headline}</span>
            <strong>{profitStructure.emphasis}</strong>
          </Reveal>
          <Reveal as="p" effect="fade" delay={0.12} className={styles.description}>
            {profitStructure.description.before}
            <strong>{profitStructure.description.emphasis}</strong>
            {profitStructure.description.after}
          </Reveal>
        </header>

        <div className={styles.diagram}>
          <Reveal effect="fade" delay={0.18} className={styles.connections} aria-hidden>
            <svg viewBox="0 0 1140 490" fill="none" preserveAspectRatio="none">
              <path d="M190 130 355 204" stroke="#c51b15" />
              <path d="M950 142 786 210" stroke="#153baf" />
              <path d="M185 365 355 316" stroke="#153baf" />
              <path d="M955 368 786 318" stroke="#c51b15" />
            </svg>
          </Reveal>

          <Reveal as="figure" effect="settle" delay={0.16} duration={0.85} className={styles.chart}>
            <ArtworkWindow crop={profitArtwork.chart} />
            <div className={styles.callouts} aria-hidden="true">
              <svg viewBox="0 0 662 552" fill="none">
                <path d="M178 85V125M256 74V108M326 74V99" stroke="#21130f" strokeWidth="1.5" />
                <g fill="#21130f">
                  <circle cx="178" cy="125" r="4.3" />
                  <circle cx="256" cy="108" r="4.3" />
                  <circle cx="326" cy="99" r="4.3" />
                </g>
              </svg>
              {profitStructure.ratios.slice(3).map((item) => (
                <div key={item.label} className={styles.calloutLabel}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            <figcaption className="sr-only">
              뚝손국밥 수익 구조 운영 사례. {profitStructure.ratios.map((item) => `${item.label} ${item.value}`).join(", ")}.
              {profitStructure.notes.join(" ")}
            </figcaption>
          </Reveal>

          {profitPrinciples.map((principle) => (
            <Reveal
              as="article"
              key={principle.id}
              effect={principle.effect}
              delay={principle.delay}
              duration={0.75}
              className={`${styles.principle} ${styles[principle.id]}`}
            >
              <h3 className="sr-only">{principle.label}</h3>
              <ArtworkWindow crop={principle.crop} />
            </Reveal>
          ))}
        </div>

        <Reveal effect="fade" delay={0.16} className={styles.notes}>
          {profitStructure.notes.map((note) => <p key={note}>* {note}</p>)}
        </Reveal>
      </div>
    </section>
  );
}
