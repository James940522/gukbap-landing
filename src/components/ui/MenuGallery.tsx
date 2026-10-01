"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { menuCategories, type MenuCategory } from "@/data/site";
import { ArrowIcon } from "./Icons";
import { MediaFrame } from "./MediaFrame";
import { Reveal } from "./Reveal";

const desktopQuery = "(min-width: 900px)";

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(desktopQuery).matches;
}

function getServerSnapshot() {
  return false;
}

function MenuSlider({ category }: { category: MenuCategory }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ first: 0, perView: 3 });
  const total = category.items.length;
  const last = Math.min(position.first + position.perView, total);
  const trackId = `menu-track-${category.id}`;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function updatePosition() {
      if (!track || !track.firstElementChild) return;
      const styles = getComputedStyle(track);
      const isSlider = styles.gridAutoFlow === "column";
      const gap = parseFloat(styles.columnGap) || 0;
      const stride = track.firstElementChild.getBoundingClientRect().width + gap;
      const perView = isSlider
        ? Math.max(1, Math.round((track.clientWidth + gap) / stride))
        : total;
      const first = isSlider
        ? Math.max(
            0,
            Math.min(total - perView, Math.round(track.scrollLeft / stride)),
          )
        : 0;

      setPosition((previous) =>
        previous.first === first && previous.perView === perView
          ? previous
          : { first, perView },
      );
    }

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
    if (!track || !track.firstElementChild) return;
    const styles = getComputedStyle(track);
    if (styles.gridAutoFlow !== "column") return;
    const gap = parseFloat(styles.columnGap) || 0;
    const stride = track.firstElementChild.getBoundingClientRect().width + gap;
    const target = Math.max(0, Math.min(index, total - position.perView));

    track.scrollTo({
      left: target * stride,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  function handleSliderKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || position.perView >= total) return;
    if (event.key === "ArrowRight") goTo(position.first + position.perView);
    else if (event.key === "ArrowLeft") goTo(position.first - position.perView);
    else if (event.key === "Home") goTo(0);
    else if (event.key === "End") goTo(total);
    else return;
    event.preventDefault();
  }

  return (
    <div className="menu-slider">
      <div
        id={trackId}
        ref={trackRef}
        className="menu-grid"
        role="region"
        aria-label={`${category.name} 메뉴 목록`}
        tabIndex={0}
        onKeyDown={handleSliderKeyDown}
      >
        {category.items.map((menu, index) => (
          <Reveal as="article" key={menu.id} delay={(index % 3) * 0.08} duration={0.65} className="menu-card">
            <MediaFrame
              label={`${menu.name} 이미지`}
              englishLabel={category.english}
              image={menu.image}
              className="menu-media"
              sizes="(max-width: 599px) 100vw, (max-width: 899px) 50vw, 33vw"
            />
            <div className="menu-info">
              <div className="menu-title-row">
                <h4>{menu.name}</h4>
                <span className="menu-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              {menu.badge && <span className="menu-badge">{menu.badge}</span>}
            </div>
          </Reveal>
        ))}
      </div>
      <div className="menu-slider-controls">
        <div className="menu-slider-progress" aria-hidden="true">
          <span style={{ width: `${(last / total) * 100}%` }} />
        </div>
        <p className="menu-slider-position" role="status" aria-atomic="true">
          <span className="sr-only">전체 {total}개 중 </span>
          <strong>
            {String(position.first + 1).padStart(2, "0")}—
            {String(last).padStart(2, "0")}
          </strong>
          <span aria-hidden="true"> / {String(total).padStart(2, "0")}</span>
          <span className="sr-only">번째 메뉴</span>
        </p>
        <div className="menu-slider-buttons">
          <button
            type="button"
            aria-label="이전 메뉴"
            aria-controls={trackId}
            disabled={position.first === 0}
            onClick={() => goTo(position.first - position.perView)}
          >
            <ArrowIcon className="menu-slider-previous" />
          </button>
          <button
            type="button"
            aria-label="다음 메뉴"
            aria-controls={trackId}
            disabled={last === total}
            onClick={() => goTo(position.first + position.perView)}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export function MenuGallery() {
  const isDesktop = useSyncExternalStore(subscribeToDesktop, getDesktopSnapshot, getServerSnapshot);
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const active = menuCategories[activeIndex];

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === (isDesktop ? "ArrowDown" : "ArrowRight")) next = (index + 1) % menuCategories.length;
    else if (event.key === (isDesktop ? "ArrowUp" : "ArrowLeft"))
      next = (index - 1 + menuCategories.length) % menuCategories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = menuCategories.length - 1;
    else return;
    event.preventDefault();
    setActiveIndex(next);
    tabsRef.current
      ?.querySelectorAll<HTMLButtonElement>("[role='tab']")
      [next]?.focus();
  }

  return (
    <div className="menu-gallery">
      <div
        className="menu-tabs"
        ref={tabsRef}
        role="tablist"
        aria-label="메뉴 종류"
        aria-orientation={isDesktop ? "vertical" : "horizontal"}
      >
        {menuCategories.map((category, index) => (
          <button
            key={category.id}
            id={`tab-${category.id}`}
            role="tab"
            type="button"
            aria-selected={activeIndex === index}
            aria-controls={`panel-${category.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {category.name}
            <span>{String(category.items.length).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      {menuCategories.map((category, categoryIndex) => (
        <div
          key={category.id}
          id={`panel-${category.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${category.id}`}
          hidden={categoryIndex !== activeIndex}
        >
          {categoryIndex === activeIndex && (
            <>
              <Reveal effect="fade" duration={0.45} className="menu-category-heading">
                <h3>{active.name}</h3>
                <span>
                  {active.english}
                  <i />
                  {String(active.items.length).padStart(2, "0")} ITEMS
                </span>
              </Reveal>
              <MenuSlider category={category} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
