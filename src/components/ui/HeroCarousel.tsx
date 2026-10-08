"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import type { HeroSlide } from "@/data/heroSlides";
import { ArrowIcon, BowlIcon } from "./Icons";
import { Reveal } from "./Reveal";
import styles from "./HeroCarousel.module.css";

const AUTOPLAY_INTERVAL = 5000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Keep the initial button markup identical during server rendering/hydration.
function serverReducedMotion() {
  return true;
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function isPageVisible() {
  return document.visibilityState === "visible";
}

function serverPageVisible() {
  return true;
}

export function HeroCarousel({ slides }: { slides: readonly HeroSlide[] }) {
  const [selected, setSelected] = useState(0);
  const [playback, setPlayback] = useState<"auto" | "playing" | "paused">("auto");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, prefersReducedMotion, serverReducedMotion);
  const inView = useInView(carouselRef, { amount: 0.25 });
  const pageVisible = useSyncExternalStore(subscribeToVisibility, isPageVisible, serverPageVisible);
  const viewportId = useId();
  const statusId = useId();
  const total = slides.length;
  const active = Math.min(selected, total - 1);
  // Reduced-motion users can still explicitly start playback, without fades.
  const autoplayEnabled = playback === "playing" || (playback === "auto" && !reducedMotion);
  const playing = total > 1 && autoplayEnabled && inView && pageVisible && !hovered && !focused;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setSelected((current) => (current + 1) % total);
    }, AUTOPLAY_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [playing, selected, total]);

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
    <div
      ref={carouselRef}
      className="hero-visual"
      role="region"
      aria-roledescription="캐러셀"
      aria-label="뚝손국밥 음식 사진"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="hero-orbit" aria-hidden="true" />
      <Reveal effect="fade" className="hero-visual-top">
        <span>한 그릇의 온기</span>
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
              </button>
            ))}
          </div>
        )}
        <div className={styles.navigation}>
          <p id={statusId} className={styles.position} role="status" aria-live={playing ? "off" : "polite"} aria-atomic="true">
            <span className="sr-only">사진 </span>
            <strong>{String(active + 1).padStart(2, "0")}</strong>
            <span> / {String(total).padStart(2, "0")}</span>
          </p>
          {total > 1 && (
            <div className={styles.arrows}>
              <button
                type="button"
                aria-label={autoplayEnabled ? "자동 재생 일시정지" : "자동 재생 시작"}
                aria-controls={viewportId}
                onClick={() => {
                  setPlayback(autoplayEnabled ? "paused" : "playing");
                  // An explicit Play request also works with keyboard focus here.
                  setFocused(false);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  {autoplayEnabled
                    ? <path d="M9 5v14M15 5v14" />
                    : <path d="m9 5 10 7-10 7Z" />}
                </svg>
              </button>
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
