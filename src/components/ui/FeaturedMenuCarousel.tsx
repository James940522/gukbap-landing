"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { featuredMenus } from "@/data/featuredMenus";
import { ArrowIcon } from "./Icons";
import styles from "./FeaturedMenuCarousel.module.css";

export function FeaturedMenuCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ first: 0, perView: 3 });
  const total = featuredMenus.length;
  const last = Math.min(position.first + position.perView, total);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function updatePosition() {
      if (!track?.firstElementChild) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const stride = track.firstElementChild.getBoundingClientRect().width + gap;
      const perView = Math.min(total, Math.max(1, Math.round((track.clientWidth + gap) / stride)));
      const first = Math.max(0, Math.min(total - perView, Math.round(track.scrollLeft / stride)));
      setPosition((previous) =>
        previous.first === first && previous.perView === perView
          ? previous
          : { first, perView },
      );
    }

    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(track);
    track.addEventListener("scroll", updatePosition, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", updatePosition);
    };
  }, [total]);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track?.firstElementChild) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const stride = track.firstElementChild.getBoundingClientRect().width + gap;
    track.scrollTo({
      left: Math.max(0, Math.min(index, total - position.perView)) * stride,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight") goTo(position.first + position.perView);
    else if (event.key === "ArrowLeft") goTo(position.first - position.perView);
    else if (event.key === "Home") goTo(0);
    else if (event.key === "End") goTo(total);
    else return;
    event.preventDefault();
  }

  return (
    <div className={styles.carousel}>
      <div
        id="featured-menu-track"
        ref={trackRef}
        className={styles.track}
        role="region"
        aria-label="대표 뚝배기 메뉴"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {featuredMenus.map((menu) => (
          <article key={menu.id} className={styles.item}>
            <div className={styles.media}>
              <Image
                src={menu.image.src}
                alt={menu.name}
                fill
                sizes="(max-width: 599px) calc(100vw - 104px), (max-width: 899px) calc((100vw - 160px) / 2), (max-width: 1503px) calc((100vw - 224px) / 3), 427px"
              />
            </div>
            <h3 className={styles.name}>{menu.name}</h3>
            <span className={styles.marker} aria-hidden="true" />
          </article>
        ))}
      </div>
      <div className={styles.buttons}>
        <button
          type="button"
          aria-label="이전 대표 메뉴"
          aria-controls="featured-menu-track"
          disabled={position.first === 0}
          onClick={() => goTo(position.first - position.perView)}
          className={`${styles.arrow} ${styles.previous}`}
        >
          <ArrowIcon />
        </button>
        <button
          type="button"
          aria-label="다음 대표 메뉴"
          aria-controls="featured-menu-track"
          disabled={last === total}
          onClick={() => goTo(position.first + position.perView)}
          className={`${styles.arrow} ${styles.next}`}
        >
          <ArrowIcon />
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        대표 메뉴, 전체 {total}개 중 {position.first + 1}번째부터 {last}번째 메뉴
      </p>
    </div>
  );
}
