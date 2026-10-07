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
  src: "/images/hero/gukbap-desktop.webp",
  mobileSrc: "/images/hero/gukbap-mobile.webp",
  width: 1672,
  height: 941,
  alt: "김이 오르는 검은 뚝배기 국밥에 고기와 대파를 올리고 김치와 깍두기를 곁들인 한 상",
};
