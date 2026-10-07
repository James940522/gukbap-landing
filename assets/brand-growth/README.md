# Brand growth section artwork

The nine PNGs in `originals/` were supplied by the user on 2026-10-07.
`reference.png` is the final arrangement reference and is not served to visitors.
The other eight assets are composited as separate layers on the homepage in
`BrandGrowthSection`, immediately before the franchise overview.

The source wording, including “현재 브랜드 운영 수 300호점 이상”, comes from
the user-provided artwork. It is retained without inventing additional metrics.

Run `node scripts/brand-growth/prepare-assets.mjs` to export WebP assets.
Transparent margins are cropped with alpha > 5 and six pixels of padding;
the source lettering, texture, and glow remain intact. The output manifest
records each crop and the final image dimensions.

Desktop positions match the 1777 × 885 reference composition. Mobile uses
a taller composition to keep all the supplied lettering readable. Entrances
use Framer Motion and run once when the section enters view; reduced motion,
print, and JavaScript-disabled visitors receive the complete composition.
