// Decorative brand language only; keep business claims in confirmed section copy.
export const marquees = {
  brand: ["뚝손국밥", "뜨끈한 한 그릇", "뚝손의 깊은 맛"],
  menu: ["뚝손의 대표 국밥", "뚝손의 한 상", "든든한 한 끼"],
  standard: ["뚝손의 기준", "육수와 재료", "한 그릇을 제대로"],
  territory: ["뚝손국밥", "점주님의 새로운 자리", "뚝손과 함께 시작"],
  franchise: ["뚝손국밥", "새로운 시작", "함께 시작합니다"],
  inquiry: ["뚝손과 함께 시작", "국밥으로 나누는 이야기", "새로운 시작"],
} as const;

export type MarqueeTheme = keyof typeof marquees;
