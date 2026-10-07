# Circular cooking sequence

Reference source inspected on 2026-10-06:

- https://www.dongnamjip.com/ — `#section06` markup and its inline GSAP timeline.
- https://www.dongnamjip.com/STATIC/css/main2.css — circular track, background and wedge placement.
- https://www.dongnamjip.com/STATIC/css/animation.css — `strokeAni` keyframes.

The reference uses a 610×610 SVG, center 305, radius 298, a 1px translucent
track, and a 4px white stroke with dash length 1911. Dash offset runs from
1911 to 0 linearly in 5 seconds and repeats without a delay.

The image timeline repeats every 5 seconds using `power1.inOut`:

| Piece | Start | Fade duration | End |
| --- | --- | --- | --- |
| Right (`p2`) | 0s | 1.5s | 1.5s |
| Bottom (`p3`) | 1.5s | 1.5s | 3s |
| Left (`p1`) | 2.5s | 2.5s | 5s |

The bottom and left fades overlap by 0.5s. The implementation reproduces
these timings with one Framer Motion clock and a quadratic ease, keeping
the ring and the images in phase. Playback starts while the circle is
visible and stops outside the viewport. Reduced-motion and no-JavaScript
settings show a static presentation. No playback controls are exposed.

Wedge photographs are reused from `/images/food/`. The initial bowl now uses
the transparent sundae image supplied on 2026-10-07, from `/images/bowls/`.
All six supplied bowls have unchanged PNG originals in that folder's `source/`
directory, plus 1254×1254 WebP assets that preserve transparency and framing.
The previous table-photo crop has been removed; the table original is retained.
Regenerate the six WebP files from the saved PNG originals with:

```sh
node scripts/cooking/prepare-bowl.mjs
```

To import the six images again, pass their containing directory as the first
argument. `bowl-manifest.json` maps the original filenames to stable asset names.
The script imports only those six files and does not crop or flatten them.
Reusable image imports and alt text live in `src/data/bowlImages.ts`.
Wedge photo positions and brand copy live in `src/data/cooking.ts`.
No reference brand logo, food photograph, or unconfirmed five-minute claim
is carried into the page.

The section is exposed directly on the main page at `/#cooking-system`.
