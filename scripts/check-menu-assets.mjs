import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = readFileSync(new URL("../src/data/menus.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { menuCategories } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const committedPaths = new Set(
  execFileSync("git", ["ls-files", "-z", "public/asset/menu"], { cwd: root })
    .toString("utf8")
    .split("\0")
    .filter(Boolean),
);

let checked = 0;
for (const category of menuCategories) {
  for (const menu of category.items) {
    const path = `public${decodeURIComponent(menu.image)}`;
    // Check Git's exact bytes, since macOS filesystem lookups hide NFC/NFD errors.
    assert.ok(committedPaths.has(path), `${menu.name}: URL does not match a Git filename: ${path}`);
    assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), `${menu.name}: missing local asset`);
    checked++;
  }
}
assert.ok(checked > 0, "No menu assets checked");
console.log(`Verified ${checked} menu image URLs against exact Git filenames and local assets.`);
