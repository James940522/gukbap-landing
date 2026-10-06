import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Match the project's existing image pipeline without adding dependencies.
const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", {
  paths: [path.dirname(require.resolve("next/package.json"))],
}));
const root = fileURLToPath(new URL("../../", import.meta.url));
const config = JSON.parse(await readFile(new URL("gate-config.json", import.meta.url), "utf8"));
const source = await readFile(path.join(root, config.source));
const sourceHash = createHash("sha256").update(source).digest("hex");
const output = path.join(root, config.outputDirectory);
const { data: pixels, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
assert.equal(info.width, config.sourceWidth);
assert.equal(info.height, config.sourceHeight);
const { width, height } = info;
const raw = { width, height, channels: 4 };
const polygon = config.doorway.polygon;
const points = polygon.map((p) => p.join(",")).join(" ");
await mkdir(path.join(output, "debug"), { recursive: true });
await mkdir(path.join(output, "working"), { recursive: true });

function svg(content) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`);
}

function label(x, y, text, color = "#fff") {
  return `<g font-family="sans-serif" font-size="18" font-weight="700"><rect x="${x - 9}" y="${y - 24}" width="${text.length * 11 + 18}" height="34" rx="3" fill="#100c09" fill-opacity=".9"/><text x="${x}" y="${y}" fill="${color}">${text}</text></g>`;
}

async function detection() {
  const left = config.leftDoor;
  const right = config.rightDoor;
  const top = Math.min(left.y, right.y);
  const bottom = Math.max(left.y + left.height, right.y + right.height);
  const guide = svg(`
    <defs><clipPath id="doorway"><polygon points="${points}"/></clipPath></defs>
    <g clip-path="url(#doorway)">
      <rect x="${left.x}" y="${left.y}" width="${left.width}" height="${left.height}" fill="#22c9ed" fill-opacity=".27"/>
      <rect x="${right.x}" y="${right.y}" width="${right.width}" height="${right.height}" fill="#ff9645" fill-opacity=".27"/>
    </g>
    <polygon points="${points}" fill="none" stroke="#f7e271" stroke-width="2"/>
    <path d="M${config.seam.x} ${top - 15}V${bottom + 10}" stroke="#fff" stroke-width="2" stroke-dasharray="8 6"/>
    <g stroke="#60f9bb" stroke-width="2" stroke-dasharray="9 5">
      <path d="M${config.hinge.left} ${top - 20}V${bottom + 15}"/>
      <path d="M${config.hinge.right} ${top - 20}V${bottom + 15}"/>
    </g>
    ${label(35, 52, "FRAME / FIXED ARCHITECTURE", "#f7e271")}
    ${label(430, 490, "LEFT DOOR", "#7ce7ff")}
    ${label(855, 490, "RIGHT DOOR", "#ffbd82")}
    ${label(425, 254, "DOORWAY / FRAME BOUNDARY", "#f7e271")}
    ${label(35, 790, `LEFT HINGE x=${config.hinge.left}`, "#60f9bb")}
    ${label(1170, 790, `RIGHT x=${config.hinge.right}`, "#60f9bb")}
    ${label(615, 1078, `CENTER SEAM x=${config.seam.x}`)}
  `);
  await sharp(source).composite([{ input: guide }]).png().toFile(path.join(output, "debug/gate-detection.png"));
  console.log("Phase 1: debug/gate-detection.png");
}

function inPolygon(x, y) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const mask = new Uint8Array(width * height);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) mask[y * width + x] = Number(inPolygon(x + 0.5, y + 0.5));
}

async function doors() {
  assert.equal(config.leftDoor.x + config.leftDoor.width - config.rightDoor.x, config.seam.overlapPixels);
  assert.equal(config.hinge.left, config.leftDoor.x);
  assert.equal(config.hinge.right, config.rightDoor.x + config.rightDoor.width);
  for (const name of ["leftDoor", "rightDoor"]) {
    const box = config[name];
    const crop = Buffer.alloc(box.width * box.height * 4);
    const occupied = { left: box.width, top: box.height, right: -1, bottom: -1 };
    let transparent = 0;
    for (let y = 0; y < box.height; y++) {
      for (let x = 0; x < box.width; x++) {
        const original = ((y + box.y) * width + x + box.x) * 4;
        const target = (y * box.width + x) * 4;
        if (mask[original / 4]) {
          pixels.copy(crop, target, original, original + 4);
          occupied.left = Math.min(occupied.left, x);
          occupied.top = Math.min(occupied.top, y);
          occupied.right = Math.max(occupied.right, x);
          occupied.bottom = Math.max(occupied.bottom, y);
        } else transparent++;
      }
    }
    assert.ok(transparent > 0, `${name} must retain shaped transparent edges`);
    assert.deepEqual(occupied, { left: 0, top: 0, right: box.width - 1, bottom: box.height - 1 }, `${name} must be tight`);
    const image = sharp(crop, { raw: { width: box.width, height: box.height, channels: 4 } });
    await image.clone().png({ compressionLevel: 6 }).toFile(path.join(output, "working", box.asset));
    await image.png({ compressionLevel: 6 }).toFile(path.join(output, box.asset));
    console.log(`Phase 2: ${box.asset} ${box.width} x ${box.height}, ${transparent} transparent pixels`);
  }
}

async function frame() {
  const framePixels = Buffer.from(pixels);
  let removed = 0;
  for (let p = 0; p < mask.length; p++) {
    if (mask[p]) {
      // Zero RGB as well as alpha to avoid invisible source-door residues.
      framePixels.fill(0, p * 4, p * 4 + 4);
      removed++;
    }
  }
  await sharp(framePixels, { raw }).png().toFile(path.join(output, "working/gate-frame.png"));
  await sharp(framePixels, { raw }).webp(config.encoding.frame).toFile(path.join(output, "gate-frame.webp"));
  const decoded = await sharp(path.join(output, "gate-frame.webp")).ensureAlpha().raw().toBuffer();
  for (let p = 0; p < mask.length; p++) {
    const offset = p * 4;
    assert.equal(decoded[offset + 3], framePixels[offset + 3], `Frame alpha at pixel ${p}`);
    // WebP may normalize invisible RGB. Only alpha and visible colors matter.
    if (framePixels[offset + 3]) {
      for (let c = 0; c < 3; c++) assert.equal(decoded[offset + c], framePixels[offset + c], `Frame RGB at pixel ${p}`);
    }
  }
  const checker = svg(`<defs><pattern id="checker" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#e8e4de"/><path d="M0 0h20v20H0zM20 20h20v20H20z" fill="#b4b0ab"/></pattern></defs><rect width="100%" height="100%" fill="url(#checker)"/>`);
  await sharp(checker).composite([{ input: path.join(output, "gate-frame.webp") }]).png().toFile(path.join(output, "debug/gate-frame-checkerboard.png"));
  console.log(`Phase 3: gate-frame.webp; ${removed} truly transparent pixels; lossless visible RGB + alpha validation PASS`);
}

