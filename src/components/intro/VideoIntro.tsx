"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrandNoticePopup } from "@/components/ui/BrandNoticePopup";
import styles from "./VideoIntro.module.css";

const VIDEO_SOURCES = {
  mobile: "/videos/intro/mobile.mp4",
  pc: "/videos/intro/pc.mp4",
};
const FADE_DURATION = 0.8;
const PLAYBACK_TIMEOUT_MS = 10_000;
const POPUP_DELAY_MS = 1000;
const INTRO_STORAGE_KEY = "ddukson-video-intro-seen";

function shouldSkipIntro() {
  const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      navigation?.type === "back_forward" || window.scrollY > 0) return true;

  if (window.location.hash) {
    try {
      const target = decodeURIComponent(window.location.hash.slice(1));
      if (document.getElementById(target) || target.includes(":~:text=")) return true;
    } catch {
      // An unreadable fragment must not prevent access to the requested page.
      return true;
    }
  }

  try {
    if (window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "true") return true;
    // Count the visit when playback starts, including interrupted introductions.
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
  } catch {
    // Keep the homepage usable when the browser disallows session storage.
    return true;
  }
  return false;
}

// Keep the server-rendered homepage in place; remove only the finished overlay.
export function VideoIntro() {
  const [state, setState] = useState<"pending" | "playing" | "finished" | "skipped">("pending");
  const finish = useCallback(() => setState("finished"), []);
  const skip = useCallback(() => setState("skipped"), []);

  useEffect(() => {
    // SSR and hydration both expose the homepage before browser-only policy checks.
    const frame = requestAnimationFrame(() => {
      setState(shouldSkipIntro() ? "skipped" : "playing");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      {state === "finished" ? (
        <BrandNoticePopup delayMs={POPUP_DELAY_MS} />
      ) : state === "playing" ? (
        <VideoIntroPlayer onComplete={finish} onSkip={skip} />
      ) : null}
      <noscript>
        <style>{`[data-video-intro] { display: none !important; }`}</style>
      </noscript>
    </>
  );
}

function forceMuted(video: HTMLVideoElement) {
  if (!video.defaultMuted) video.defaultMuted = true;
  if (!video.muted) video.muted = true;
  if (video.volume !== 0) video.volume = 0;
}

function VideoIntroPlayer({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealingRef = useRef(false);
  const [phase, setPhase] = useState<"loading" | "playing" | "revealing">("loading");
  const reducedMotion = useReducedMotion();
  const fadeDuration = reducedMotion ? 0.15 : FADE_DURATION;
  const reveal = useCallback(() => {
    if (revealingRef.current) return;
    revealingRef.current = true;
    videoRef.current?.pause();
    setPhase("revealing");
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const overlay = overlayRef.current;
    const previous = {
      rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow,
      gutter: root.style.scrollbarGutter,
    };
    const previousFocus = document.activeElement;
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    // Block input without changing the page geometry used by scroll animations.
    const preventScroll = (event: Event) => event.preventDefault();
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) onSkip();
    };
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("hashchange", onSkip);

    const syncViewport = () => {
      if (overlay) overlay.style.width = `${window.innerWidth}px`;
    };
    syncViewport();
    window.addEventListener("resize", syncViewport);

    const siblings = [...(overlay?.parentElement?.children ?? [])]
      .filter((element): element is HTMLElement =>
        element instanceof HTMLElement && element !== overlay && element.tagName !== "NOSCRIPT")
      .map((element) => ({ element, inert: element.inert }));
    for (const { element } of siblings) element.inert = true;
    overlay?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        reveal();
      } else if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"].includes(event.key)) {
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      root.style.overflow = previous.rootOverflow;
      body.style.overflow = previous.bodyOverflow;
      root.style.scrollbarGutter = previous.gutter;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("hashchange", onSkip);
      for (const { element, inert } of siblings) element.inert = inert;
      window.removeEventListener("resize", syncViewport);
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus !== body && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [onSkip, reveal]);

  useEffect(() => {
    if (!reducedMotion) return;
    const frame = requestAnimationFrame(onSkip);
    return () => cancelAnimationFrame(frame);
  }, [onSkip, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || revealingRef.current) return;
    let active = true;
    let watchdog: ReturnType<typeof setTimeout>;
    const resetWatchdog = () => {
      clearTimeout(watchdog);
      if (!revealingRef.current) watchdog = setTimeout(reveal, PLAYBACK_TIMEOUT_MS);
    };
    const markPlaying = () => {
      forceMuted(video);
      if (!revealingRef.current) setPhase("playing");
      resetWatchdog();
    };
    const keepMuted = () => forceMuted(video);
    video.addEventListener("playing", markPlaying);
    video.addEventListener("timeupdate", resetWatchdog);
    video.addEventListener("volumechange", keepMuted);
    video.addEventListener("ended", reveal);
    video.addEventListener("error", reveal);

    // Select once per visit: download one video and keep playback steady on resize.
    const layout = window.matchMedia("(max-width: 899px)").matches ? "mobile" : "pc";
    if (overlay) overlay.dataset.introLayout = layout;
    forceMuted(video);
    video.src = VIDEO_SOURCES[layout];
    resetWatchdog();
    void video.play().catch(() => {
      if (active) reveal();
    });

    return () => {
      active = false;
      clearTimeout(watchdog);
      video.removeEventListener("playing", markPlaying);
      video.removeEventListener("timeupdate", resetWatchdog);
      video.removeEventListener("volumechange", keepMuted);
      video.removeEventListener("ended", reveal);
      video.removeEventListener("error", reveal);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [reveal]);

  useEffect(() => {
    if (phase !== "revealing") return;
    // Restore the page even if an animation callback is interrupted.
    const timeout = setTimeout(onComplete, fadeDuration * 1000 + 200);
    return () => clearTimeout(timeout);
  }, [phase, fadeDuration, onComplete]);

  return (
    <motion.div
      ref={overlayRef}
      className={styles.overlay}
      data-video-intro
      data-intro-state={phase}
      role="status"
      aria-label="뚝손국밥 브랜드 소개"
      tabIndex={-1}
      initial={false}
      animate={{ opacity: phase === "revealing" ? 0 : 1 }}
      transition={{ duration: fadeDuration, ease: [0.22, 0.61, 0.36, 1] }}
      onAnimationComplete={() => {
        if (phase === "revealing") onComplete();
      }}
    >
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
      />
    </motion.div>
  );
}
