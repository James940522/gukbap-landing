import logo from "../../../public/images/logos/ddukson-gukbap.png";

// Seconds from the single intro clock. Keep copy and visiting policy editable.
export const INTRO_MODE: "always" | "session" = "always";
export const INTRO_STORAGE_KEY = "ddukson-brand-intro-seen";
export const INTRO_POPUP_DELAY_MS = 1000;
export const INTRO_ASSET_TIMEOUT_MS = 1800;
export const INTRO_COPIES = ["한 그릇의 뚝심, 장사의 시작.", "당신의 가게에, 뚝손국밥."];

export const INTRO_ASSETS = {
  frame: "/images/hero/gate-frame.webp",
  leftDoor: "/images/hero/gate-door-left.png",
  rightDoor: "/images/hero/gate-door-right.png",
  logo,
  table: "/images/intro/gukbap-feast.webp",
};

export const INTRO_TIMELINE = {
  approach: 0.3,
  doorOpen: 0.53,
  doorDuration: 1.12,
  pushIn: 0.59,
  gateEnd: 1.77,
  // The feast is already behind the gate; zoom into it before the logo lands.
  tableZoomStart: 1.15,
  tableZoomDuration: 0.8,
  logoIn: 1.95,
  logoDuration: 0.45,
  copyIn: [2.4, 3.4],
  copyOut: [3.17, 4.18],
  copyDuration: 0.18,
  brandExit: 4.36,
  brandExitDuration: 0.3,
  curtainStart: 4.72,
  curtainDuration: 0.88,
  total: 5.6,
};

export const INTRO_REDUCED_TIMELINE: typeof INTRO_TIMELINE = {
  ...INTRO_TIMELINE,
  approach: 0,
  doorOpen: 0,
  doorDuration: 0,
  pushIn: 0,
  gateEnd: 0,
  tableZoomStart: 0,
  tableZoomDuration: 0,
  logoIn: 0.02,
  logoDuration: 0.18,
  brandExit: 0.22,
  brandExitDuration: 0.08,
  curtainStart: 0.3,
  curtainDuration: 0.35,
  total: 0.65,
};

export function fitIntroTimeline(loadingSeconds: number): typeof INTRO_TIMELINE {
  // The user requested a slower rhythm. Include preparation in a six-second budget.
  const factor = Math.min(1, Math.max(4.2, 6 - loadingSeconds) / INTRO_TIMELINE.total);
  return Object.fromEntries(Object.entries(INTRO_TIMELINE).map(([key, value]) => [
    key,
    Array.isArray(value) ? value.map((time) => time * factor) : value * factor,
  ])) as typeof INTRO_TIMELINE;
}
