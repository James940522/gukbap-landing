import { createRequire } from "node:module";
import { copyFile, mkdir, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", {
  paths: [require.resolve("next/package.json")],
}));
const directory = fileURLToPath(new URL("../../public/images/bowls/", import.meta.url));
const manifest = JSON.parse(await readFile(new URL("./bowl-manifest.json", import.meta.url), "utf8"));
const importDirectory = process.argv[2];
const importFiles = importDirectory ? await readdir(importDirectory) : [];
await mkdir(join(directory, "source"), { recursive: true });

for (const asset of manifest) {
  const source = join(directory, "source", `${asset.id}.png`);
  if (importDirectory) {
    // macOS filenames may use decomposed Korean characters.
    const filename = importFiles.find((name) => name.normalize("NFC") === asset.original.normalize("NFC"));
    if (!filename) throw new Error(`Missing supplied image: ${asset.original}`);
    await copyFile(join(importDirectory, filename), source);
  }

  // Preserve the complete bowl and its alpha channel. Keep the PNG unchanged.
  const result = await sharp(source)
    .webp({ quality: 94, effort: 6 })
    .toFile(join(directory, `${asset.id}.webp`));
  console.log(`${asset.id}.webp: ${result.width}×${result.height}, ${result.size} bytes`);
}
