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

// Keep the server-rendered homepage in place; remove only the finished overlay.
export function VideoIntro() {
  const [finished, setFinished] = useState(false);
  const finish = useCallback(() => setFinished(true), []);

  return (
    <>
      {finished ? (
        <BrandNoticePopup delayMs={POPUP_DELAY_MS} />
      ) : (
        <VideoIntroPlayer onComplete={finish} />
      )}
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

function VideoIntroPlayer({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealingRef = useRef(false);
  const [phase, setPhase] = useState<"loading" | "playing" | "revealing">("loading");
  const reducedMotion = useReducedMotion();
  const fadeDuration = reducedMotion ? 0.15 : FADE_DURATION;
  const reveal = useCallback(() => {
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
      if (event.key !== "Escape") return;
      event.preventDefault();
      reveal();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      root.style.overflow = previous.rootOverflow;
      body.style.overflow = previous.bodyOverflow;
      root.style.scrollbarGutter = previous.gutter;
      for (const { element, inert } of siblings) element.inert = inert;
      window.removeEventListener("resize", syncViewport);
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus !== body && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [reveal]);

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
