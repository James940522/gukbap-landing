import { bowlImages } from "./bowlImages";

// Brand-adapted draft based on the supplied cooking-system reference.
// Uses the confirmed dedicated-broth/selected-ingredients positioning.
// TODO: Add cooking times, staffing requirements, and detailed operating
// procedures only after the brand supplies confirmed specifications.
export const cooking = {
  eyebrow: "THE DDUKSON WAY",
  lead: "깊은 맛을, 익숙한 조리의 흐름으로.",
  title: "조리는 차근차근,",
  highlight: "한 그릇은 제대로.",
  description: [
    "뚝손의 전용육수와 엄선된 재료로 시작해",
    "내놓는 순간까지, 한 그릇의 기준을 생각합니다.",
  ],
  image: bowlImages.sundae,
  principles: [
    { emphasis: "전용육수", detail: "로 시작하는 깊은 맛" },
    { emphasis: "분명한 순서", detail: "로 이어지는 조리" },
    { emphasis: "한결같은 기준", detail: "으로 내놓는 한 그릇" },
  ],
  steps: [
    {
      number: "01",
      label: "준비",
      title: "깊은 맛의 시작",
      description: ["전용육수와 엄선된 재료로", "한 그릇의 기본을 준비합니다."],
      position: "right",
      image: { src: "/images/food/pot-cooking.webp", objectPosition: "58% 50%" },
      caption: ["전용육수와 재료로", "깊은 맛을 준비합니다."],
    },
    {
      number: "02",
      label: "조리",
      title: "순서대로, 차근차근",
      description: ["재료를 더하고 온기를 담아", "뚝손의 한 그릇을 완성합니다."],
      position: "bottom",
      image: { src: "/images/food/sundae-closeup.webp", objectPosition: "54% 48%" },
      caption: ["차근차근 조리해", "뜨끈하게 완성합니다."],
    },
    {
      number: "03",
      label: "완성",
      title: "내놓는 순간까지",
      description: ["맛과 담음새를 한 번 더 살펴", "든든한 한 끼를 전합니다."],
      position: "left",
      image: { src: "/images/food/gukbap-spoon.webp", objectPosition: "65% 52%" },
      caption: ["첫 숟갈부터 든든한", "뚝손의 한 그릇."],
    },
  ],
};
