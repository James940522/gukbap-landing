export type RoadmapStrength = {
  number: string;
  title: string;
  desc: string;
  image: string | null;
};

// Layout and six categories ported from the user-supplied udon-landing source.
// Keep images empty until actual brand assets are supplied. Competitor cooking
// times, delivery schedules, shop sizes, and other figures are not Ddukson data.
export const roadmapStrengths: RoadmapStrength[] = [
  {
    number: "01",
    title: "안정적인 원재료",
    desc: "뚝손의 전용육수와 엄선된 재료를 중심으로 한 그릇의 기본을 준비합니다.",
    image: null,
  },
  {
    number: "02",
    title: "간단하고 편리한 조리",
    desc: "준비부터 완성까지 분명한 순서로, 뚝손의 조리 기준을 차근차근 익힙니다.",
    image: null,
  },
  {
    number: "03",
    title: "높은 만족도",
    desc: "다양한 국밥과 곁들임으로 선택의 폭을 넓히고, 든든한 한 끼를 생각합니다.",
    image: null,
  },
  {
    number: "04",
    title: "비용의 최소화",
    desc: "매장 규모와 동선, 필요한 설비를 함께 살펴 합리적인 창업 방향을 찾아갑니다.",
    image: null,
  },
  {
    number: "05",
    title: "더불어 나아가는 본사",
    desc: "첫 상담부터 매장 운영의 고민까지, 점주님과 함께 오래갈 방향을 생각합니다.",
    image: null,
  },
  {
    number: "06",
    title: "배달 편의성",
    desc: "매장 밖에서도 한 그릇의 온기가 전해지도록 메뉴와 포장 구성을 살펴봅니다.",
    image: null,
  },
];

export const roadmapSignals = [
  { label: "System", value: "06 steps" },
  { label: "Cooking", value: "조리 기준" },
  { label: "Supply", value: "전용육수" },
];
