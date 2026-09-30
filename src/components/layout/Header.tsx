"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { navigation } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import brandLogo from "../../../public/images/logos/ddukson-gukbap.png";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const desktop = window.matchMedia("(min-width: 900px)");
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", onResize);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [menuOpen]);

  return (
    <header
      className={`site-header ${scrolled || menuOpen ? "header-solid" : ""}`}
    >
      <div className="container header-inner">
        <a
          href="#top"
          className="wordmark"
          aria-label="뚝손국밥 처음으로"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src={brandLogo}
            alt="뚝손국밥"
            className="header-logo"
            sizes="(max-width: 599px) 126px, 152px"
            priority
          />
        </a>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            href="#inquiry"
            className="button button-primary header-cta"
            onClick={() => setMenuOpen(false)}
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
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="모바일 메뉴"
        hidden={!menuOpen}
      >
        <div className="container">
          {navigation.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              <span className="mobile-nav-number">0{i + 1}</span>
              {item.label}
              <ArrowIcon />
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
