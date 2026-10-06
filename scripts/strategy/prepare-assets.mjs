import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Use the encoder already installed with Next.js. No package changes required.
const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [path.dirname(require.resolve("next/package.json"))] }));
const root = fileURLToPath(new URL("../../", import.meta.url));
const directory = path.join(root, "public/images/strategy");
await mkdir(path.join(directory, "debug"), { recursive: true });
await mkdir(path.join(directory, "icons"), { recursive: true });

const assets = [
  { name: "bg-paper-texture", width: 1536, quality: 78, alpha: false },
  { name: "bg-hanok-left", width: 1000, quality: 84, alpha: true },
  { name: "bg-food-right", width: 1920, quality: 85, alpha: false },
  { name: "bg-food-mobile", width: 1161, quality: 86, alpha: false },
  { name: "board-frame", width: 1100, quality: 86, alpha: true },
];
const manifest = [];
for (const asset of assets) {
  const input = await readFile(path.join(directory, "working", `${asset.name}.png`));
  const info = await sharp(input).metadata();
  if (asset.alpha) assert.equal(info.hasAlpha, true, `${asset.name} must retain generated alpha`);
  const result = await sharp(input)
    .resize({ width: asset.width, withoutEnlargement: true })
    .webp({ quality: asset.quality, alphaQuality: 100, effort: 6 })
    .toFile(path.join(directory, `${asset.name}.webp`));
  const outputMetadata = await sharp(path.join(directory, `${asset.name}.webp`)).metadata();
  const stats = await sharp(path.join(directory, `${asset.name}.webp`)).stats();
  if (asset.alpha) assert.ok(stats.channels[3].min === 0 && stats.channels[3].max === 255, `${asset.name}: real transparency required`);
  manifest.push({
    file: `${asset.name}.webp`, width: result.width, height: result.height,
    bytes: result.size, alpha: outputMetadata.hasAlpha,
    sourceSha256: createHash("sha256").update(input).digest("hex"),
    provenance: "Restored with built-in image_gen using the supplied design as reference; not a pixel-exact crop.",
  });
}

