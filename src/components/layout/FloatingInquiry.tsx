"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { brand } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import { sanitizePhoneInput, inquiryPrivacyNotice } from "@/lib/inquiry";
import { useInquirySubmission } from "@/lib/useInquirySubmission";
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

function subscribeToMenuOrbit(onChange: () => void) {
  const section = document.getElementById("menu-orbit");
  if (!section) return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(section, { attributes: true, attributeFilter: ["data-orbit-active"] });
  return () => observer.disconnect();
}

function getMenuOrbitSnapshot() {
  return document.getElementById("menu-orbit")?.dataset.orbitActive === "true";
}

// Adapted from udon-landing / omurice-landing's FloatingInquiry:
// hero-triggered visibility, contact/footer suppression and a collapsible mobile desk.
export function FloatingInquiry() {
  const isMobile = useSyncExternalStore(subscribeToMobile, getMobileSnapshot, getServerSnapshot);
  const isMenuOrbitActive = useSyncExternalStore(subscribeToMenuOrbit, getMenuOrbitSnapshot, getServerSnapshot);
  const reducedMotion = useReducedMotion();
  const [hasPassedHero, setHasPassedHero] = useState(false);
  const [nearContact, setNearContact] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const [hasUserCollapsed, setHasUserCollapsed] = useState(false);
  const [hasUserOpened, setHasUserOpened] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", region: "" });
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const { formRef, errors, isSubmitting, status, handleSubmit: submitInquiry } = useInquirySubmission("floating");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreToggleFocus = useRef(false);
  const focusPanel = useRef(false);
  const shouldShow = hasPassedHero && !nearContact && !nearFooter;
  // Give the food space on mobile while preserving an explicitly opened form.
  const isExpanded = !isMobile || (!hasUserCollapsed && (!isMenuOrbitActive || hasUserOpened));

  useEffect(() => {
    const hero = document.getElementById("hero");
    let frame = 0;
    const syncPassedHero = () => {
      frame = 0;
      const passed = hero
        ? hero.getBoundingClientRect().bottom <= window.innerHeight * 0.18
        : window.scrollY > window.innerHeight * 0.8;
      setHasPassedHero(passed);
      if (!passed) {
        setHasUserCollapsed(false);
        setHasUserOpened(false);
      }
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
  }, [isMobile, isExpanded, shouldShow, formRef]);

  function collapse() {
    restoreToggleFocus.current = true;
    setHasUserCollapsed(true);
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
              setHasUserOpened(true);
              setHasUserCollapsed(false);
            }}
          >
            <span>
              <span className={styles.eyebrow}>창업 상담</span>
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
            <form ref={formRef} className={styles.form} onSubmit={async (event) => {
              if (await submitInquiry(event)) {
                setFormData({ name: "", phone: "", region: "" });
                setPrivacyAgree(false);
              }
            }} noValidate aria-busy={isSubmitting} onFocus={() => setHasUserOpened(true)}>
              <input className="inquiry-honeypot" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
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
                  <p className={styles.eyebrow}>창업 상담</p>
                  <h2>빠른 가맹문의</h2>
                </div>
                <a href={brand.phoneHref} className={styles.phone}>{brand.phone}</a>
              </div>
              {fields.map((field) => (
                <div key={field.name} className={styles.field}>
                  <label className="sr-only" htmlFor={`quick-inquiry-${field.name}`}>{field.label}</label>
                  <input
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    type="checkbox"
                    name="consent"
                    checked={privacyAgree}
                    onChange={(event) => setPrivacyAgree(event.target.checked)}
                    required
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? "quick-consent-error" : "quick-inquiry-notice"}
                  />
                  <span title={inquiryPrivacyNotice}>개인정보 동의</span>
                </label>
                {errors.consent && <p id="quick-consent-error" className={styles.error}>{errors.consent}</p>}
              </div>
              <button disabled={isSubmitting} type="submit" className={`button button-primary ${styles.submit}`}>
                {isSubmitting ? "접수 중…" : "가맹문의 신청"}<ArrowIcon />
              </button>
              <p id="quick-inquiry-notice" className={styles.notice}>
                <a href="#inquiry">개인정보 수집·이용 안내</a> · 담당자에게 문자로 전달됩니다.
              </p>
              <div className={styles.status} role="status" aria-live="polite">
                {status && <p>{status}</p>}
              </div>
            </form>
          </motion.aside>
        )
      )}
    </AnimatePresence>
  );
}
