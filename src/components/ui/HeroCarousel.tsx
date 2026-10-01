"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { HeroSlide } from "@/data/heroSlides";
import { ArrowIcon, BowlIcon } from "./Icons";
import { Reveal } from "./Reveal";
import styles from "./HeroCarousel.module.css";

export function HeroCarousel({ slides }: { slides: readonly HeroSlide[] }) {
  const [selected, setSelected] = useState(0);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const viewportId = useId();
  const statusId = useId();
  const total = slides.length;
  const active = Math.min(selected, total - 1);

  if (total === 0) return null;

  function goTo(index: number) {
    setSelected((index + total) % total);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") goTo(active + 1);
    else if (event.key === "ArrowLeft") goTo(active - 1);
    else if (event.key === "Home") goTo(0);
    else if (event.key === "End") goTo(total - 1);
    else return;
    event.preventDefault();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    gesture.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      goTo(active + (dx < 0 ? 1 : -1));
    }
  }

  return (
    <div className="hero-visual" role="region" aria-roledescription="캐러셀" aria-label="뚝손국밥 음식 사진">
      <div className="hero-orbit" aria-hidden="true" />
      <Reveal effect="fade" className="hero-visual-top">
        <span>THE WARMTH OF A BOWL</span>
        <span>뚝손의 한 그릇</span>
      </Reveal>
      <div className={styles.stage}>
        <div
          id={viewportId}
          className={`media-frame hero-media ${styles.viewport}`}
          role="group"
          aria-label="대표 음식 사진"
          aria-describedby={statusId}
          tabIndex={total > 1 ? 0 : -1}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { gesture.current = null; }}
          onLostPointerCapture={() => { gesture.current = null; }}
        >
          {slides.map((slide, index) => (
            <motion.figure
              key={slide.id}
              className={styles.slide}
              role="group"
              aria-roledescription="슬라이드"
              aria-label={`${index + 1} / ${total}`}
              aria-hidden={index !== active}
              initial={false}
              animate={{ opacity: index === active ? 1 : 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeInOut" }}
              style={{ zIndex: index === active ? 1 : 0 }}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1299px) 52vw, 664px"
                draggable={false}
              />
            </motion.figure>
          ))}
        </div>
        <Reveal delay={0.3} className="hero-note">
          <BowlIcon />
          <div>
            <span>뚝손이 담고 싶은 것</span>
            <strong>한 숟갈의 깊이.<br /> 한 끼의 든든함.</strong>
          </div>
          <span className="hero-note-index" aria-hidden="true">{String(active + 1).padStart(2, "0")}</span>
        </Reveal>
      </div>
      <div className={styles.controls}>
        {total > 1 && (
          <div className={styles.thumbnails} role="group" aria-label="사진 선택">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={styles.thumbnail}
                aria-label={`${index + 1}번 사진 보기`}
                aria-pressed={index === active}
                aria-controls={viewportId}
                onClick={() => goTo(index)}
              >
                <Image src={slide.image} alt="" fill sizes="120px" draggable={false} />
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        )}
        <div className={styles.navigation}>
          <p id={statusId} className={styles.position} role="status" aria-atomic="true">
            <span className="sr-only">사진 </span>
            <strong>{String(active + 1).padStart(2, "0")}</strong>
            <span> / {String(total).padStart(2, "0")}</span>
          </p>
          {total > 1 && (
            <div className={styles.arrows}>
              <button type="button" aria-label="이전 사진" aria-controls={viewportId} onClick={() => goTo(active - 1)}>
                <ArrowIcon className={styles.previous} />
              </button>
              <button type="button" aria-label="다음 사진" aria-controls={viewportId} onClick={() => goTo(active + 1)}>
                <ArrowIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
