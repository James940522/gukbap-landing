import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Reuse Next.js's installed image encoder; no additional dependency is needed.
const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", {
  paths: [path.dirname(require.resolve("next/package.json"))],
}));
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const sourceDirectory = process.argv[2];
if (!sourceDirectory) {
  throw new Error("Usage: node scripts/optimize-backgrounds.mjs /path/to/source-images");
}

const assets = [
  ["12_001.jpeg", "wood-table"],
  ["12_002.png", "hanok-window"],
  ["12_003.jpeg", "warm-hanji"],
  ["12_004.jpeg", "rising-steam"],
  ["12_005.jpeg", "dark-stone"],
  ["13_006.jpeg", "amber-light"],
  ["13_007.jpeg", "steaming-ttukbaegi"],
  ["13_008.jpeg", "gold-brush-ring"],
  ["13_009.jpeg", "cooking-steam"],
];
const outputDirectory = path.join(projectRoot, "public/images/backgrounds");
const recordDirectory = path.join(projectRoot, "assets/backgrounds");
await mkdir(outputDirectory, { recursive: true });
await mkdir(recordDirectory, { recursive: true });

const manifest = [];
for (const [suffix, name] of assets) {
  const source = `KakaoTalk_Image_2026-10-01-13-43-${suffix}`;
  const input = await readFile(path.join(sourceDirectory, source));
  const output = `/images/backgrounds/${name}.webp`;
  const result = await sharp(input)
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(path.join(outputDirectory, `${name}.webp`));
  manifest.push({
    source,
    sha256: createHash("sha256").update(input).digest("hex"),
    output,
    width: result.width,
    height: result.height,
    sourceBytes: input.length,
    webpBytes: result.size,
  });
  console.log(`${name}: ${(input.length / 1024).toFixed(1)} → ${(result.size / 1024).toFixed(1)} KiB`);
}

await writeFile(path.join(recordDirectory, "manifest.json"), `${JSON.stringify({
  encoding: { format: "webp", quality: 78, effort: 6, maxWidth: 1920, upscaled: false },
  assets: manifest,
}, null, 2)}\n`);
const original = manifest.reduce((sum, asset) => sum + asset.sourceBytes, 0);
const optimized = manifest.reduce((sum, asset) => sum + asset.webpBytes, 0);
console.log(`Total: ${(original / 1024).toFixed(1)} → ${(optimized / 1024).toFixed(1)} KiB (${(100 - optimized / original * 100).toFixed(1)}% smaller)`);
