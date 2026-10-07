"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { menuOrbitAnimation, menuOrbitCopy, menuOrbitItems } from "./menuOrbit.config";
import { getCopyFrame, getOrbitFrame, type OrbitGeometry } from "./menuOrbit.utils";
import styles from "./MenuOrbitSection.module.css";

export function MenuOrbitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;
    const stage = stageRef.current;
    if (!section || !visual || !stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add({ reduce: "(prefers-reduced-motion: reduce)", animate: "(prefers-reduced-motion: no-preference)" }, (mediaContext) => {
        const reducedMotion = !!mediaContext.conditions?.reduce;
        const bowls = [...stage.querySelectorAll<HTMLElement>("[data-orbit-bowl]")];
        const statements = [...section.querySelectorAll<HTMLElement>("[data-orbit-copy]")];
        const driver = { progress: reducedMotion ? 1 : 0 };
        let geometry: OrbitGeometry = { radiusX: 0, radiusY: 0 };
        let frame = 0;
        let reservedBottom = -1;

        // CSS sticky supplies the pin; ScrollTrigger only scrubs the transforms.
        if (!reducedMotion) section.dataset.orbitAnimated = "true";
        // Fade the group so overlapping dishes keep their natural silhouettes.
        gsap.set(stage, { opacity: 1 });
        gsap.set(bowls, { x: 0, y: 0, xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
        gsap.set(statements, { opacity: 1, y: 0 });
        const stageOpacity = gsap.quickSetter(stage, "opacity");
        const bowlSetters = bowls.map((bowl) => ({
          x: gsap.quickSetter(bowl, "x", "px"),
          y: gsap.quickSetter(bowl, "y", "px"),
          scaleX: gsap.quickSetter(bowl, "scaleX"),
          scaleY: gsap.quickSetter(bowl, "scaleY"),
        }));
        const copySetters = statements.map((statement) => ({
          y: gsap.quickSetter(statement, "y", "px"),
          opacity: gsap.quickSetter(statement, "opacity"),
        }));

        const render = () => {
          bowlSetters.forEach((setters, index) => {
            const next = getOrbitFrame(driver.progress, menuOrbitItems[index], geometry);
            setters.x(next.x);
            setters.y(next.y);
            setters.scaleX(next.scale);
            setters.scaleY(next.scale);
            if (index === 0) stageOpacity(next.opacity);
          });
          const copy = getCopyFrame(driver.progress);
          copySetters.forEach((setters) => {
            setters.y(copy.y);
            setters.opacity(copy.opacity);
          });
        };

        const measure = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          // Reserve the existing inquiry desk, including its expanded mobile state.
          const desk = document.getElementById("quick-inquiry-panel");
          const toggle = document.querySelector<HTMLElement>('button[aria-label="빠른 가맹문의 열기"]');
          const overlay = desk ?? toggle;
          const overlayBottom = overlay ? parseFloat(getComputedStyle(overlay).bottom) || 0 : 0;
          const bottom = Math.ceil(overlay ? overlay.offsetHeight + overlayBottom + 18 : 24);
          if (bottom !== reservedBottom) {
            reservedBottom = bottom;
            section.style.setProperty("--orbit-bottom", `${bottom}px`);
          }
          const safeHeight = visual.clientHeight - parseFloat(getComputedStyle(visual).paddingTop) - bottom;
          section.dataset.orbitCompact = String(safeHeight < 320);
          const edge = parseFloat(getComputedStyle(stage).getPropertyValue("--orbit-edge")) || 8;
          const size = bowls[0]?.offsetWidth ?? 0;
          const compact = window.matchMedia("(max-width: 899px)").matches;
          const maxScale = compact ? menuOrbitAnimation.compactInitialScale : menuOrbitAnimation.initialScale;
          geometry = {
            radiusX: Math.max(0, (stage.clientWidth - size * maxScale) / 2 - edge),
            radiusY: Math.max(0, (stage.clientHeight - size * maxScale) / 2 - edge),
            compact,
            narrow: window.matchMedia("(max-width: 599px)").matches,
            clearanceY: !compact
              ? Math.max(...statements.map((statement) => statement.offsetHeight)) / 2 + size / 2 + 8
              : 0,
          };
          render();
        };
        const scheduleMeasure = () => {
          if (!frame) frame = requestAnimationFrame(measure);
        };
        const observer = new ResizeObserver(scheduleMeasure);
        const observeOverlays = () => {
          observer.disconnect();
          observer.observe(visual);
          observer.observe(stage);
          if (bowls[0]) observer.observe(bowls[0]);
          statements.forEach((statement) => observer.observe(statement));
          const desk = document.getElementById("quick-inquiry-panel");
          const toggle = document.querySelector<HTMLElement>('button[aria-label="빠른 가맹문의 열기"]');
          if (desk) observer.observe(desk);
          if (toggle) observer.observe(toggle);
          scheduleMeasure();
        };
        const mutationObserver = new MutationObserver(observeOverlays);
        if (section.parentElement?.parentElement) {
          mutationObserver.observe(section.parentElement.parentElement, { childList: true });
        }
        observeOverlays();
        measure();

        // The static reduced-motion layout still needs landscape overlay sizing.
        const visibilityObserver = reducedMotion ? new IntersectionObserver((entries) => {
          section.dataset.orbitActive = String(entries[0].isIntersecting);
        }) : null;
        visibilityObserver?.observe(section);

        if (!reducedMotion) {
          gsap.to(driver, {
            progress: 1,
            duration: 1,
            ease: "none",
            onUpdate: render,
            scrollTrigger: {
              id: "ddukson-menu-orbit",
              trigger: section,
              start: "top top",
              end: () => `+=${Math.max(1, section.offsetHeight - visual.offsetHeight)}`,
              scrub: true,
              invalidateOnRefresh: true,
              onRefresh: measure,
              onToggle: (self) => {
                section.dataset.orbitActive = String(self.isActive);
                bowls.forEach((bowl) => { bowl.style.willChange = self.isActive ? "transform, opacity" : "auto"; });
              },
            },
          });
        }

        return () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          mutationObserver.disconnect();
          visibilityObserver?.disconnect();
          delete section.dataset.orbitAnimated;
          delete section.dataset.orbitActive;
          delete section.dataset.orbitCompact;
          section.style.removeProperty("--orbit-bottom");
          bowls.forEach((bowl) => { bowl.style.removeProperty("will-change"); });
        };
      });
    }, section);

    // Reverts the tween, ScrollTrigger, matchMedia listeners and DOM transforms.
    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="menu-orbit" className={styles.section} aria-labelledby="menu-orbit-title">
      <h2 id="menu-orbit-title" className="sr-only">한 그릇에 담은 뚝손의 맛</h2>
      <div ref={visualRef} className={styles.visual}>
        <p className={styles.eyebrow}>DDUKSON · ONE BOWL, FULL OF FLAVOR</p>
        <div className={styles.composition}>
          <div ref={stageRef} className={styles.stage}>
            {menuOrbitItems.map((item) => (
              <div
                key={item.id}
                className={styles.bowl}
                data-orbit-bowl={item.id}
                style={{
                  "--orbit-x": Math.cos(item.angle * Math.PI / 180).toFixed(6),
                  "--orbit-y": Math.sin(item.angle * Math.PI / 180).toFixed(6),
                  "--orbit-y-absolute": Math.abs(Math.sin(item.angle * Math.PI / 180)).toFixed(6),
                  "--orbit-y-sign": Math.sign(Math.sin(item.angle * Math.PI / 180)),
                  "--compact-x": (item.compactPosition.x * Math.SQRT1_2).toFixed(6),
                  "--compact-y": (item.compactPosition.y * Math.SQRT1_2).toFixed(6),
                } as CSSProperties}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(max-width: 599px) 36vw, (max-width: 899px) 32vw, (max-width: 1199px) 26vw, 440px"
                  className={styles.image}
                />
              </div>
            ))}
          </div>
          <div className={styles.copy}>
            {menuOrbitCopy.map((item) => (
              <p key={item.id} data-orbit-copy={item.id} className={styles.statement}>
                {item.lines.map((line) => <span key={line}>{line}</span>)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
