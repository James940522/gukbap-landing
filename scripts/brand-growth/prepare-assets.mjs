import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", {
  paths: [path.dirname(require.resolve("next/package.json"))],
}));
const root = fileURLToPath(new URL("../../", import.meta.url));
const sourceDirectory = path.join(root, "assets/brand-growth/originals");
const outputDirectory = path.join(root, "public/images/brand-growth");
const names = ["background", "brands", "downturn", "growth", "badge", "plaque", "intro", "strength"];
const manifest = [];

await mkdir(outputDirectory, { recursive: true });

for (const name of names) {
  const input = path.join(sourceDirectory, `${name}.png`);
  let image = sharp(input);
  let crop;

  if (name !== "background") {
    const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let left = info.width;
    let top = info.height;
    let right = 0;
    let bottom = 0;

    // Ignore almost invisible stray pixels while preserving the original glow.
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[(y * info.width + x) * 4 + 3] <= 5) continue;
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }

    const padding = 6;
    left = Math.max(0, left - padding);
    top = Math.max(0, top - padding);
    right = Math.min(info.width - 1, right + padding);
    bottom = Math.min(info.height - 1, bottom + padding);
    crop = { left, top, width: right - left + 1, height: bottom - top + 1 };
    image = sharp(input).extract(crop);
    if (name === "badge") image = image.resize({ width: 640, withoutEnlargement: true });
  }

  const output = await image.webp({
    quality: 90,
    alphaQuality: 100,
    nearLossless: name !== "background",
    effort: 6,
  }).toFile(path.join(outputDirectory, `${name}.webp`));
  manifest.push({ name, crop, width: output.width, height: output.height, bytes: output.size });
  console.log(`${name}: ${output.width}×${output.height}, ${Math.round(output.size / 1024)} KB`);
}

await writeFile(path.join(root, "scripts/brand-growth/asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
