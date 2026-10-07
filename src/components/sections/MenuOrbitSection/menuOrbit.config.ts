import { bowlImages } from "@/data/bowlImages";

// Visuals only: confirmed menu names remain in the existing menu sections.
export const menuOrbitItems = [
  { id: "pork", image: bowlImages.pork, angle: -90, compactPosition: { x: 0, y: 0 } },
  { id: "spicy-sundae", image: bowlImages.spicySundae, angle: -30, compactPosition: { x: 1, y: -1 } },
  { id: "spicy-soup", image: bowlImages.spicySoup, angle: 45, compactPosition: { x: 1, y: 1 } },
  { id: "sundae", image: bowlImages.sundae, angle: 135, compactPosition: { x: -1, y: 1 } },
  { id: "pork-rice-soup", image: bowlImages.porkRiceSoup, angle: 210, compactPosition: { x: -1, y: -1 } },
] as const;

// Reuse the homepage's brand copy without adding price or business claims.
export const menuOrbitCopy = [
  { id: "taste", lines: ["한 그릇에 담은", "깊은 맛."] },
  { id: "standard", lines: ["뜨끈하게,", "제대로."] },
  { id: "everyday", lines: ["바쁜 하루에도", "든든한 한 끼."] },
] as const;

export const menuOrbitAnimation = {
  spiralStart: 0.15,
  settleStart: 0.7,
  settleEnd: 0.88,
  copyStart: 0.88,
  copyEnd: 0.98,
  turns: 1,
  initialScale: 1.15,
  initialOpacity: 0.45,
  compactInitialScale: 1.08,
  compactInitialOpacity: 0.18,
  opacityEnd: 0.65,
} as const;
