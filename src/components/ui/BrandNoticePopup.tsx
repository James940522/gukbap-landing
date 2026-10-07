"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./BrandNoticePopup.module.css";

const HIDDEN_UNTIL_KEY = "ddukson-founder-notice-hidden-until";

// Mounted after the fullscreen intro has unmounted; wait before opening the modal.
export function BrandNoticePopup({ delayMs = 0 }: { delayMs?: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [imageReady, setImageReady] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [delayElapsed, setDelayElapsed] = useState(delayMs === 0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const timeout = setTimeout(() => setDelayElapsed(true), delayMs);
    return () => clearTimeout(timeout);
  }, [delayMs]);

  useEffect(() => {
    if (!imageReady || !delayElapsed || dismissed) return;

    try {
      const hiddenUntil = Number(window.localStorage.getItem(HIDDEN_UNTIL_KEY));
      if (Number.isFinite(hiddenUntil) && hiddenUntil > Date.now()) return;
    } catch {
      // A blocked storage API must not prevent viewing or closing the notice.
    }

    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = "stable";
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousGutter;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [imageReady, delayElapsed, dismissed]);

  function closePopup() {
    if (hideToday) {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      try {
        window.localStorage.setItem(HIDDEN_UNTIL_KEY, String(tomorrow.getTime()));
      } catch {
        // Closing still works when browser storage is unavailable.
      }
    }
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <motion.dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="뚝손국밥 대표의 이야기"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
      animate={imageReady && delayElapsed ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      onCancel={(event) => {
        event.preventDefault();
        closePopup();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom
        ) closePopup();
      }}
    >
      <div className={styles.content}>
        <figure className={styles.poster}>
          <Image
            src="/images/popup/founder-message-v2.png"
            alt="뚝손국밥 대표가 전하는 가맹점주와 함께하는 프랜차이즈의 기준"
            width={1024}
            height={1536}
            className={styles.image}
            loading="eager"
            unoptimized
            onLoad={() => setImageReady(true)}
            onError={() => setDismissed(true)}
          />
          <figcaption className="sr-only">
            <p>뚝손국밥 대표는, 가맹점주로 장사를 먼저 했던 사람입니다.</p>
            <p>본사에서 장사를 배운 사람이 아니라, 직접 매장을 운영하며 현장을 경험한 가맹점주 출신입니다.</p>
            <p>임대료, 인건비, 식자재 원가, 매출에 대한 압박까지. 매일 반복되는 장사의 현실과 점주가 무엇 때문에 힘들어하는지 누구보다 잘 알고 있습니다.</p>
            <p>그래서 뚝손국밥은 ‘본사가 편한 구조’가 아니라, ‘점주가 살아남을 수 있는 구조’를 먼저 고민했습니다.</p>
            <p>매출만 높은 매장이 아닌, 실제로 수익이 남고 오래 운영할 수 있는 매장.</p>
            <p>그것이 뚝손국밥이 만들고자 하는 프랜차이즈의 기준입니다.</p>
          </figcaption>
        </figure>
        <div className={styles.controls}>
          <label className={styles.hideToday}>
            <input
              type="checkbox"
              checked={hideToday}
              onChange={(event) => setHideToday(event.target.checked)}
            />
            <span>오늘 하루 열지 않기</span>
          </label>
          <button ref={closeRef} type="button" className={styles.close} onClick={closePopup}>
            닫기
          </button>
        </div>
      </div>
    </motion.dialog>
  );
}
