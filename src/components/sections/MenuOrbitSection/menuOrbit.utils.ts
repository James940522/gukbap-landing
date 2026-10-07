import { menuOrbitAnimation, type menuOrbitItems } from "./menuOrbit.config";

export type OrbitGeometry = {
  radiusX: number;
  radiusY: number;
  clearanceY?: number;
  compact?: boolean;
  narrow?: boolean;
};
type OrbitItem = (typeof menuOrbitItems)[number];

export function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function rangeProgress(progress: number, start: number, end: number) {
  return clampProgress((progress - start) / (end - start));
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

export function getOrbitFrame(progress: number, item: OrbitItem, geometry: OrbitGeometry) {
  const config = menuOrbitAnimation;
  const p = clampProgress(progress);
  const zoom = smoothStep(rangeProgress(p, config.spiralStart, config.settleEnd));
  const travel = rangeProgress(p, config.spiralStart, config.settleEnd);
  const settling = rangeProgress(p, config.settleStart, config.settleEnd);
  const mainTravel = (config.settleStart - config.spiralStart) / (config.settleEnd - config.spiralStart);
  // Constant, deliberate rotation followed by a C1-continuous deceleration.
  const rotationProgress = p < config.settleStart
    ? travel / ((1 + mainTravel) / 2)
    : (mainTravel + (1 - mainTravel) * (settling - settling * settling / 2)) / ((1 + mainTravel) / 2);
  const rotation = -(1 - rotationProgress) * config.turns * Math.PI * 2;
  const angle = item.angle * Math.PI / 180 + rotation;
  const visibility = smoothStep(rangeProgress(p, config.spiralStart, config.opacityEnd));
  const initialScale = geometry.compact ? config.compactInitialScale : config.initialScale;
  const initialOpacity = geometry.compact ? config.compactInitialOpacity : config.initialOpacity;
  const finalSine = Math.sin(item.angle * Math.PI / 180);
  const finalY = Math.sign(finalSine) * Math.min(geometry.radiusY, Math.max(Math.abs(finalSine) * geometry.radiusY, geometry.clearanceY ?? 0));
  const settlingEase = smoothStep(settling);
  const orbitY = Math.sin(angle) * geometry.radiusY;
  // Rotate the spaced formation at a fixed radius, including the narrow layout.
  const pointX = item.compactPosition.x * Math.SQRT1_2;
  const pointY = item.compactPosition.y * Math.SQRT1_2;
  const compactX = (pointX * Math.cos(rotation) - pointY * Math.sin(rotation)) * geometry.radiusX;
  const compactY = (pointX * Math.sin(rotation) + pointY * Math.cos(rotation)) * geometry.radiusY;

  return {
    x: geometry.narrow ? compactX : Math.cos(angle) * geometry.radiusX,
    // Open a shared central copy band during settlement; no per-dish coordinates.
    y: geometry.narrow ? compactY : orbitY + (finalY - orbitY) * settlingEase,
    scale: initialScale + (1 - initialScale) * zoom,
    opacity: initialOpacity + (1 - initialOpacity) * visibility,
  };
}

export function getCopyFrame(progress: number) {
  const opacity = smoothStep(rangeProgress(progress, menuOrbitAnimation.copyStart, menuOrbitAnimation.copyEnd));
  return { opacity, y: (1 - opacity) * 16 };
}
