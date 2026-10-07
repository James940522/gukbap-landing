import background from "../../public/images/brand-growth/background.webp";
import brands from "../../public/images/brand-growth/brands.webp";
import downturn from "../../public/images/brand-growth/downturn.webp";
import growth from "../../public/images/brand-growth/growth.webp";
import badge from "../../public/images/brand-growth/badge.webp";
import plaque from "../../public/images/brand-growth/plaque.webp";
import intro from "../../public/images/brand-growth/intro.webp";
import strength from "../../public/images/brand-growth/strength.webp";

// Artwork and business wording supplied by the user; keep each source separate
// so the composition and entrance timing can be adjusted independently.
export const brandGrowth = {
  background,
  title: "불경기에도 성장하는 브랜드",
  brands: "뚝손국밥 × 오늘은 오므라이스",
  statement: "저희 뚝손국밥은 저력이 있는 회사입니다.",
  badge: "현재 브랜드 운영 수 300호점 이상",
  layers: [
    { id: "brands", image: brands, effect: "wipe", delay: 0.08, duration: 0.9, sizes: "(max-width: 767px) 94vw, (max-width: 1920px) 59vw, 1130px" },
    { id: "downturn", image: downturn, effect: "wipe", delay: 0.38, duration: 0.85, sizes: "(max-width: 767px) 58vw, (max-width: 1920px) 32vw, 620px" },
    { id: "growth", image: growth, effect: "wipe", delay: 0.72, duration: 1, sizes: "(max-width: 767px) 92vw, (max-width: 1920px) 52vw, 990px" },
    { id: "badge", image: badge, effect: "seal", delay: 1.06, duration: 0.8, sizes: "(max-width: 767px) 27vw, (max-width: 1920px) 14vw, 270px" },
    { id: "plaque", image: plaque, effect: "unfold", delay: 1.18, duration: 0.9, sizes: "(max-width: 767px) 94vw, (max-width: 1920px) 89vw, 1700px" },
    { id: "intro", image: intro, effect: "rise", delay: 1.48, duration: 0.75, sizes: "(max-width: 767px) 44vw, (max-width: 1920px) 19vw, 360px" },
    { id: "strength", image: strength, effect: "wipe", delay: 1.76, duration: 0.9, sizes: "(max-width: 767px) 84vw, (max-width: 1920px) 36vw, 680px" },
  ],
} as const;

export type BrandGrowthEntrance = (typeof brandGrowth.layers)[number]["effect"];
