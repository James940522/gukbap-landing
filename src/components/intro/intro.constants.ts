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
  approach: 0.7,
  doorOpen: 1.2,
  doorDuration: 2.6,
  pushIn: 1.4,
  gateEnd: 4.2,
  // The feast is already behind the gate; zoom into it before the logo lands.
  tableZoomStart: 2.7,
  tableZoomDuration: 1.9,
  logoIn: 4.65,
  logoDuration: 0.95,
  copyIn: [5.9, 8.5],
  copyOut: [7.95, 10.65],
  copyDuration: 0.4,
  brandExit: 11.1,
  brandExitDuration: 0.75,
  curtainStart: 12.1,
  curtainDuration: 2.1,
  total: 14.2,
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
