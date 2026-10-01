import { foodImages } from "./site";

export type HeroSlide = {
  id: string;
  image: string;
  alt: string;
};

// The repeated photograph is intentional while the next hero images are prepared.
// TODO: Replace each slot's image and alt with the supplied photography.
export const heroSlides: HeroSlide[] = [
  {
    id: "hero-01",
    image: foodImages.spoon,
    alt: "고기와 밥, 파를 담은 따뜻한 국밥 한 숟갈",
  },
  {
    id: "hero-02",
    image: foodImages.spoon,
    alt: "고기와 밥, 파를 담은 따뜻한 국밥 한 숟갈",
  },
  {
    id: "hero-03",
    image: foodImages.spoon,
    alt: "고기와 밥, 파를 담은 따뜻한 국밥 한 숟갈",
  },
];
