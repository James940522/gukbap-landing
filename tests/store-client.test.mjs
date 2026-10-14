import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadTypeScript(file, globals = {}) {
  const source = fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: compiledModule, exports: compiledModule.exports, URL, ...globals,
  }, { filename: file });
  return compiledModule.exports;
}

const search = loadTypeScript("src/lib/store-search.ts");
const store = {
  id: "test-only-01", region: "경기", name: "테스트 매장 A", address: "테스트시  예시로 10",
  latitude: 37.5, longitude: 127, phone: "02-1234-5678", status: "OPEN", coordinateStatus: "provided",
};

test("search normalizes spaces and case across region, name and address, excluding CLOSED", () => {
  const stores = [store, { ...store, id: "closed", status: "CLOSED" }];
  for (const query of ["  경기  ", "매장   a", "테스트시 예시로", " \n "]) {
    assert.equal(search.filterStores(stores, query).length, 1);
  }
  assert.equal(search.filterStores(stores, "없는 결과").length, 0);
});

test("directions encode external strings; missing/invalid coordinates use address search", () => {
  const directions = search.getStoreDirections({ ...store, name: '<img src=x onerror="alert(1)">' });
  assert.equal(directions.label, "길찾기");
  assert.ok(directions.href.startsWith("https://map.kakao.com/link/to/%3Cimg"));
  assert.ok(directions.href.endsWith(",37.5,127"));
  for (const latitude of [null, NaN, Infinity, 91]) {
    const result = search.getStoreDirections({ ...store, latitude });
    assert.equal(result.label, "주소로 검색");
    assert.ok(result.href.startsWith("https://map.kakao.com/link/search/"));
  }
  assert.equal(search.getStorePhoneHref("02-1234-5678"), "tel:0212345678");
  assert.equal(search.getStorePhoneHref("javascript:alert(1)"), undefined);
});

test("malformed API responses are errors; valid zero stores remain a normal result", () => {
  assert.equal(search.readStoresResponse({ stores: [], total: 0, withCoordinates: 0 }).length, 0);
  for (const response of [null, {}, { stores: [], total: 0 },
    { stores: [{ ...store, address: null }], total: 1, withCoordinates: 1 }]) {
    assert.throws(() => search.readStoresResponse(response));
  }
  assert.equal(search.readStoresResponse({ stores: [store], total: 1, withCoordinates: 1 }).length, 1);
});

function sdkFixture() {
  const scripts = [];
  class Script extends EventTarget {
    src = "";
    dataset = {};
    remove() { const index = scripts.indexOf(this); if (index >= 0) scripts.splice(index, 1); }
  }
  const window = { setTimeout, clearTimeout };
  const document = {
    scripts,
    createElement: () => new Script(),
    head: { appendChild: (script) => scripts.push(script) },
  };
  const maps = {
    load: (callback) => callback(), Map: class {}, LatLng: class {}, LatLngBounds: class {}, CustomOverlay: class {},
  };
  const loader = loadTypeScript("src/lib/kakao-maps.ts", { window, document });
  return { ...loader, window, document, maps };
}

test("SDK loading deduplicates concurrent mounts and waits for maps.load", async () => {
  const fixture = sdkFixture();
  const first = fixture.loadKakaoMaps("test-key", 200);
  const second = fixture.loadKakaoMaps("test-key", 200);
  assert.equal(first, second);
  assert.equal(fixture.document.scripts.length, 1);
  assert.equal(new URL(fixture.document.scripts[0].src).searchParams.get("autoload"), "false");
  let complete;
  fixture.window.kakao = { maps: { ...fixture.maps, load: (callback) => { complete = callback; } } };
  fixture.document.scripts[0].dispatchEvent(new Event("load"));
  assert.equal(typeof complete, "function");
  complete();
  assert.equal(await first, fixture.window.kakao.maps);
});

test("SDK error removes the failed script and permits a fresh retry", async () => {
  const fixture = sdkFixture();
  const failed = fixture.loadKakaoMaps("test-key", 200);
  fixture.document.scripts[0].dispatchEvent(new Event("error"));
  await assert.rejects(failed);
  assert.equal(fixture.document.scripts.length, 0);
  const retry = fixture.loadKakaoMaps("test-key", 200);
  fixture.window.kakao = { maps: fixture.maps };
  fixture.document.scripts[0].dispatchEvent(new Event("load"));
  assert.equal(await retry, fixture.maps);
});

test("SDK timeout, including a maps.load that never completes, is recoverable", async () => {
  const fixture = sdkFixture();
  const timeout = fixture.loadKakaoMaps("test-key", 5);
  fixture.window.kakao = { maps: { ...fixture.maps, load: () => {} } };
  fixture.document.scripts[0].dispatchEvent(new Event("load"));
  await assert.rejects(timeout);
  assert.equal(fixture.document.scripts.length, 0);
  const retry = fixture.loadKakaoMaps("test-key", 200);
  fixture.window.kakao = { maps: fixture.maps };
  fixture.document.scripts[0].dispatchEvent(new Event("load"));
  assert.equal(await retry, fixture.maps);
});

test("an existing SDK from a different application is never reused or removed", async () => {
  const fixture = sdkFixture();
  const otherScript = fixture.document.createElement("script");
  otherScript.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=other-test-app&autoload=false";
  fixture.document.head.appendChild(otherScript);
  await assert.rejects(fixture.loadKakaoMaps("test-key", 200));
  assert.equal(fixture.document.scripts[0], otherScript);
  assert.equal(fixture.document.scripts.length, 1);
});

test("an already loaded matching SDK works after unmount/remount", async () => {
  const fixture = sdkFixture();
  const script = fixture.document.createElement("script");
  script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=test-key&autoload=false";
  fixture.document.head.appendChild(script);
  fixture.window.kakao = { maps: fixture.maps };
  assert.equal(await fixture.loadKakaoMaps("test-key", 200), fixture.maps);
  assert.equal(fixture.document.scripts.length, 1);
  await assert.rejects(fixture.loadKakaoMaps("other-test-app", 200));
});
