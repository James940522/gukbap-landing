type BackgroundPlacement = {
  image: string;
  opacity: number;
  mobileOpacity: number;
  position?: string;
  mobilePosition?: string;
  eager?: boolean;
};

// Full source mapping, optimization sizes, and reserved images:
// assets/backgrounds/README.md and assets/backgrounds/manifest.json.
export const sectionBackgrounds = {
  hero: {
    image: "rising-steam",
    opacity: 0.42,
    mobileOpacity: 0.24,
    position: "right center",
    mobilePosition: "68% center",
    eager: true,
  },
  nurungji: {
    image: "steaming-ttukbaegi",
    opacity: 0.88,
    mobileOpacity: 0.8,
    position: "center",
    mobilePosition: "78% center",
  },
  menu: {
    image: "warm-hanji",
    opacity: 0.75,
    mobileOpacity: 0.48,
  },
  featuredMenu: {
    image: "warm-hanji",
    opacity: 0.22,
    mobileOpacity: 0.12,
  },
  pairing: {
    image: "wood-table",
    opacity: 0.46,
    mobileOpacity: 0.28,
    position: "center",
  },
  standards: {
    image: "dark-stone",
    opacity: 0.46,
    mobileOpacity: 0.3,
  },
  cooking: {
    image: "cooking-steam",
    opacity: 0.35,
    mobileOpacity: 0.2,
    position: "center",
    mobilePosition: "38% center",
  },
  territory: {
    image: "territory-contours",
    opacity: 0.72,
    mobileOpacity: 0.4,
    position: "center",
    mobilePosition: "72% center",
  },
  franchise: {
    image: "hanok-window",
    opacity: 0.34,
    mobileOpacity: 0.27,
    position: "right center",
    mobilePosition: "76% center",
  },
  cost: {
    image: "warm-hanji",
    opacity: 0.88,
    mobileOpacity: 0.56,
  },
  partners: {
    image: "warm-hanji",
    opacity: 0.86,
    mobileOpacity: 0.55,
  },
  benefits: {
    image: "gold-brush-ring",
    opacity: 0.3,
    mobileOpacity: 0.18,
    position: "right top",
    mobilePosition: "right top",
  },
} satisfies Record<string, BackgroundPlacement>;

export type SectionBackgroundName = keyof typeof sectionBackgrounds;

export function getSectionBackground(name: SectionBackgroundName): BackgroundPlacement {
  return sectionBackgrounds[name];
}
