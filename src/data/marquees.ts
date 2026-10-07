// Decorative brand language only; keep business claims in confirmed section copy.
export const marquees = {
  brand: ["DDUKSON GUKBAP", "A WARM BOWL", "THE TASTE OF DDUKSON"],
  menu: ["SIGNATURE GUKBAP", "ON THE DDUKSON TABLE", "A HEARTY MEAL"],
  standard: ["THE DDUKSON WAY", "BROTH & INGREDIENTS", "ONE BOWL AT A TIME"],
  territory: ["DDUKSON GUKBAP", "A PLACE FOR YOUR STORE", "START WITH DDUKSON"],
  franchise: ["DDUKSON GUKBAP", "YOUR NEXT CHAPTER", "START TOGETHER"],
  inquiry: ["START WITH DDUKSON", "LET’S TALK GUKBAP", "YOUR NEXT CHAPTER"],
} as const;

export type MarqueeTheme = keyof typeof marquees;