async function maskPreview() {
  const colored = Buffer.from(pixels);
  for (let p = 0; p < mask.length; p++) {
    const color = mask[p] ? [248, 45, 50] : [35, 205, 115];
    for (let c = 0; c < 3; c++) colored[p * 4 + c] = Math.round(pixels[p * 4 + c] * 0.64 + color[c] * 0.36);
  }
  await sharp(colored, { raw }).composite([{ input: svg(`
    <polygon points="${points}" fill="none" stroke="white" stroke-width="2"/>
    <path d="M${config.seam.x} ${config.leftDoor.y}V${config.leftDoor.y + config.leftDoor.height}" stroke="white" stroke-width="2"/>
    ${label(35, 53, "GREEN = FIXED FRAME", "#6cffb1")}
    ${label(35, 100, "RED = MOVING DOORS", "#ff9196")}
    ${label(402, 350, "LEFT DOOR")}
    ${label(850, 350, "RIGHT DOOR")}
  `) }]).png().toFile(path.join(output, "debug/gate-mask-preview.png"));
  console.log("Phase 4: debug/gate-mask-preview.png");
}

async function reconstruct() {
  const layers = [config.leftDoor, config.rightDoor].map((box) => ({
    input: path.join(output, box.asset), left: box.x, top: box.y,
  }));
  layers.push({ input: path.join(output, "gate-frame.webp"), left: 0, top: 0 });
  const result = await sharp({ create: { width, height, channels: 4, background: "#000" } })
    .composite(layers).png().toBuffer();
  await writeFile(path.join(output, "debug/gate-reconstructed.png"), result);
  const decoded = await sharp(result).ensureAlpha().raw().toBuffer();
  const difference = Buffer.alloc(width * height * 3);
  let absoluteError = 0;
  let squaredError = 0;
  let maxDifference = 0;
  let changedPixels = 0;
  let alphaDifference = 0;
  for (let p = 0; p < mask.length; p++) {
    let changed = false;
    assert.equal(pixels[p * 4 + 3], 255, "Source must be opaque for a black-background reconstruction");
    alphaDifference += Number(decoded[p * 4 + 3] !== pixels[p * 4 + 3]);
    for (let c = 0; c < 3; c++) {
      const delta = Math.abs(decoded[p * 4 + c] - pixels[p * 4 + c]);
      difference[p * 3 + c] = Math.min(255, delta * 16);
      absoluteError += delta;
      squaredError += delta * delta;
      maxDifference = Math.max(maxDifference, delta);
      changed ||= delta > 0;
    }
    changedPixels += Number(changed);
  }
  await sharp(difference, { raw: { width, height, channels: 3 } }).png()
    .toFile(path.join(output, "debug/gate-difference-x16.png"));
  const frameAlpha = await sharp(path.join(output, "gate-frame.webp")).ensureAlpha().extractChannel("alpha").raw().toBuffer();
  let frameMaskErrors = 0;
  let uncoveredPixels = 0;
  const doorCoverage = new Uint8Array(mask.length);
  for (const box of [config.leftDoor, config.rightDoor]) {
    const alpha = await sharp(path.join(output, box.asset)).extractChannel("alpha").raw().toBuffer();
    for (let y = 0; y < box.height; y++) {
      for (let x = 0; x < box.width; x++) {
        if (alpha[y * box.width + x]) doorCoverage[(y + box.y) * width + x + box.x]++;
      }
    }
  }
  for (let p = 0; p < mask.length; p++) {
    frameMaskErrors += Number(frameAlpha[p] !== (mask[p] ? 0 : 255));
    uncoveredPixels += Number(mask[p] && !doorCoverage[p]);
  }
  const assets = [];
  for (const name of ["gate-frame.webp", config.leftDoor.asset, config.rightDoor.asset]) {
    const meta = await sharp(path.join(output, name)).metadata();
    assets.push({ file: name, width: meta.width, height: meta.height, hasAlpha: meta.hasAlpha, bytes: (await stat(path.join(output, name))).size });
  }
  const report = {
    source: config.source, sourceSha256: sourceHash, sourceWidth: width, sourceHeight: height,
    configSha256: createHash("sha256").update(JSON.stringify(config)).digest("hex"),
    compositionOrder: ["black background", config.leftDoor.asset, config.rightDoor.asset, "gate-frame.webp"],
    reconstruction: { status: maxDifference === 0 && alphaDifference === 0 ? "PASS" : "FAIL", changedPixels,
      maxChannelDifference: maxDifference, meanAbsoluteError: absoluteError / (width * height * 3),
      rootMeanSquareError: Math.sqrt(squaredError / (width * height * 3)), alphaDifference },
    masking: { status: frameMaskErrors === 0 && uncoveredPixels === 0 ? "PASS" : "FAIL", frameMaskErrors, uncoveredPixels,
      transparentDoorwayPixels: mask.reduce((sum, value) => sum + value, 0), seamOverlapPixels: config.seam.overlapPixels },
    assets,
  };
  await writeFile(path.join(output, "debug/gate-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  assert.equal(report.reconstruction.status, "PASS", "Reconstruction must pass before opening tests");
  assert.equal(report.masking.status, "PASS", "No gaps or source-door remnants are allowed");
}

async function preview() {
  const report = JSON.parse(await readFile(path.join(output, "debug/gate-validation.json"), "utf8"));
  assert.equal(report.sourceSha256, sourceHash, "Re-run reconstruction for the current source");
  assert.equal(report.configSha256, createHash("sha256").update(JSON.stringify(config)).digest("hex"), "Re-run reconstruction for the current geometry");
  assert.equal(report.reconstruction.status, "PASS");
  assert.equal(report.masking.status, "PASS");
  const position = (box) => `left:${box.x / width * 100}%;top:${box.y / height * 100}%;width:${box.width / width * 100}%;height:${box.height / height * 100}%;`;
  const variables = {
    ASPECT_RATIO: `${width} / ${height}`, WIDTH: width, HEIGHT: height,
    LEFT_STYLE: position(config.leftDoor), RIGHT_STYLE: position(config.rightDoor),
    LEFT_ASSET: config.leftDoor.asset, RIGHT_ASSET: config.rightDoor.asset,
    LEFT_WIDTH: config.leftDoor.width, LEFT_HEIGHT: config.leftDoor.height,
    RIGHT_WIDTH: config.rightDoor.width, RIGHT_HEIGHT: config.rightDoor.height,
    DOOR_Z: config.preview.zIndex.doors, FRAME_Z: config.preview.zIndex.frame,
    PERSPECTIVE: config.preview.perspective,
    OPEN_ANGLE: config.preview.openAngle, MIN_ANGLE: config.preview.minAngle,
    MAX_ANGLE: config.preview.maxAngle, DURATION: config.preview.durationMs,
  };
  const template = await readFile(new URL("gate-layer-preview.template.html", import.meta.url), "utf8");
  const html = template.replace(/__([A-Z_]+)__/g, (_, key) => {
    assert.ok(Object.hasOwn(variables, key), `Unknown template token ${key}`);
    return String(variables[key]);
  });
  await writeFile(path.join(output, "debug/gate-layer-preview.html"), html);
  console.log("Phase 6: debug/gate-layer-preview.html (asset verification document)");
}

async function optimize() {
  const compression = [];
  for (const box of [config.leftDoor, config.rightDoor]) {
    const working = path.join(output, "working", box.asset);
    const target = path.join(output, box.asset);
    await sharp(working).png(config.encoding.doors).toFile(target);
    const before = await sharp(working).raw().toBuffer();
    const after = await sharp(target).raw().toBuffer();
    assert.ok(before.equals(after), `${box.asset}: compression must not change any pixels`);
    compression.push({ asset: box.asset, workingBytes: (await stat(working)).size, finalBytes: (await stat(target)).size });
  }
  const workingFrame = path.join(output, "working/gate-frame.png");
  await sharp(workingFrame).webp(config.encoding.frame).toFile(path.join(output, "gate-frame.webp"));
  compression.push({ asset: "gate-frame.webp", workingBytes: (await stat(workingFrame)).size, finalBytes: (await stat(path.join(output, "gate-frame.webp"))).size });
  await reconstruct();
  await writeFile(path.join(output, "debug/gate-optimization.json"), `${JSON.stringify({
    encoding: config.encoding, compression, decision: "Lossless WebP frame and RGBA PNG doors preserve exact reconstruction; no downsampling or palette quantization.",
  }, null, 2)}\n`);
  console.log("Phase 9: optimized final assets; working PNGs preserved; reconstruction PASS");
}

const phase = process.argv[2];
if (phase === "detection") await detection();
else if (phase === "doors") await doors();
else if (phase === "frame") await frame();
else if (phase === "mask") await maskPreview();
else if (phase === "reconstruct") await reconstruct();
else if (phase === "preview") await preview();
else if (phase === "optimize") await optimize();
else if (phase === "all") {
  await detection();
  await doors();
  await frame();
  await maskPreview();
  await reconstruct();
  await preview();
  await optimize();
}
else throw new Error("Usage: node scripts/hero/gate-assets.mjs detection|doors|frame|mask|reconstruct|preview|optimize|all");

// All writes are to derived paths; also fail if the source changes during a run.
assert.equal(createHash("sha256").update(await readFile(path.join(root, config.source))).digest("hex"), sourceHash);
