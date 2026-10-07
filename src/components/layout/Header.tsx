"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { brand, navigation } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import brandLogo from "../../../public/images/logos/ddukson-gukbap.png";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasPassedHeroMidpoint, setHasPassedHeroMidpoint] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const visible = hasPassedHeroMidpoint || menuOpen;

  useEffect(() => {
    const hero = document.getElementById("hero");
    const sections = [...navigation.map((item) => item.href), "#inquiry"]
      .map((href) => ({ href, element: document.getElementById(href.slice(1)) }));
    let frame = 0;
    const syncPosition = () => {
      frame = 0;
      const heroBounds = hero?.getBoundingClientRect();
      setHasPassedHeroMidpoint(heroBounds
        ? heroBounds.top + heroBounds.height / 2 <= 0
        : window.scrollY >= window.innerHeight / 2);
      let current = "";
      for (const section of sections) {
        if (section.element && section.element.getBoundingClientRect().top <= 120)
          current = section.href;
      }
      setActiveHref(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(syncPosition);
    };
    const desktop = window.matchMedia("(min-width: 900px)");
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false);
      onScroll();
    };
    const heroResizeObserver = new ResizeObserver(onScroll);
    if (hero) heroResizeObserver.observe(hero);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktop.addEventListener("change", onResize);
    return () => {
      cancelAnimationFrame(frame);
      heroResizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <motion.header
      className={`site-header ${visible ? "header-visible header-solid" : ""}`}
      aria-hidden={!visible}
      initial={false}
      animate={{ y: visible || reducedMotion ? 0 : "-100%", opacity: visible ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <div className="container header-inner">
        <div className="header-brand">
          <a
            href="#top"
            className="wordmark"
            aria-label="뚝손국밥 처음으로"
          >
            <Image
              src={brandLogo}
              alt="뚝손국밥"
              className="header-logo"
              sizes="(max-width: 599px) 104px, 124px"
              priority
            />
          </a>
          <div className="header-brand-note">
            <span>뚝손국밥</span>
            <p>한 그릇을 제대로.</p>
          </div>
        </div>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} aria-current={activeHref === item.href ? "location" : undefined}>
              <span className="header-nav-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            href="#inquiry"
            className="button button-primary header-cta"
            aria-current={activeHref === "#inquiry" ? "location" : undefined}
          >
            창업 문의
            <ArrowIcon />
          </a>
          <button
            ref={toggleRef}
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && <MobileNavigation activeHref={activeHref} returnFocusRef={toggleRef} onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </motion.header>
  );
}

function MobileNavigation({ activeHref, onClose, returnFocusRef }: {
  activeHref: string;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const returnFocusTarget = returnFocusRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
      // Wait for the browser to remove the modal's inert state before restoring focus.
      requestAnimationFrame(() => {
        if (window.matchMedia("(max-width: 899px)").matches)
          returnFocusTarget?.focus({ preventScroll: true });
      });
    };
  }, [returnFocusRef]);

  return (
    <motion.dialog
      ref={dialogRef}
      id="mobile-navigation"
      className="mobile-nav"
      aria-label="뚝손국밥 전체 메뉴"
      initial={{ x: reducedMotion ? 0 : "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: reducedMotion ? 0 : "100%", opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
        if (event.key === "Tab") {
          const links = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
          const first = links[0];
          const last = links[links.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
      }}
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.target === event.currentTarget && event.clientX < bounds.left) onClose();
      }}
    >
      <div className="mobile-menu-content">
        <div className="mobile-menu-heading">
          <span className="mobile-menu-eyebrow">뚝손국밥</span>
          <button ref={closeRef} type="button" className="mobile-menu-close" aria-label="메뉴 닫기" onClick={onClose}>
            <span /><span />
          </button>
          <p className="display-font">한 그릇을<br />제대로.</p>
        </div>
        <nav className="mobile-menu-links" aria-label="모바일 메뉴">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} onClick={onClose} aria-current={activeHref === item.href ? "location" : undefined}>
              <span className="mobile-nav-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
              <ArrowIcon />
            </a>
          ))}
        </nav>
        <div className="mobile-menu-footer">
          <p>함께할 다음 한 그릇.</p>
          <a href="#inquiry" className="button button-primary" onClick={onClose}>창업 문의<ArrowIcon /></a>
          <div><span>산본에프앤비</span><a href={brand.phoneHref}>{brand.phone}</a></div>
        </div>
      </div>
    </motion.dialog>
  );
}
