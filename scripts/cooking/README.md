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

Food assets are the user's photographs, reused from `/images/food/`.
The initial bowl is the upper-left sundae-gukbap in the supplied table photo.
Its source is preserved in `public/images/cooking/source/table-original.jpg`.
Regenerate the 376×376 WebP crop with:

```sh
node scripts/cooking/prepare-bowl.mjs
```

The source crop is `{ left: 226, top: 73, width: 376, height: 376 }`.
Wedge photo positions and brand copy live in `src/data/cooking.ts`.
No reference brand logo, food photograph, or unconfirmed five-minute claim
is carried into the page.

The section is exposed directly on the main page at `/#cooking-system`.