const icons = JSON.parse(await readFile(path.join(root, "src/data/strategy-icons.json"), "utf8"));
for (const [name, icon] of Object.entries(icons)) {
  const file = name === "check" ? "check.svg" : `icon-${name}.svg`;
  const color = name === "check" ? "#ad181b" : "#f6e9cb";
  await writeFile(path.join(directory, "icons", file), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" fill="none" stroke="${color}" stroke-width="${icon.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${icon.paths.map((d) => `<path d="${d}"/>`).join("")}</svg>\n`);
}

const width = 1624, height = 968;
const original = await readFile(path.join(directory, "source/strategy-section-original.png"));
const sourceInfo = await sharp(original).metadata();
assert.equal(sourceInfo.width, width);
assert.equal(sourceInfo.height, height);
const svg = (markup, w = width, h = height) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${markup}</svg>`);
const label = (x, y, text, color) => `<g font-family="sans-serif" font-size="19" font-weight="700"><rect x="${x - 8}" y="${y - 23}" width="${text.length * 11.7 + 16}" height="32" rx="3" fill="#17120f" fill-opacity=".95"/><text x="${x}" y="${y}" fill="${color}">${text}</text></g>`;
const graph = "M158 984 655 638 1018 550 1407 197";
const foodPolygon = "158,968 655,638 1018,550 1592,0 1624,0 1624,968";
const boundaries = svg(`
  <rect x="4" y="4" width="1616" height="960" fill="#ffc94d" fill-opacity=".08" stroke="#ffc94d" stroke-width="4"/>
  <rect x="4" y="4" width="832" height="960" fill="#5cafff" fill-opacity=".14" stroke="#5cafff" stroke-width="3" stroke-dasharray="12 8"/>
  <rect x="150" y="50" width="530" height="490" fill="#b39aff" fill-opacity=".22" stroke="#b39aff" stroke-width="4"/>
  <polygon points="${foodPolygon}" fill="#31d9a7" fill-opacity=".2" stroke="#31d9a7" stroke-width="4"/>
  <path d="${graph}" fill="none" stroke="#ff567d" stroke-width="40" stroke-opacity=".65"/>
  <g fill="#ff923d" fill-opacity=".25" stroke="#ff923d" stroke-width="4"><rect x="256" y="576" width="157" height="289"/><rect x="674" y="360" width="157" height="260"/><rect x="850" y="237" width="157" height="339"/></g>
  ${label(24, 40, "02 / HANOK DECORATION", "#79c3ff")}
  ${label(850, 40, "01 / PAPER BACKGROUND", "#ffc94d")}
  ${label(185, 89, "03 / BOARD + LIVE TEXT", "#d0baff")}
  ${label(1060, 865, "04 / FOOD COLLAGE", "#63ffd3")}
  ${label(575, 710, "05 / SVG GRAPH", "#ff9eb9")}
  ${label(755, 220, "06 / HTML BADGES + SVG NODES", "#ffbe8e")}
`);
await sharp(original).composite([{ input: boundaries }]).png().toFile(path.join(directory, "debug/asset-boundary-preview.png"));

const board = await sharp(path.join(directory, "board-frame.webp")).resize(864, 800, { fit: "fill" }).toBuffer();
const checker = svg(`<defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="#dedbd4"/><path d="M0 0h16v16H0ZM16 16h16v16H16Z" fill="#c4c1ba"/></pattern></defs><rect width="1024" height="980" fill="url(#grid)"/>`, 1024, 980);
const boardOverlay = svg(`
  <rect x="166" y="175" width="692" height="603" fill="#35c599" fill-opacity=".18" stroke="#138b67" stroke-width="3" stroke-dasharray="10 7"/>
  ${label(120, 40, "BOARD / ALPHA EXTERIOR + EMPTY PAPER", "#fff")}
  ${label(207, 234, "LIVE HTML TEXT SAFE AREA", "#65f0c4")}
  ${label(170, 935, "No letters or checkmarks in the image asset", "#fff")}
`, 1024, 980);
await sharp(checker).composite([{ input: board, left: 80, top: 70 }, { input: boardOverlay }]).png().toFile(path.join(directory, "debug/board-mask-preview.png"));

const food = await sharp(path.join(directory, "bg-food-right.webp")).resize(width, height, { fit: "cover" }).toBuffer();
const mask = svg(`<polygon points="${foodPolygon}" fill="#fff"/>`);
const maskedFood = await sharp(food).ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
const paper = await sharp(path.join(directory, "bg-paper-texture.webp")).resize(width, height, { fit: "cover" }).toBuffer();
const foodOverlay = svg(`
  <polygon points="${foodPolygon}" fill="none" stroke="#35c599" stroke-width="4" stroke-dasharray="14 10"/>
  <path d="${graph}" fill="none" stroke="#ad181b" stroke-width="30"/>
  ${label(70, 95, "PAPER / INDEPENDENT BACKGROUND", "#fff")}
  ${label(750, 865, "FOOD / CSS CLIP-PATH", "#63ffd3")}
  ${label(780, 913, "RED GRAPH / SEPARATE SVG", "#ffacb3")}
`);
await sharp(paper).composite([{ input: maskedFood }, { input: foodOverlay }]).png().toFile(path.join(directory, "debug/food-mask-preview.png"));

await writeFile(path.join(directory, "source/asset-manifest.json"), `${JSON.stringify({ assets: manifest, totalBytes: manifest.reduce((sum, item) => sum + item.bytes, 0) }, null, 2)}\n`);
for (const item of manifest) console.log(`${item.file}: ${item.width}×${item.height}, ${(item.bytes / 1024).toFixed(0)} KiB, alpha=${item.alpha}`);
console.log(`Debug previews: ${(await stat(path.join(directory, "debug/asset-boundary-preview.png"))).size} bytes; all assets verified.`);
