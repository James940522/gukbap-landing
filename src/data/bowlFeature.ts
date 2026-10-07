import type { StaticImageData } from "next/image";
import { bowlImages } from "./bowlImages";

export const bowlFeature: {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string[];
  image: { src: string | StaticImageData; alt: string } | null;
} = {
  eyebrow: "한 그릇에 담은 깊은 맛, 뚝손국밥",
  title: "속까지 전해지는",
  highlight: "든든한 한 그릇.",
  description: [
    "뜨끈한 첫 숟갈부터 마지막 한 숟갈까지.",
    "바쁜 하루에도, 제대로 된 한 끼를 누릴 수 있도록.",
    "뚝손은 오늘도 한 그릇에 마음을 담습니다.",
  ],
  image: bowlImages.pork,
};
