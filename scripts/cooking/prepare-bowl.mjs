import { createRequire } from "node:module";
import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", {
  paths: [require.resolve("next/package.json")],
}));
const directory = fileURLToPath(new URL("../../public/images/cooking/", import.meta.url));
await mkdir(directory, { recursive: true });
const source = `${directory}source/table-original.jpg`;
if (process.argv[2]) {
  await mkdir(`${directory}source`, { recursive: true });
  await copyFile(process.argv[2], source);
}

// Crop the upper-left sundae-gukbap from the supplied table photograph.
// Keep the original photograph intact; no generated food or added steam.
await sharp(source)
  .extract({ left: 226, top: 73, width: 376, height: 376 })
  .webp({ quality: 94, effort: 6 })
  .toFile(`${directory}sundae-gukbap.webp`);
