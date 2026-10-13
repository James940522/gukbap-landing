"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function RotatingBowl({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ rotate: 0 }}
      animate={{ rotate: reducedMotion ? 0 : 360 }}
      transition={{
        duration: reducedMotion ? 0 : 40,
        ease: "linear",
        repeat: reducedMotion ? 0 : Infinity,
      }}
    >
      {children}
    </motion.div>
  );
}
