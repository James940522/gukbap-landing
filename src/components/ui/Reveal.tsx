"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import type { ReactNode } from "react";
import { revealViewport } from "@/lib/motion";

const elements = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  article: motion.article,
  figure: motion.figure,
};

const entrances = {
  rise: { opacity: 0, y: 20 },
  fade: { opacity: 0 },
  "from-left": { opacity: 0, x: -20 },
  "from-right": { opacity: 0, x: 20 },
  settle: { opacity: 0, scale: 1.035 },
  "rotate-in": { opacity: 0, y: 24, rotate: -12, scale: 0.96 },
  line: { opacity: 0, scaleX: 0 },
} satisfies Record<string, TargetAndTransition>;

type RevealProps = {
  children?: ReactNode;
  className?: string;
  as?: keyof typeof elements;
  effect?: keyof typeof entrances;
  delay?: number;
  duration?: number;
  id?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
};

export function Reveal({
  children,
  className = "",
  as = "div",
  effect = "rise",
  delay = 0,
  duration = 0.9,
  ...attributes
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const Element = elements[as];

  return (
    <Element
      {...attributes}
      className={className}
      data-reveal={effect}
      // Keep the server and first client render identical. CSS exposes content
      // immediately for reduced motion, keyboard focus, and without JavaScript.
      initial="hidden"
      whileInView="visible"
      variants={{
        hidden: entrances[effect],
        visible: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, scaleX: 1 },
      }}
      viewport={revealViewport}
      transition={{
        type: "tween",
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: [0.22, 0.61, 0.36, 1],
      }}
    >
      {children}
    </Element>
  );
}
