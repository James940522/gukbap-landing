"use client";

import Image from "next/image";
import { useState } from "react";
import { nurungjiStory, type NurungjiMenu } from "@/data/nurungji";
import { Reveal } from "@/components/ui/Reveal";
import styles from "@/components/sections/NurungjiSection.module.css";

export function NurungjiMenuFeature({ menus }: { menus: NurungjiMenu[] }) {
  const [selectedId, setSelectedId] = useState(menus[0].id);
  const selected = menus.find((menu) => menu.id === selectedId) ?? menus[0];

  return (
    <div className={styles.feature}>
      <Reveal effect="settle" duration={0.9} className={styles.stage}>
        <figure id="nurungji-menu-photo" className={styles.menuPhoto}>
          <div className={styles.photoLayer}>
            <Image
              src={selected.image}
              alt={`${selected.name}에 누룽지가 담긴 뚝배기와 곁들임 반찬`}
              fill
              sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 899px) calc(100vw - 48px), (max-width: 1299px) 54vw, 690px"
              quality={90}
            />
          </div>
          <span className={styles.photoCorner} aria-hidden="true" />
          <span className={styles.stamp} aria-hidden="true">
            <span>한 그릇에 더한</span>
            <strong>누룽지</strong>
            <span>고소한 여운</span>
          </span>
          <figcaption className={styles.photoCaption}>
            <span>{selected.name}</span>
            <span>NURUNGJI + GUKBAP</span>
          </figcaption>
        </figure>
      </Reveal>

      <Reveal effect="fade" delay={0.18} className={styles.selection}>
        <div className={styles.selectionHeading}>
          <h3>{nurungjiStory.selectionTitle}</h3>
          <p>{nurungjiStory.selectionDescription}</p>
        </div>
        <div className={styles.choices} role="group" aria-label="누룽지 국밥 메뉴 선택">
          {menus.map((menu) => (
            <button
              key={menu.id}
              type="button"
              className={styles.choice}
              aria-label={menu.name}
              aria-pressed={selected.id === menu.id}
              aria-controls="nurungji-menu-photo"
              onClick={() => setSelectedId(menu.id)}
            >
              <span className={styles.choiceImage} aria-hidden="true">
                <Image src={menu.image} alt="" fill sizes="72px" />
              </span>
              <span className={styles.choiceCopy}>
                <span>{menu.styleLabel}</span>
                <strong>{menu.shortName}</strong>
              </span>
              <span className={styles.choiceMark} aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <p className={styles.selectionNote} aria-live="polite" aria-atomic="true">
          {selected.description}
        </p>
      </Reveal>
    </div>
  );
}
