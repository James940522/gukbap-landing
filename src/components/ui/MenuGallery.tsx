"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { menuCategories, type MenuCategory, type MenuGroup } from "@/data/menus";
import { ArrowIcon } from "./Icons";
import { MediaFrame } from "./MediaFrame";
import { Reveal } from "./Reveal";

const desktopQuery = "(min-width: 900px)";
const autoAdvanceDelay = 4500;

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

function subscribeToPageVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function getPageVisibilitySnapshot() {
  return !document.hidden;
}

type AutoAdvanceProps = {
  autoAdvance: boolean;
  interactionVersion: number;
  onComplete: () => void;
};

function MenuSlider({ category, autoAdvance, interactionVersion, onComplete }: { category: MenuGroup } & AutoAdvanceProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ first: 0, perView: Math.min(3, category.items.length) });
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
        ? Math.min(total, Math.max(1, Math.round((track.clientWidth + gap) / stride)))
        : total;
      const first = isSlider
        ? Math.max(0, Math.min(total - perView, Math.round(track.scrollLeft / stride)))
        : 0;
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

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track || !track.firstElementChild) return;
    const styles = getComputedStyle(track);
    if (styles.gridAutoFlow !== "column") return;
    const gap = parseFloat(styles.columnGap) || 0;
    const stride = track.firstElementChild.getBoundingClientRect().width + gap;
    const target = Math.max(0, Math.min(index, total - position.perView));
    track.scrollTo({
      left: target * stride,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [position.perView, total]);

  useEffect(() => {
    if (!autoAdvance) return;
    const timer = window.setTimeout(() => {
      if (last < total) goTo(position.first + 1);
      else onComplete();
    }, autoAdvanceDelay);
    return () => window.clearTimeout(timer);
  }, [autoAdvance, goTo, interactionVersion, last, onComplete, position.first, total]);

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
      <div id={trackId} ref={trackRef} className="menu-grid" role="region" aria-label={`${category.name} 메뉴 목록`} tabIndex={0} onKeyDown={handleSliderKeyDown}>
        {category.items.map((menu, index) => (
          <Reveal as="article" key={menu.id} delay={(index % 3) * 0.08} duration={0.65} className="menu-card">
            <MediaFrame
              label={`${menu.name} 이미지`}
              caption={category.caption}
              image={menu.image}
              className="menu-media"
              sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 899px) calc((100vw - 72px) / 2), (max-width: 1343px) calc((100vw - 330px) / 3), 338px"
            />
            <div className="menu-info">
              <div className="menu-title-row">
                <h4>{menu.name}</h4>
                <span className="menu-number">{String(index + 1).padStart(2, "0")}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="menu-slider-controls" hidden={total <= position.perView}>
        <div className="menu-slider-progress" aria-hidden="true"><span style={{ width: `${(last / total) * 100}%` }} /></div>
        <p className="menu-slider-position" role="status" aria-live={autoAdvance ? "off" : "polite"} aria-atomic="true">
          <span className="sr-only">전체 {total}개 중 </span>
          <strong>{String(position.first + 1).padStart(2, "0")}—{String(last).padStart(2, "0")}</strong>
          <span aria-hidden="true"> / {String(total).padStart(2, "0")}</span>
          <span className="sr-only">번째 메뉴</span>
        </p>
        <div className="menu-slider-buttons">
          <button type="button" aria-label="이전 메뉴" aria-controls={trackId} disabled={position.first === 0} onClick={() => goTo(position.first - position.perView)}><ArrowIcon className="menu-slider-previous" /></button>
          <button type="button" aria-label="다음 메뉴" aria-controls={trackId} disabled={last === total} onClick={() => goTo(position.first + position.perView)}><ArrowIcon /></button>
        </div>
      </div>
    </div>
  );
}

function MenuCategoryPanel({ category, autoAdvance, interactionVersion, onComplete }: { category: MenuCategory } & AutoAdvanceProps) {
  const [groupIndex, setGroupIndex] = useState(0);
  const groupTabsRef = useRef<HTMLDivElement>(null);
  const groups = category.groups;
  const advanceGroup = useCallback(() => {
    if (groups && groupIndex < groups.length - 1) setGroupIndex(groupIndex + 1);
    else onComplete();
  }, [groupIndex, groups, onComplete]);

  function handleGroupKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!groups) return;
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % groups.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + groups.length) % groups.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = groups.length - 1;
    else return;
    event.preventDefault();
    setGroupIndex(next);
    groupTabsRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']")[next]?.focus();
  }

  return (
    <>
      <Reveal effect="fade" duration={0.45} className="menu-category-heading">
        <h3>{category.name}</h3>
        <span>전체 메뉴<i />{category.items.length}가지</span>
      </Reveal>
      {groups ? (
        <>
          <div className="menu-subcategory-tabs" ref={groupTabsRef} role="tablist" aria-label={`${category.name} 세부 종류`}>
            {groups.map((group, index) => (
              <button key={group.id} id={`menu-subtab-${group.id}`} type="button" role="tab" aria-selected={groupIndex === index} aria-controls={`menu-subpanel-${group.id}`} tabIndex={groupIndex === index ? 0 : -1} onClick={() => setGroupIndex(index)} onKeyDown={(event) => handleGroupKeyDown(event, index)}>
                {group.name}<span>{String(group.items.length).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          {groups.map((group, index) => (
            <div key={group.id} id={`menu-subpanel-${group.id}`} role="tabpanel" aria-labelledby={`menu-subtab-${group.id}`} hidden={index !== groupIndex}>
              {index === groupIndex && <MenuSlider category={group} autoAdvance={autoAdvance} interactionVersion={interactionVersion} onComplete={advanceGroup} />}
            </div>
          ))}
        </>
      ) : <MenuSlider category={category} autoAdvance={autoAdvance} interactionVersion={interactionVersion} onComplete={onComplete} />}
    </>
  );
}

export function MenuGallery() {
  const isDesktop = useSyncExternalStore(subscribeToDesktop, getDesktopSnapshot, getServerSnapshot);
  const isPageVisible = useSyncExternalStore(subscribeToPageVisibility, getPageVisibilitySnapshot, getServerSnapshot);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
  const [interactionVersion, setInteractionVersion] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const autoAdvance = isInView && isPageVisible && !isHovered && !isKeyboardFocused && !reducedMotion;

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.15),
      { threshold: 0.15 },
    );
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  const advanceCategory = useCallback(() => {
    setActiveIndex((index) => (index + 1) % menuCategories.length);
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === (isDesktop ? "ArrowDown" : "ArrowRight")) next = (index + 1) % menuCategories.length;
    else if (event.key === (isDesktop ? "ArrowUp" : "ArrowLeft")) next = (index - 1 + menuCategories.length) % menuCategories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = menuCategories.length - 1;
    else return;
    event.preventDefault();
    setActiveIndex(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']")[next]?.focus();
  }

  return (
    <div
      className="menu-gallery" ref={galleryRef}
      onPointerEnter={(event) => { if (event.pointerType !== "touch") setIsHovered(true); }}
      onPointerLeave={() => setIsHovered(false)}
      onPointerDownCapture={() => { setIsKeyboardFocused(false); setInteractionVersion((version) => version + 1); }}
      onFocusCapture={(event) => { if (event.target.matches(":focus-visible")) setIsKeyboardFocused(true); }}
      onKeyDownCapture={() => { setIsKeyboardFocused(true); setInteractionVersion((version) => version + 1); }}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsKeyboardFocused(false); }}
    >
      <div className="menu-tabs" ref={tabsRef} role="tablist" aria-label="메뉴 종류" aria-orientation={isDesktop ? "vertical" : "horizontal"}>
        {menuCategories.map((category, index) => (
          <button key={category.id} id={`tab-${category.id}`} role="tab" type="button" aria-selected={activeIndex === index} aria-controls={`panel-${category.id}`} tabIndex={activeIndex === index ? 0 : -1} onClick={() => setActiveIndex(index)} onKeyDown={(event) => handleKeyDown(event, index)}>
            {category.name}<span>{String(category.items.length).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      {menuCategories.map((category, categoryIndex) => (
        <div key={category.id} id={`panel-${category.id}`} role="tabpanel" aria-labelledby={`tab-${category.id}`} hidden={categoryIndex !== activeIndex}>
          {categoryIndex === activeIndex && <MenuCategoryPanel category={category} autoAdvance={autoAdvance} interactionVersion={interactionVersion} onComplete={advanceCategory} />}
        </div>
      ))}
    </div>
  );
}
