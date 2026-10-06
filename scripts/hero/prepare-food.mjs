import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", {
  paths: [path.dirname(require.resolve("next/package.json"))],
}));
const root = fileURLToPath(new URL("../../", import.meta.url));
const directory = path.join(root, "public/images/hero");
const sourcePath = path.join(directory, "source/gukbap-table-original.jpg");
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");
await mkdir(path.dirname(sourcePath), { recursive: true });
if (process.argv[2]) {
  try {
    await copyFile(process.argv[2], sourcePath, constants.COPYFILE_EXCL);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    assert.equal(hash(await readFile(sourcePath)), hash(await readFile(process.argv[2])), "Preserved food source differs; choose a new filename instead of overwriting it.");
  }
}
const source = await readFile(sourcePath);
const sourceHash = hash(source);
const metadata = await sharp(source).metadata();
const output = await sharp(source).rotate().webp({ quality: 90, effort: 6 })
  .toFile(path.join(directory, "gukbap-table.webp"));
assert.equal(output.width, 1280);
assert.equal(output.height, 960);
assert.equal(hash(await readFile(sourcePath)), sourceHash);
const manifest = {
  source: "public/images/hero/source/gukbap-table-original.jpg",
  sourceSha256: sourceHash,
  sourceWidth: metadata.width,
  sourceHeight: metadata.height,
  sourceBytes: source.length,
  output: "/images/hero/gukbap-table.webp",
  width: output.width,
  height: output.height,
  bytes: output.size,
  encoding: { format: "webp", quality: 90, effort: 6, resized: false, cropped: false },
  note: "User-supplied photograph. Preserve the whole table composition. No generative edits, bubbling, or animated steam.",
};
await writeFile(new URL("food-manifest.json", import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
