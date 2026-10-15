import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", {
  paths: [path.dirname(require.resolve("next/package.json"))],
}));
const root = fileURLToPath(new URL("../", import.meta.url));
const source = await readFile(path.join(root, "assets/brand/favicon-master.png"));
const output = path.join(root, "src/app");
await mkdir(output, { recursive: true });

async function png(size, rgba = false) {
  const image = sharp(source)
    .resize(size, size, { fit: "contain", background: "#161410" });
  // Turbopack's ICO decoder requires embedded PNG frames to be RGBA.
  if (rgba) return image.ensureAlpha().png({ compressionLevel: 9 }).toBuffer();
  return image.removeAlpha()
    .png({ palette: true, colours: 128, dither: 0, compressionLevel: 9 })
    .toBuffer();
}

// Next.js discovers these files automatically. Preserve their public URLs.
await writeFile(path.join(output, "icon.png"), await png(512));
await writeFile(path.join(output, "apple-icon.png"), await png(180));

// ICO supports multiple PNG frames, covering browser tabs and high-DPI surfaces.
const sizes = [16, 32, 48, 64, 96, 128, 256];
const frames = await Promise.all(sizes.map((size) => png(size, true)));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2); // Image type: icon.
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (let i = 0; i < sizes.length; i++) {
  const entry = 6 + i * 16;
  directory[entry] = sizes[i] === 256 ? 0 : sizes[i];
  directory[entry + 1] = directory[entry];
  directory.writeUInt16LE(1, entry + 4); // Color planes.
  directory.writeUInt16LE(32, entry + 6); // RGBA PNG frames.
  directory.writeUInt32LE(frames[i].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frames[i].length;
}
await writeFile(path.join(output, "favicon.ico"), Buffer.concat([directory, ...frames]));
console.log(`Generated icon.png (512px), apple-icon.png (180px), favicon.ico (${sizes.join("/")}px).`);
