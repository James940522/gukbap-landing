"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./BrandNoticePopup.module.css";

const notices = [
  {
    id: "founder",
    storageKey: "ddukson-founder-notice-hidden-until",
    image: "/images/popup/founder-message-v2.png",
    title: "뚝손국밥 대표의 이야기",
    alt: "뚝손국밥 대표가 전하는 가맹점주와 함께하는 프랜차이즈의 기준",
    paragraphs: [
      "뚝손국밥 대표는, 가맹점주로 장사를 먼저 했던 사람입니다.",
      "본사에서 장사를 배운 사람이 아니라, 직접 매장을 운영하며 현장을 경험한 가맹점주 출신입니다.",
      "임대료, 인건비, 식자재 원가, 매출에 대한 압박까지. 매일 반복되는 장사의 현실과 점주가 무엇 때문에 힘들어하는지 누구보다 잘 알고 있습니다.",
      "그래서 뚝손국밥은 ‘본사가 편한 구조’가 아니라, ‘점주가 살아남을 수 있는 구조’를 먼저 고민했습니다.",
      "매출만 높은 매장이 아닌, 실제로 수익이 남고 오래 운영할 수 있는 매장.",
      "그것이 뚝손국밥이 만들고자 하는 프랜차이즈의 기준입니다.",
    ],
  },
  {
    id: "strength",
    storageKey: "ddukson-brand-strength-notice-hidden-until",
    image: "/images/popup/brand-strength.png",
    title: "뚝손국밥의 브랜드 저력",
    alt: "뚝손국밥 × 오늘은 오므라이스, 불경기에도 성장하는 브랜드",
    paragraphs: [
      "현재 브랜드 운영 수 300호점 이상.",
      "뚝손국밥 × 오늘은 오므라이스. 불경기에도 성장하는 브랜드.",
      "저희 뚝손국밥은 저력이 있는 회사입니다.",
    ],
  },
];

// Mounted after the fullscreen intro has unmounted; wait before opening the modal.
export function BrandNoticePopup({ delayMs = 0 }: { delayMs?: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [readyIds, setReadyIds] = useState<string[]>([]);
  const [hideToday, setHideToday] = useState<Record<string, boolean>>({});
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const reducedMotion = useReducedMotion();
  const remaining = notices.filter((notice) => !dismissedIds.includes(notice.id));
  const firstId = remaining[0]?.id;
  const canOpen = delayElapsed && remaining.length > 0 &&
    remaining.every((notice) => readyIds.includes(notice.id));

  useEffect(() => {
    const timeout = setTimeout(() => {
      const hiddenIds = notices.filter((notice) => {
        try {
          const hiddenUntil = Number(window.localStorage.getItem(notice.storageKey));
          return Number.isFinite(hiddenUntil) && hiddenUntil > Date.now();
        } catch {
          // A blocked storage API must not prevent viewing or closing notices.
          return false;
        }
      }).map((notice) => notice.id);
      setDismissedIds((ids) => [...new Set([...ids, ...hiddenIds])]);
      setDelayElapsed(true);
    }, delayMs);
    return () => clearTimeout(timeout);
  }, [delayMs]);

  useEffect(() => {
    if (!canOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = "stable";
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousGutter;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [canOpen]);

  useEffect(() => {
    if (canOpen) {
      dialogRef.current?.querySelector<HTMLButtonElement>("[data-notice-close]")
        ?.focus({ preventScroll: true });
    }
  }, [canOpen, firstId, dismissedIds]);

  function closePopup(id: string) {
    const notice = notices.find((item) => item.id === id);
    if (notice && hideToday[id]) {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      try {
        window.localStorage.setItem(notice.storageKey, String(tomorrow.getTime()));
      } catch {
        // Closing still works when browser storage is unavailable.
      }
    }
    setDismissedIds((ids) => [...new Set([...ids, id])]);
  }

  return (
    <motion.dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="뚝손국밥 브랜드 안내"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
      animate={canOpen ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      onCancel={(event) => {
        event.preventDefault();
        const focusedId = document.activeElement?.closest<HTMLElement>("[data-notice-id]")
          ?.dataset.noticeId;
        if (focusedId || firstId) closePopup(focusedId ?? firstId!);
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget || !firstId) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom
        ) closePopup(firstId);
      }}
    >
      <div className={styles.notices}>
        {remaining.map((notice) => (
          <section key={notice.id} className={styles.content}
            data-notice-id={notice.id} aria-label={notice.title}>
            <figure className={styles.poster}>
              <Image
                src={notice.image}
                alt={notice.alt}
                width={1024}
                height={1536}
                className={styles.image}
                loading="eager"
                unoptimized
                onLoad={() => setReadyIds((ids) => [...new Set([...ids, notice.id])])}
                onError={() => setDismissedIds((ids) => [...new Set([...ids, notice.id])])}
              />
              <figcaption className="sr-only">
                {notice.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </figcaption>
            </figure>
            <div className={styles.controls}>
              <label className={styles.hideToday}>
                <input
                  type="checkbox"
                  checked={hideToday[notice.id] ?? false}
                  onChange={(event) => setHideToday((values) => ({
                    ...values, [notice.id]: event.target.checked,
                  }))}
                />
                <span>오늘 하루 열지 않기</span>
              </label>
              <button type="button" className={styles.close} data-notice-close
                aria-label={`${notice.title} 닫기`} onClick={() => closePopup(notice.id)}>
                닫기
              </button>
            </div>
          </section>
        ))}
      </div>
    </motion.dialog>
  );
}
