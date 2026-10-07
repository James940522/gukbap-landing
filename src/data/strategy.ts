// Copy supplied with the reference design. This is a concept illustration,
// not a measured revenue chart.
export const strategyContent = {
  title: "세 가지",
  titleSuffix: "전략",
  description: ["맞춤형 운영 시스템으로", "안정적인 매출 상승폭"],
  checklist: ["사계절도", "주류판매", "홀매출도"],
  emphasis: "가능",
  graphCaption: ["세 가지 전략으로", "안정적인 매출 상승"],
} as const;

export const strategyAssets = {
  paper: "/images/strategy/bg-paper-texture.webp",
  hanok: "/images/strategy/bg-hanok-left.webp",
  food: "/images/strategy/menu-assortment-hq.webp",
  board: "/images/strategy/board-frame.webp",
} as const;

// All coordinates use the same viewBox as their graph. CSS derives the badge
// positions from these coordinates, so paths, stems and labels stay aligned.
export const strategyGraphs = {
  desktop: {
    width: 1624,
    height: 968,
    path: "M 158 984 L 1368.3 197.4",
    revealPath: "M 158 984 L 1469 132",
    revealWidth: 180,
    arrow: "M 1469 132 L 1330.1 138.7 L 1406.4 256.1 Z",
    foodClip: "polygon(11.25% 100%, 100% 3.23%, 100% 100%)",
    strokeWidth: 30,
    nodeRadius: 11,
    badgeSize: 150,
  },
  mobile: {
    width: 600,
    height: 680,
    path: "M -20 586 L 496.9 221.8",
    revealPath: "M -20 586 L 559 178",
    revealWidth: 120,
    arrow: "M 559 178 L 473.2 188.3 L 520.5 255.3 Z",
    foodClip: "polygon(0 84.1%, 100% 21.93%, 100% 100%, 0 100%)",
    strokeWidth: 16,
    nodeRadius: 8,
    badgeSize: 132,
  },
} as const;

// Arrival fractions include the reveal path's extension through the arrow tip.
export const strategyPoints = [
  {
    id: "store",
    icon: "store",
    label: ["고회전", "매장운영"],
    desktop: { x: 334, y: 869.62, badgeY: 653 },
    mobile: { x: 111, y: 493.69, badgeY: 350 },
    progress: { desktop: 0.1342, mobile: 0.2263 },
  },
  {
    id: "liquor",
    icon: "liquor",
    label: ["주류판매", "가능"],
    desktop: { x: 750, y: 599.27, badgeY: 438 },
    mobile: { x: 300, y: 360.51, badgeY: 260 },
    progress: { desktop: 0.4516, mobile: 0.5527 },
  },
  {
    id: "season",
    icon: "bowl",
    label: ["사계절", "운영"],
    desktop: { x: 929, y: 482.94, badgeY: 316 },
    mobile: { x: 476, y: 236.49, badgeY: 108 },
    progress: { desktop: 0.5881, mobile: 0.8566 },
  },
] as const;

// Seconds from each layer's viewport trigger: board entry and the lower graph.
export const strategyTiming = {
  board: 0.05,
  graph: 0.12,
  graphDuration: 2.6,
  badgeLag: 0.18,
  title: 0.1,
  description: 0.28,
  checklist: 0.48,
  checklistStagger: 0.2,
  checkLag: 0.08,
  okLag: 0.22,
  graphCaption: 0.32,
} as const;
