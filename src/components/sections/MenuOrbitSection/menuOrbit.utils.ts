import { menuOrbitAnimation } from "./menuOrbit.config";

export type OrbitGeometry = { radiusX: number; radiusY: number; clearanceY?: number };

export function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function rangeProgress(progress: number, start: number, end: number) {
  return clampProgress((progress - start) / (end - start));
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

export function getOrbitFrame(progress: number, finalAngle: number, geometry: OrbitGeometry) {
  const config = menuOrbitAnimation;
  const p = clampProgress(progress);
  const expansion = smoothStep(rangeProgress(p, config.spiralStart, config.settleEnd));
  const travel = rangeProgress(p, config.spiralStart, config.settleEnd);
  const settling = rangeProgress(p, config.settleStart, config.settleEnd);
  const mainTravel = (config.settleStart - config.spiralStart) / (config.settleEnd - config.spiralStart);
  // Constant, deliberate rotation followed by a C1-continuous deceleration.
  const rotationProgress = p < config.settleStart
    ? travel / ((1 + mainTravel) / 2)
    : (mainTravel + (1 - mainTravel) * (settling - settling * settling / 2)) / ((1 + mainTravel) / 2);
  const angle = (finalAngle - (1 - rotationProgress) * config.turns * 360) * Math.PI / 180;
  const radius = config.initialRadiusRatio + (1 - config.initialRadiusRatio) * expansion;
  const finalSine = Math.sin(finalAngle * Math.PI / 180);
  const finalY = Math.sign(finalSine) * Math.min(geometry.radiusY, Math.max(Math.abs(finalSine) * geometry.radiusY, geometry.clearanceY ?? 0));
  const settlingEase = smoothStep(settling);
  const orbitY = Math.sin(angle) * geometry.radiusY * radius;

  return {
    x: Math.cos(angle) * geometry.radiusX * radius,
    // Open a shared central copy band during settlement; no per-dish coordinates.
    y: orbitY + (finalY - orbitY) * settlingEase,
    scale: config.initialScale + (1 - config.initialScale) * expansion,
    opacity: 1,
  };
}

export function getCopyFrame(progress: number) {
  const opacity = smoothStep(rangeProgress(progress, menuOrbitAnimation.copyStart, menuOrbitAnimation.copyEnd));
  return { opacity, y: (1 - opacity) * 16 };
}
