// Copy, figures, and artwork supplied in the client's profit-structure image.
// TODO: Add the calculation period and supporting source when provided.
// Preserve the supplied figures; do not invent a missing category or balance.
export const profitStructure = {
  headline: "뚝손국밥은 매출이 끝이 아니라,",
  emphasis: "시작입니다",
  description: {
    before: "중요한 건, 그 매출이 ",
    emphasis: "구조적으로 남는 구조",
    after: "인지입니다.",
  },
  ratios: [
    { label: "영업이익", value: "30%" },
    { label: "식재료 (주류 포함)", value: "37.1%" },
    { label: "인건비", value: "22.2%" },
    { label: "월세", value: "3%" },
    { label: "관리비", value: "2.1%" },
    { label: "기타", value: "3%" },
  ],
  notes: [
    "매출은 매장 위치, 상권, 운영 방식에 따라 차이가 발생할 수 있습니다.",
    "상기 사례는 실제 운영 사례 중 일부입니다.",
  ],
} as const;

// CSS windows and silhouette masks expose the replacement artwork unchanged.
export const profitArtwork = {
  src: "/images/profit/structure-artwork-v2.webp",
  width: 1672,
  height: 941,
  chart: { x: 516, y: 292, width: 662, height: 552 },
} as const;

export const profitPrinciples = [
  {
    id: "menu",
    label: "메뉴 단순화",
    crop: { x: 231, y: 286, width: 252, height: 230 },
    effect: "from-left",
    delay: 0.24,
  },
  {
    id: "labor",
    label: "인력 의존도 최소화",
    crop: { x: 1187, y: 288, width: 252, height: 233 },
    effect: "from-right",
    delay: 0.32,
  },
  {
    id: "cost",
    label: "원가구조 최적화",
    crop: { x: 196, y: 602, width: 260, height: 233 },
    effect: "from-left",
    delay: 0.4,
  },
  {
    id: "turnover",
    label: "회전율 중심 운영",
    crop: { x: 1218, y: 602, width: 260, height: 234 },
    effect: "from-right",
    delay: 0.48,
  },
] as const;
