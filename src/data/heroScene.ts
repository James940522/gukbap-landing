import gateConfig from "../../scripts/hero/gate-config.json";

// Use the same pixel geometry as the validated extraction/reconstruction tools.
export const heroGate = {
  width: gateConfig.sourceWidth,
  height: gateConfig.sourceHeight,
  left: gateConfig.leftDoor,
  right: gateConfig.rightDoor,
  perspective: gateConfig.preview.perspective,
  angle: gateConfig.preview.openAngle,
};

export const heroFood = {
  src: "/images/hero/gukbap-table.webp",
  width: 1280,
  height: 960,
  alt: "검은 뚝배기에 담긴 국밥과 보쌈, 순대, 곁들임을 차린 뚝손국밥 한 상",
};

// Seconds from the start of each play. Keep the whole introduction finite.
export const heroTimeline = {
  doorDelay: 0.55,
  doorDuration: 1.7,
  foodDelay: 1.05,
  foodDuration: 1.2,
  frameDelay: 2.2,
  frameDuration: 0.9,
  logoDelay: 2.35,
  logoDuration: 0.75,
  assetTimeoutMs: 5000,
};
