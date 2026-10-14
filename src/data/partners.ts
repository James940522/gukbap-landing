// Five qualities supplied by the user, shortened for the approved invitation layout.
export const partnerQualities = [
  {
    id: "purpose",
    title: "목표가 선명한 분",
    description: "나의 매장을 꾸준히 키워갈 목표가 있는 분",
  },
  {
    id: "service",
    title: "고객을 소중히 여기는 분",
    description: "한 분의 방문도 정성껏 맞이할 준비가 된 분",
  },
  {
    id: "trust",
    title: "믿음을 함께 쌓아가는 분",
    description: "본사와 약속을 지키며 오래 함께할 분",
  },
  {
    id: "warmth",
    title: "미소를 나누는 분",
    description: "고객과 직원 모두에게 따뜻하게 대하는 분",
  },
  {
    id: "principle",
    title: "기본을 꾸준히 지키는 분",
    description: "매뉴얼과 운영의 기본을 성실히 실천하는 분",
  },
] as const;

export type PartnerQualityId = (typeof partnerQualities)[number]["id"];

// User-supplied reference scene; this does not identify an actual Ddukson owner.
export const partnerVisual = {
  src: "/images/roadmap/serving.webp",
  alt: "김이 오르는 국밥 뚝배기를 손으로 받쳐 내어주는 모습",
} as const;
