// Copy and figures are preserved from the artwork supplied by the client.
// TODO: Add the calculation period and supporting source when provided.
// The supplied ratios total 97.4%; do not invent a balancing category.
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

export const profitScene = {
  width: 1916,
  height: 821,
  base: "/images/ttukson-profit",
  background: "01_background_pc.webp",
  mobileBackground: "01b_background_mobile.webp",
  // Reconstructed background and cutout masks differ from the final artwork.
  // Finish with the unmodified, lossless reference to preserve the exact design.
  final: "final-reference.webp",
  finish: { delay: 2.65, duration: 0.65 },
} as const;

export type ProfitEntrance = "rise" | "emphasis" | "chart" | "left" | "right" | "fade";

export const profitLayers = [
  { id: "title", file: "02_title_line1.webp", left: 495, top: 35, width: 923, height: 96, effect: "rise", delay: 0, duration: 0.65 },
  { id: "emphasis", file: "03_title_line2.webp", left: 735, top: 123, width: 535, height: 93, effect: "emphasis", delay: 0.2, duration: 0.7 },
  { id: "subtitle", file: "04_subtitle.webp", left: 616, top: 218, width: 694, height: 44, effect: "rise", delay: 0.4, duration: 0.65 },
  { id: "chart", file: "09_profit_chart.webp", left: 694, top: 258, width: 578, height: 497, effect: "chart", delay: 0.65, duration: 0.85 },
  { id: "menu", file: "05_card_left_top.webp", left: 266, top: 281, width: 368, height: 172, effect: "left", delay: 0.95, duration: 0.7 },
  { id: "labor", file: "07_card_right_top.webp", left: 1287, top: 283, width: 373, height: 175, effect: "right", delay: 1.1, duration: 0.7 },
  { id: "cost", file: "06_card_left_bottom.webp", left: 255, top: 500, width: 378, height: 180, effect: "left", delay: 1.25, duration: 0.7 },
  { id: "turnover", file: "08_card_right_bottom.webp", left: 1329, top: 525, width: 392, height: 181, effect: "right", delay: 1.4, duration: 0.7 },
  { id: "disclaimer", file: "14_disclaimer.webp", left: 696, top: 737, width: 554, height: 74, effect: "fade", delay: 1.95, duration: 0.6 },
] as const satisfies readonly {
  id: string;
  file: string;
  left: number;
  top: number;
  width: number;
  height: number;
  effect: ProfitEntrance;
  delay: number;
  duration: number;
}[];

export const profitPrinciples = [
  { id: "menu", label: "메뉴 단순화" },
  { id: "labor", label: "인력 의존도 최소화" },
  { id: "cost", label: "원가구조 최적화" },
  { id: "turnover", label: "회전율 중심 운영" },
] as const;

// Endpoints measured from the final reference, rather than the connector crops
// whose coordinates overlap the chart and omit the right-hand gold nodes.
export const profitConnections = [
  { id: "menu", from: [636, 375], to: [756, 430], delay: 1.55 },
  { id: "labor", from: [1287, 379], to: [1206, 423], delay: 1.65 },
  { id: "cost", from: [632, 607], to: [716, 594], delay: 1.75 },
  { id: "turnover", from: [1328, 629], to: [1253, 611], delay: 1.85 },
] as const;
