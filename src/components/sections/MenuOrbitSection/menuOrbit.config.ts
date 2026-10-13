import { bowlImages } from "@/data/bowlImages";

// Visuals only: confirmed menu names remain in the existing menu sections.
export const menuOrbitItems = [
  { id: "pork", image: bowlImages.pork, angle: -90 },
  { id: "spicy-sundae", image: bowlImages.spicySundae, angle: -30 },
  { id: "spicy-soup", image: bowlImages.spicySoup, angle: 30 },
  { id: "tofu-soup", image: bowlImages.tofuSoup, angle: 90 },
  { id: "sundae", image: bowlImages.sundae, angle: 150 },
  { id: "pork-rice-soup", image: bowlImages.porkRiceSoup, angle: 210 },
] as const;

// Describe the supplied menu range without adding price or business claims.
export const menuOrbitCopy = [
  {
    id: "taste",
    lines: ["맑게도,", "얼큰하게도."],
    description: "취향에 맞춰 고르는 국밥.",
  },
  {
    id: "nurungji",
    lines: ["누룽지로", "더한 고소함."],
    description: "뜨끈한 국밥에 누룽지를 더했습니다.",
  },
  {
    id: "table",
    lines: ["한 그릇에서,", "한 상까지."],
    description: "국밥 곁에 수육, 전, 만두까지.",
  },
] as const;

export const menuOrbitAnimation = {
  spiralStart: 0,
  settleStart: 0.6,
  settleEnd: 0.78,
  copyStart: 0.78,
  copyEnd: 0.9,
  // Complete one turn, then reveal the copy before leaving the section.
  turns: 1,
  initialScale: 1.08,
  initialOpacity: 0.75,
  compactInitialScale: 1.08,
  compactInitialOpacity: 0.6,
  opacityEnd: 0.5,
} as const;
