"use client";

import Image from "next/image";
import { useState } from "react";
import { pairingFeature } from "@/data/pairing";
import { ArrowIcon } from "./Icons";
import styles from "@/components/sections/PairingSection.module.css";

export function PairingSuggestions() {
  const [selectedId, setSelectedId] = useState(pairingFeature.suggestions[0].id);
  const selected = pairingFeature.suggestions.find((item) => item.id === selectedId)!;

  return (
    <div className={styles.suggestions}>
      <div className={styles.suggestionHeading}>
        <p className={styles.smallLabel}>취향에 맞춰 즐기는 뚝손</p>
        <h3>오늘의 한 상을 골라보세요.</h3>
      </div>

      <div className={styles.choices} role="group" aria-label="추천 조합 선택">
        {pairingFeature.suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            aria-pressed={selectedId === suggestion.id}
            aria-controls="pairing-suggestion"
            onClick={() => setSelectedId(suggestion.id)}
          >
            {suggestion.label}
          </button>
        ))}
      </div>

      <div id="pairing-suggestion" className={styles.selection} aria-live="polite" aria-atomic="true">
        <p className={styles.occasion}>{selected.occasion}</p>
        <div className={styles.dishes}>
          {selected.dishes.map((dish, index) => (
            <figure key={dish.id} className={styles.dish}>
              <div className={styles.dishImage}>
                <Image
                  src={dish.image}
                  alt=""
                  fill
                  sizes="(max-width: 599px) calc((100vw - 102px) / 2), (max-width: 899px) 190px, (max-width: 1299px) 15vw, 190px"
                />
              </div>
              <figcaption>{dish.name}</figcaption>
              {index === 0 && <span className={styles.plus} aria-hidden="true">＋</span>}
            </figure>
          ))}
        </div>
        <h4 className={styles.selectionTitle}>{selected.title}</h4>
        <p className={styles.description}>{selected.description}</p>
        <p className={styles.selectionNote}><span aria-hidden="true" />{selected.note}</p>
      </div>

      <a className={styles.menuLink} href="#menu">전체 메뉴 살펴보기<ArrowIcon /></a>
    </div>
  );
}
