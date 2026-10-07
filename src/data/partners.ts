// Partner qualities supplied by the user. Keep the original wording together.
export const partnerQualities = [
  {
    id: "purpose",
    title: "선명한 목표",
    keyword: "목표",
    description: ["성공을 향한", "목표가 선명한 분"],
  },
  {
    id: "service",
    title: "고객을 향한 마음",
    keyword: "서비스",
    description: ["‘내 월급은 고객이 준다’", "고객 서비스의 준비가 된 분"],
  },
  {
    id: "trust",
    title: "함께 지키는 신의",
    keyword: "신의",
    description: ["본사는 가족이라 믿고", "신의를 지켜 가는 분"],
  },
  {
    id: "warmth",
    title: "미소 짓는 일상",
    keyword: "미소",
    description: ["고객과 직원 모두에게", "미소를 잃지 않는 분"],
  },
  {
    id: "principle",
    title: "기본에 대한 믿음",
    keyword: "기본",
    description: ["본사의 매뉴얼이", "성공의 길이라 굳게 믿는 분"],
  },
] as const;

export type PartnerQualityId = (typeof partnerQualities)[number]["id"];
