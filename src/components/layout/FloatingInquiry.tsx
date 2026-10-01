"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { brand } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import { sanitizePhoneInput, validateInquiry, type InquiryErrors } from "@/lib/inquiry";
import styles from "./FloatingInquiry.module.css";

const mobileQuery = "(max-width: 899px)";
const fields = [
  { name: "name", label: "성함", type: "text", autoComplete: "name", maxLength: 50 },
  { name: "phone", label: "연락처", type: "tel", autoComplete: "tel", maxLength: 13 },
  { name: "region", label: "희망 지역", type: "text", autoComplete: "address-level2", maxLength: 100 },
] as const;

function subscribeToMobile(onChange: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getMobileSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

function getServerSnapshot() {
  return false;
}

// Adapted from udon-landing / omurice-landing's FloatingInquiry:
// hero-triggered visibility, contact/footer suppression and a collapsible mobile desk.
export function FloatingInquiry() {
  const isMobile = useSyncExternalStore(subscribeToMobile, getMobileSnapshot, getServerSnapshot);
  const reducedMotion = useReducedMotion();
  const [hasPassedHero, setHasPassedHero] = useState(false);
  const [nearContact, setNearContact] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const [hasUserCollapsed, setHasUserCollapsed] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", region: "" });
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [checked, setChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreToggleFocus = useRef(false);
  const focusPanel = useRef(false);
  const shouldShow = hasPassedHero && !nearContact && !nearFooter;
  const isExpanded = !isMobile || !hasUserCollapsed;

  useEffect(() => {
    const hero = document.getElementById("hero");
    let frame = 0;
    const syncPassedHero = () => {
      frame = 0;
      const passed = hero
        ? hero.getBoundingClientRect().bottom <= window.innerHeight * 0.18
        : window.scrollY > window.innerHeight * 0.8;
      setHasPassedHero(passed);
      if (!passed) setHasUserCollapsed(false);
    };
    const scheduleSync = () => {
      if (!frame) frame = requestAnimationFrame(syncPassedHero);
    };
    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, []);

  useEffect(() => {
    const contact = document.getElementById("inquiry");
    const footer = document.getElementById("footer");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === contact) setNearContact(entry.isIntersecting);
        if (entry.target === footer) setNearFooter(entry.isIntersecting);
      }
    }, { threshold: 0, rootMargin: "0px 0px -96px 0px" });
    if (contact) observer.observe(contact);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobile || !isExpanded || !shouldShow) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (document.querySelector(".mobile-nav:not([hidden])")) return;
      restoreToggleFocus.current = !!formRef.current?.contains(document.activeElement);
      setHasUserCollapsed(true);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobile, isExpanded, shouldShow]);

  function collapse() {
    restoreToggleFocus.current = true;
    setHasUserCollapsed(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateInquiry(new FormData(event.currentTarget));
    setErrors(nextErrors);
    setChecked(Object.keys(nextErrors).length === 0);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError)
      formRef.current?.querySelector<HTMLInputElement>(`[name="${firstError}"]`)?.focus();
    // This project has no lead endpoint yet. Match the existing inquiry preview:
    // validate locally, without transmitting or persisting personal information.
  }

  const transition = { duration: reducedMotion ? 0 : 0.3, ease: "easeOut" as const };

  return (
    <AnimatePresence mode="wait">
      {shouldShow && (
        isMobile && !isExpanded ? (
          <motion.button
            key="quick-inquiry-toggle"
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-label="빠른 가맹문의 열기"
            aria-expanded={false}
            aria-controls="quick-inquiry-panel"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
            transition={transition}
            onAnimationComplete={() => {
              if (restoreToggleFocus.current) {
                toggleRef.current?.focus({ preventScroll: true });
                restoreToggleFocus.current = false;
              }
            }}
            onClick={() => {
              focusPanel.current = true;
              setHasUserCollapsed(false);
            }}
          >
            <span>
              <span className={styles.eyebrow}>FRANCHISE DESK</span>
              <strong>빠른 가맹문의</strong>
            </span>
            <span className={styles.toggleAction}>열기<ArrowIcon /></span>
          </motion.button>
        ) : (
          <motion.aside
            key={isMobile ? "quick-inquiry-mobile" : "quick-inquiry-desktop"}
            id="quick-inquiry-panel"
            className={styles.desk}
            aria-label="빠른 가맹문의"
            initial={{ opacity: 0, y: reducedMotion ? 0 : "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : "100%" }}
            transition={transition}
            onAnimationComplete={() => {
              if (focusPanel.current) {
                closeRef.current?.focus({ preventScroll: true });
                focusPanel.current = false;
              }
            }}
          >
            <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate onChange={() => setChecked(false)}>
              {isMobile && (
                <button
                  ref={closeRef}
                  className={styles.close}
                  type="button"
                  onClick={collapse}
                  aria-label="빠른 가맹문의 접기"
                  aria-expanded={true}
                  aria-controls="quick-inquiry-panel"
                >
                  <span aria-hidden="true" />
                  접기<ArrowIcon />
                </button>
              )}
              <div className={styles.identity}>
                <div>
                  <p className={styles.eyebrow}>FRANCHISE DESK</p>
                  <h2>빠른 가맹문의</h2>
                </div>
                <a href={brand.phoneHref} className={styles.phone}>{brand.phone}</a>
              </div>
              {fields.map((field) => (
                <div key={field.name} className={styles.field}>
                  <label className="sr-only" htmlFor={`quick-inquiry-${field.name}`}>{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    maxLength={field.maxLength}
                    id={`quick-inquiry-${field.name}`}
                    placeholder={field.label}
                    value={formData[field.name]}
                    onChange={(event) => setFormData((previous) => ({
                      ...previous,
                      [field.name]: field.name === "phone" ? sanitizePhoneInput(event.target.value) : event.target.value,
                    }))}
                    required
                    aria-invalid={!!errors[field.name]}
                    aria-describedby={errors[field.name] ? `quick-${field.name}-error` : undefined}
                  />
                  {errors[field.name] && <p id={`quick-${field.name}-error`} className={styles.error}>{errors[field.name]}</p>}
                </div>
              ))}
              <div className={styles.consent}>
                <label>
                  <input
                    type="checkbox"
                    name="consent"
                    checked={privacyAgree}
                    onChange={(event) => setPrivacyAgree(event.target.checked)}
                    required
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? "quick-consent-error" : "quick-inquiry-notice"}
                  />
                  개인정보 동의
                </label>
                {errors.consent && <p id="quick-consent-error" className={styles.error}>{errors.consent}</p>}
              </div>
              <button type="submit" className={`button button-primary ${styles.submit}`}>
                상담 내용 확인<ArrowIcon />
              </button>
              <p id="quick-inquiry-notice" className={styles.notice}>
                온라인 접수 준비 중 · 입력 정보는 전송·저장되지 않습니다.
              </p>
              <div className={styles.status} role="status" aria-live="polite">
                {checked && <p>입력 내용을 확인했습니다. 아직 접수되지 않았으니 <a href={brand.phoneHref}>전화 상담</a>으로 문의해주세요.</p>}
              </div>
            </form>
          </motion.aside>
        )
      )}
    </AnimatePresence>
  );
}
