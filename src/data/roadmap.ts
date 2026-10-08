export type RoadmapStrength = {
  number: string;
  title: string;
  desc: string;
  image: string | null;
  imageAlt: string;
  imagePosition?: string;
  imageScale?: number;
  imageOrigin?: string;
};

// Layout and six categories ported from the user-supplied udon-landing source.
// Reference photos selected from the supplied udon, omurice, and guk-asset files.
// These depict general scenes, not actual Ddukson staff or customer testimonials.
// Competitor cooking times, delivery schedules, and figures are not Ddukson data.
export const roadmapStrengths: RoadmapStrength[] = [
  {
    number: "01",
    title: "안정적인 원재료",
    desc: "뚝손의 전용육수와 엄선된 재료를 중심으로 한 그릇의 기본을 준비합니다.",
    image: "/images/roadmap/ingredients.webp",
    imageAlt: "잎채소와 다양한 식재료가 가지런히 진열된 모습",
  },
  {
    number: "02",
    title: "간단하고 편리한 조리",
    desc: "준비부터 완성까지 분명한 순서로, 뚝손의 조리 기준을 차근차근 익힙니다.",
    image: "/images/roadmap/broth-pouring.webp",
    imageAlt: "불 위의 뚝배기에 뜨거운 육수를 붓는 조리 장면",
    // Hide the source image's right-hand divider within the card frame.
    imageScale: 1.08,
    imageOrigin: "left center",
  },
  {
    number: "03",
    title: "높은 만족도",
    desc: "다양한 국밥과 곁들임으로 선택의 폭을 넓히고, 든든한 한 끼를 생각합니다.",
    image: "/images/roadmap/serving.webp",
    imageAlt: "김이 오르는 국밥 뚝배기를 손으로 내어놓는 모습",
  },
  {
    number: "04",
    title: "비용의 최소화",
    desc: "매장 규모와 동선, 필요한 설비를 함께 살펴 합리적인 창업 방향을 찾아갑니다.",
    image: "/images/roadmap/kitchen.webp",
    imageAlt: "주방의 화구 앞에서 나란히 음식을 조리하는 두 사람",
  },
  {
    number: "05",
    title: "더불어 나아가는 본사",
    desc: "첫 상담부터 매장 운영의 고민까지, 점주님과 함께 오래갈 방향을 생각합니다.",
    image: "/images/roadmap/head-office-support.webp",
    imageAlt: "주방에서 체크리스트를 함께 확인하는 두 사람",
  },
  {
    number: "06",
    title: "배달 편의성",
    desc: "매장 밖에서도 한 그릇의 온기가 전해지도록 메뉴와 포장 구성을 살펴봅니다.",
    image: "/images/roadmap/delivery-convenience.webp",
    imageAlt: "주방에서 종이 포장 봉투를 든 채 미소 짓는 사람",
  },
];

export const roadmapSignals = [
  { label: "운영 체계", value: "6단계" },
  { label: "조리", value: "조리 기준" },
  { label: "재료 공급", value: "전용육수" },
];
