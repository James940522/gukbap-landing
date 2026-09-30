// Brand copy is a draft. Menu names below were supplied by the brand owner.
export const brand = {
  name: "뚝손국밥",
  englishName: "DDUKSON GUKBAP",
  company: "주식회사 산본에프앤비",
  hero: {
    eyebrow: "한 그릇을 대하는 진심",
    title: ["뜨끈하게,", "제대로."],
    description: "한 그릇에 담은 깊은 맛.",
    detail: "익숙한 한 끼에도, 지키고 싶은 기준이 있습니다.",
  },
};

export const navigation = [
  { label: "브랜드", href: "#brand" },
  { label: "메뉴", href: "#menu" },
  { label: "뚝손의 기준", href: "#standard" },
  { label: "창업 안내", href: "#franchise" },
];

// Brand-supplied sample photography. Originals are kept in assets/food/originals.
export const foodImages = {
  spoon: "/images/food/gukbap-spoon.webp",
  sundae: "/images/food/sundae-closeup.webp",
  cooking: "/images/food/pot-cooking.webp",
};

export const brandValues = [
  {
    english: "SINCERITY",
    title: "한 그릇의 정성",
    description: "익숙한 음식일수록, 더 마음을 씁니다.",
  },
  {
    english: "DEPTH",
    title: "오래 남는 깊은 맛",
    description: "첫 숟갈의 온기가 좋은 기억으로 남도록.",
  },
  {
    english: "WARMTH",
    title: "속까지 든든하게",
    description: "잘 먹었다는 한마디를 생각합니다.",
  },
];

export type Menu = {
  id: string;
  name: string;
  image: string | null;
  badge?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  english: string;
  items: Menu[];
};

// TODO: Add actual photographs, prices, and descriptions once provided.
export const menuCategories: MenuCategory[] = [
  {
    id: "gukbap",
    name: "국밥",
    english: "GUKBAP",
    names: [
      "돼지국밥",
      "누룽지 돼지국밥",
      "내장국밥",
      "순대국밥",
      "누룽지 순대국밥",
      "황태해장국",
    ],
  },
  {
    id: "clear",
    name: "맑은 국밥",
    english: "CLEAR BROTH",
    names: ["맑은 돼지국밥"],
  },
  {
    id: "spicy",
    name: "얼큰 국밥",
    english: "SPICY BROTH",
    names: [
      "얼큰 돼지국밥",
      "얼큰 누룽지 돼지국밥",
      "얼큰 내장국밥",
      "[해장 No.1] 얼큰 순대국밥",
      "황태 얼큰국밥",
    ],
  },
  {
    id: "yukgaejang",
    name: "육개장 국밥",
    english: "YUKGAEJANG",
    names: ["돈개장", "황태 육개장국밥"],
  },
  {
    id: "side",
    name: "사이드",
    english: "SIDE DISHES",
    names: ["보쌈", "찰순대"],
  },
  {
    id: "mandu",
    name: "만두",
    english: "MANDU",
    names: ["김치왕만두", "고기왕만두", "반반만두", "갈비만두"],
  },
  {
    id: "jeon",
    name: "전",
    english: "JEON",
    names: ["김치전", "부추전", "동그랑땡", "동태전", "육전", "옥수수전"],
  },
  {
    id: "drinks",
    name: "음료",
    english: "DRINKS",
    names: ["갈아만든 배", "식혜", "콜라", "사이다", "제로콜라", "제로사이다"],
  },
].map((category) => ({
  id: category.id,
  name: category.name,
  english: category.english,
  items: category.names.map((name, index) => ({
    id: `${category.id}-${index + 1}`,
    name: name.replace("[해장 No.1] ", ""),
    badge: name.startsWith("[해장 No.1]") ? "해장 No.1" : undefined,
    image: null,
  })),
}));

export const standards = [
  {
    number: "01",
    title: "육수",
    english: "BROTH",
    subtitle: "깊은 맛의 시작.",
    description:
      "한 숟갈에 전해지는 깊이. 뚝손이 한 그릇을 생각하는 첫 번째 기준입니다.",
  },
  {
    number: "02",
    title: "재료",
    english: "INGREDIENTS",
    subtitle: "기본을 소중하게.",
    description:
      "좋은 한 끼의 시작은 재료에 있다고 믿습니다. 익숙한 맛의 기본을 생각합니다.",
  },
  {
    number: "03",
    title: "조리",
    english: "COOKING",
    subtitle: "온기까지 담아서.",
    description:
      "첫 숟갈부터 마지막 숟갈까지. 따뜻하게 기억되는 한 그릇을 지향합니다.",
  },
  {
    number: "04",
    title: "운영",
    english: "CONSISTENCY",
    subtitle: "한결같은 마음으로.",
    description:
      "다시 찾고 싶은 편안함. 한 그릇을 내놓는 마음이 브랜드의 기준이 됩니다.",
  },
];

// TODO: Replace these preview topics with confirmed franchise policies.
export const franchiseTopics = [
  {
    number: "01",
    title: "운영 시스템",
    description: "한 그릇의 기준이 매장의 일상으로 이어지도록.",
    detail: "운영 방식과 매장 구성에 관한 세부 안내를 준비하고 있습니다.",
  },
  {
    number: "02",
    title: "창업 절차",
    description: "새로운 시작에 필요한 과정을 하나씩.",
    detail: "창업 상담부터 오픈까지의 절차는 확정 후 안내할 예정입니다.",
  },
  {
    number: "03",
    title: "본사 지원",
    description: "함께 오래갈 수 있는 방향을 생각합니다.",
    detail: "교육과 운영 지원의 구체적인 범위는 추후 공개할 예정입니다.",
  },
];
