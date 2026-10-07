"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { BrandNoticePopup } from "@/components/ui/BrandNoticePopup";
import { GateScene } from "./GateScene";
import { BrandScene } from "./BrandScene";
import { RevealCurtain } from "./RevealCurtain";
import { fitIntroTimeline, INTRO_ASSET_TIMEOUT_MS, INTRO_MODE, INTRO_POPUP_DELAY_MS, INTRO_REDUCED_TIMELINE, INTRO_STORAGE_KEY, INTRO_TIMELINE } from "./intro.constants";
import styles from "./BrandIntro.module.css";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The homepage remains a server-rendered sibling. Only the overlay unmounts.
export function BrandIntro() {
  const [finished, setFinished] = useState(false);
  const finish = useCallback(() => setFinished(true), []);

  return (
    <>
      {finished ? <BrandNoticePopup delayMs={INTRO_POPUP_DELAY_MS} /> : <IntroPlayer onComplete={finish} />}
      <noscript><style>{`[data-brand-intro] { display: none !important; }`}</style></noscript>
    </>
  );
}

function IntroPlayer({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(0);
  const [loadedAssets, setLoadedAssets] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [gateComplete, setGateComplete] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [playbackTimeline, setPlaybackTimeline] = useState(INTRO_TIMELINE);
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => false);
  const timeline = reducedMotion ? INTRO_REDUCED_TIMELINE : playbackTimeline;
  const requiredAssets = reducedMotion ? ["logo"] : ["frame", "left", "right", "logo", "table"];
  const assetsReady = requiredAssets.every((id) => loadedAssets.includes(id));

  const markLoaded = useCallback((id: string) => {
    setLoadedAssets((previous) => previous.includes(id) ? previous : [...previous, id]);
  }, []);
  const reveal = useCallback(() => setSkipping(true), []);
  const finish = useCallback(() => {
    if (INTRO_MODE === "session") {
      try { window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true"); } catch { /* Optional visiting policy. */ }
    }
    onComplete();
  }, [onComplete]);

  useLayoutEffect(() => {
    mountedAt.current = performance.now();
    const root = document.documentElement;
    const body = document.body;
    const overlay = overlayRef.current;
    const previous = { rootOverflow: root.style.overflow, bodyOverflow: body.style.overflow, gutter: root.style.scrollbarGutter };
    const previousFocus = document.activeElement;
    // Keep the existing page geometry while hiding the native scrollbar.
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    const syncViewport = () => {
      if (!overlay) return;
      overlay.style.width = `${window.innerWidth}px`;
      overlay.style.setProperty("--intro-gutter", `${window.innerWidth - root.clientWidth}px`);
    };
    syncViewport();
    window.addEventListener("resize", syncViewport);

    // Protect background links/forms from keyboard focus without hiding their DOM.
    const siblings = [...(overlay?.parentElement?.children ?? [])]
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== overlay && element.tagName !== "NOSCRIPT")
      .map((element) => ({ element, inert: element.inert }));
    for (const { element } of siblings) element.inert = true;
    overlay?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); reveal(); }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      root.style.overflow = previous.rootOverflow;
      body.style.overflow = previous.bodyOverflow;
      root.style.scrollbarGutter = previous.gutter;
      for (const { element, inert } of siblings) element.inert = inert;
      window.removeEventListener("resize", syncViewport);
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus !== body && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [reveal]);

  useEffect(() => {
    let showIntro = true;
    try {
      const forced = new URLSearchParams(window.location.search).get("intro") === "1";
      showIntro = forced || INTRO_MODE === "always" || window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true";
    } catch { /* Storage restrictions do not prevent the introduction. */ }
    if (!showIntro) {
      const frame = requestAnimationFrame(finish);
      return () => cancelAnimationFrame(frame);
    }
    if (!assetsReady || playing || skipping) return;
    const frame = requestAnimationFrame(() => {
      setPlaybackTimeline(fitIntroTimeline((performance.now() - mountedAt.current) / 1000));
      setPlaying(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [assetsReady, playing, skipping, finish]);

  useEffect(() => {
    if (playing || skipping) return;
    // A failed/slow asset must never strand visitors behind a locked overlay.
    const timeout = setTimeout(reveal, reducedMotion ? 400 : INTRO_ASSET_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [playing, skipping, reducedMotion, reveal]);

  useEffect(() => {
    if (!playing && !skipping) return;
    // Animation-complete is primary; this bounds a stalled animation after tab suspension.
    const timeout = setTimeout(finish, (skipping ? 0.35 : timeline.total) * 1000 + 350);
    return () => clearTimeout(timeout);
  }, [playing, skipping, timeline.total, finish]);

  return (
    <div ref={overlayRef} className={styles.overlay} data-brand-intro data-intro-state={skipping ? "revealing" : playing ? "playing" : "loading"} tabIndex={-1} role="status" aria-label="뚝손국밥 브랜드 소개">
      <RevealCurtain key={skipping ? "skip" : "timeline"} playing={playing} timeline={timeline} skip={skipping} onComplete={finish} />
      {!reducedMotion && !gateComplete && !skipping && <GateScene playing={playing} timeline={timeline} onAssetLoad={markLoaded} onAssetError={reveal} onComplete={() => setGateComplete(true)} />}
      {!skipping && <BrandScene playing={playing} timeline={timeline} reducedMotion={reducedMotion} onAssetLoad={markLoaded} onAssetError={reveal} />}
    </div>
  );
}
