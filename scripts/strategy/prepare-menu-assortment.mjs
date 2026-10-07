import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", {
  paths: [path.dirname(require.resolve("next/package.json"))],
}));
const source = process.argv[2];
if (!source) throw new Error("Usage: node scripts/strategy/prepare-menu-assortment.mjs <original.jpg>");

const original = await readFile(source);
const metadata = await sharp(original).metadata();
const output = "/images/strategy/menu-assortment-hq.webp";
const result = await sharp(original)
  .rotate()
  .resize({ width: 5120, withoutEnlargement: true, kernel: "lanczos3" })
  .webp({ quality: 90, effort: 6 })
  .toFile(path.join(process.cwd(), "public", output));

const manifest = {
  source: path.basename(source),
  sourceSha256: createHash("sha256").update(original).digest("hex"),
  sourceFormat: metadata.format,
  sourceWidth: metadata.width,
  sourceHeight: metadata.height,
  sourceBytes: original.length,
  output,
  width: result.width,
  height: result.height,
  bytes: result.size,
  encoding: { format: "webp", quality: 90, effort: 6, resized: true, cropped: false },
  note: "User-supplied high-resolution original, downsampled for QHD at up to 2x pixel density. No generative edits or color correction. Original file remains untouched.",
};
await writeFile("scripts/strategy/menu-assortment-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
