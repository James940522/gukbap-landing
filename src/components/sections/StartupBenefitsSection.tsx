"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { startupBenefits } from "@/data/startupBenefits";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import styles from "./StartupBenefitsSection.module.css";

const rotations = [-9, -6, -11, -7, -10];

export function StartupBenefitsSection() {
  const trigger = useRef<HTMLTableRowElement>(null);
  // Observe the first stamp row, not the whole table: tall mobile tables must
  // still trigger. Its leading edge must reach 55% of the viewport height.
  const [entered, setEntered] = useState(false);
  const reducedMotion = useReducedMotion();
  const show = entered || reducedMotion;

  useEffect(() => {
    if (entered || reducedMotion) return;
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      }, {
        // IntersectionObserver percentage margins are based on width, so use
        // pixels to keep the trigger at 55% of viewport height on every screen.
        rootMargin: `0px 0px -${Math.round(window.innerHeight * 0.45)}px 0px`,
      });
      if (trigger.current) observer.observe(trigger.current);
    };
    observe();
    window.addEventListener("resize", observe);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, [entered, reducedMotion]);

  return (
    <section id="startup-benefits" className={`section section-background-host ${styles.section}`} aria-labelledby="startup-benefits-title">
      <SectionBackground name="benefits" />
      <div className="container">
        <Reveal className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>창업 혜택</p>
            <h2 id="startup-benefits-title">시작의 부담은 덜고,<br /><span>꼭 필요한 것부터.</span></h2>
          </div>
          <div className={styles.intro}>
            {startupBenefits.isPreview && <span className={styles.preview}>혜택 시안 · 조건 미확정</span>}
            <p>뚝손과 함께할 첫걸음.<br />창업 항목부터 차근차근 안내합니다.</p>
          </div>
        </Reveal>

        <Reveal effect="fade" duration={0.65} className={styles.tableFrame}>
          <table className={styles.table} aria-describedby="startup-benefits-note">
            <caption className="sr-only">창업 항목 안내{startupBenefits.isPreview ? " — 면제 도장은 디자인 시안이며 실제 혜택은 미확정입니다." : ""}</caption>
            <colgroup><col className={styles.nameColumn} /><col /><col className={styles.amountColumn} /></colgroup>
            <thead><tr><th scope="col">구분</th><th scope="col">내용</th><th scope="col">{startupBenefits.isPreview ? "혜택 시안" : "금액"}</th></tr></thead>
            <tbody>
              {startupBenefits.rows.map((row, index) => (
                <tr key={row.name} ref={index === 0 ? trigger : undefined}>
                  <th scope="row">{row.name}</th>
                  <td className={styles.description}>{row.description}</td>
                  <td className={styles.amount}>
                    {row.stamp ? (
                      <div className={styles.stampCell}>
                        <span className="sr-only">{startupBenefits.isPreview ? "면제 시안, 조건 미확정" : "없음"}</span>
                        <motion.span
                          aria-hidden="true"
                          className={styles.stamp}
                          initial={false}
                          animate={show
                            ? { opacity: 1, scale: 1, rotate: rotations[index % rotations.length], y: 0 }
                            : { opacity: 0, scale: 1.8, rotate: -19, y: -16 }}
                          transition={reducedMotion
                            ? { duration: 0, delay: 0 }
                            : { duration: 0.19, delay: index * 0.13, ease: [0.76, 0, 0.24, 1] }}
                        >無</motion.span>
                        {startupBenefits.isPreview && <span className={styles.pending}>조건 미확정</span>}
                      </div>
                    ) : <span className={styles.consult}>상담 시 안내</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><th scope="row" colSpan={2}>최종 창업비용</th><td>상담 시 안내</td></tr></tfoot>
          </table>
        </Reveal>
        <p id="startup-benefits-note" className={styles.note}>
          {startupBenefits.isPreview
            ? "※ 無 도장은 면제 혜택의 디자인 시안입니다. 실제 면제 여부 및 적용 조건은 확정되지 않았으며, 세부 비용은 상담 시 안내합니다."
            : "※ 세부 비용과 적용 조건은 상담 시 안내합니다."}
        </p>
      </div>
    </section>
  );
}
