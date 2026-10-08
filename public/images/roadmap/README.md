# Roadmap reference photos

Selected from the local projects and `guk-asset` files supplied by the user. These are general
reference scenes, not verified photographs of Ddukson staff, stores, or customers.
The source projects are unchanged.

| Output | Original (relative to `/Users/james/Documents/project`) | Scene |
| --- | --- | --- |
| `ingredients.webp` | `omurice-landing/public/asset/etc/1.jpg` | Ingredients |
| `broth-pouring.webp` | `guk-asset/gukbap_broth_pouring_card.webp` | Broth poured into hot bowls |
| `serving.webp` | `guk-asset/gukbap_serving_card.webp` | Steaming bowl presented by hand |
| `kitchen.webp` | `udon-landing/public/asset/etc/4.png` | Kitchen workflow |
| `head-office-support.webp` | `omurice-landing/public/asset/etc/process-3.png` | Kitchen checklist review |
| `delivery-convenience.webp` | `omurice-landing/public/asset/etc/4.png` | Staff with takeout bag |

Converted to WebP at quality 85, capped at 1200px wide without enlargement.
Original aspect ratios are preserved. The main-page component uses a 16:9 frame
and per-image `object-position` values in `src/data/roadmap.ts` to retain faces.
The broth-pouring image uses a 1.08 display scale anchored at the left to hide
the source's right-hand white divider. This crop remains in reduced-motion mode.
