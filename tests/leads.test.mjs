import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

// Run with: node --test tests/leads.test.mjs
// TypeScript modules execute with a private environment and mocked fetch. No .env
// files are loaded and these tests cannot send a real notification.
const requireDependency = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultEnv = {
  SOLAPI_API_KEY: " test-api-key ",
  SOLAPI_API_SECRET: " test-api-secret ",
  SMS_TO: " 010-9876-5432 ",
  SMS_FROM: " 02-1234-5678 ",
};

function createHarness({ env = defaultEnv, provider } = {}) {
  const modules = new Map();
  const requests = [];
  const logs = [];
  let sequence = 0;
  let now = Date.parse("2026-10-14T00:00:00.000Z");
  class TestDate extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const context = vm.createContext({
    process: { env: { ...env } },
    Buffer, FormData, Request, Response, Headers, Uint8Array, URL, AbortSignal,
    TextEncoder, TextDecoder, Date: TestDate, setTimeout, clearTimeout,
    console: Object.fromEntries(["error", "warn", "log"].map((level) => [level,
      (...args) => logs.push({ level, args }),
    ])),
    fetch: async (url, options) => {
      requests.push({ url, options });
      return provider
        ? provider(url, options)
        : Response.json({ messageId: "test-message", groupId: "test-group" });
    },
  });

  function load(file) {
    const absolute = path.resolve(root, file);
    if (modules.has(absolute)) return modules.get(absolute).exports;
    const compiled = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        esModuleInterop: true },
    }).outputText;
    const loaded = { exports: {} };
    modules.set(absolute, loaded);
    const localRequire = (name) => {
      if (name === "server-only") return {};
      if (name.startsWith("@/") || name.startsWith(".")) {
        const base = name.startsWith("@/")
          ? path.join(root, "src", name.slice(2))
          : path.resolve(path.dirname(absolute), name);
        const resolved = [base, `${base}.ts`, path.join(base, "index.ts")]
          .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
        if (!resolved) throw new Error(`Cannot resolve ${name} from ${file}`);
        return load(resolved);
      }
      return requireDependency(name);
    };
    const execute = vm.runInContext(`(function (exports, require, module) {\n${compiled}\n})`,
      context, { filename: absolute });
    execute(loaded.exports, localRequire, loaded);
    return loaded.exports;
  }

  const contact = load("src/app/api/contact/route.ts").POST;
  const leads = load("src/app/api/leads/route.ts").POST;
  return {
    contact, leads, requests, logs,
    advanceTime(milliseconds) { now += milliseconds; },
    request(body, { route = "contact", headers = {} } = {}) {
      return new Request(`http://localhost:3000/api/${route}`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": `192.0.2.${++sequence}`,
          ...headers },
        body: typeof body === "string" ? body : JSON.stringify(body),
      });
    },
  };
}

function canonical(overrides = {}) {
  return {
    name: " 테스트 문의자 ", phoneFirst: "010", phoneMiddle: "1234", phoneLast: "5678",
    desiredRegion: " 서울 마포구 ", expectedBudget: "상담 후 결정",
    inquiryDetail: " 창업 비용과 개설 절차를 문의합니다. ",
    referralSources: ["네이버 검색", "인스타그램"], privacyAgreed: true,
    hp: "", domain: " ddukson.example ", ...overrides,
  };
}

function compact(overrides = {}) {
  return { name: "빠른 문의자", phone: "010-1234-5678", region: "군포시",
    message: "개설 절차가 궁금합니다.", privacyAgree: true, source: "floating", hp: "",
    ...overrides };
}

function sentMessage(harness, index = 0) {
  const { url, options } = harness.requests[index];
  assert.equal(url, "https://api.solapi.com/messages/v4/send");
  assert.equal(options.method, "POST");
  const body = JSON.parse(options.body);
  assert.deepEqual(Object.keys(body), ["message"]);
  assert.equal(Array.isArray(body.message), false);
  return { ...body.message, options };
}

test("canonical inquiry sends one branded SOLAPI message with normalized numbers and valid HMAC", async () => {
  const h = createHarness();
  const response = await h.contact(h.request(canonical()));
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.ok, true);
  assert.deepEqual(result.notification,
    { status: "sent", provider: "solapi", messageId: "test-message", groupId: "test-group" });
  assert.equal(h.requests.length, 1);
  const message = sentMessage(h);
  assert.equal(message.to, "01098765432");
  assert.equal(message.from, "0212345678");
  for (const part of ["[뚝손국밥 창업문의]", "성함: 테스트 문의자", "연락처: 01012345678",
    "창업 희망 지역: 서울 마포구", "예상 창업 비용: 상담 후 결정",
    "방문 유입 경로: 네이버 검색, 인스타그램", "접수 도메인: ddukson.example",
    "문의 내용:\n창업 비용과 개설 절차를 문의합니다."]) {
    assert.ok(message.text.includes(part), `Notification must contain ${part}`);
  }
  assert.ok(!message.text.includes("곱도리"));
  const headers = new Headers(message.options.headers);
  assert.equal(headers.get("content-type"), "application/json");
  const authorization = headers.get("authorization");
  const auth = authorization.match(/^HMAC-SHA256 apiKey=([^,]+), date=([^,]+), salt=([^,]+), signature=([a-f0-9]{64})$/);
  assert.ok(auth, "SOLAPI authorization must contain its API key, timestamp, salt, and signature");
  assert.equal(auth[1], "test-api-key");
  assert.equal(auth[4], createHmac("sha256", "test-api-secret").update(auth[2] + auth[3]).digest("hex"));
});

test("/api/leads accepts the canonical contract and keeps both existing compact inquiry sources working", async () => {
  const h = createHarness();
  for (const body of [canonical(), compact(), compact({ source: "contact", message: "" })]) {
    const response = await h.leads(h.request(body, { route: "leads" }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);
  }
  assert.equal(h.requests.length, 3);
  const quick = sentMessage(h, 1);
  assert.ok(quick.text.includes("빠른 문의자"));
  assert.ok(quick.text.includes("01012345678"));
  assert.ok(quick.text.includes("군포시"));
  assert.ok(quick.text.includes("개설 절차가 궁금합니다."));
});

test("invalid JSON and canonical fields fail before any notification request", async () => {
  const h = createHarness();
  const invalidBodies = ["{broken", "null", "[]", canonical({ name: "김" }),
    canonical({ phoneFirst: "0x0" }), canonical({ phoneMiddle: "12" }),
    canonical({ phoneLast: "123" }), canonical({ desiredRegion: "서" }),
    canonical({ expectedBudget: " " }), canonical({ inquiryDetail: "짧음" }),
    canonical({ referralSources: [] }), canonical({ referralSources: ["지원하지 않는 경로"] }),
    canonical({ privacyAgreed: false }), canonical({ privacyAgreed: "true" }),
    canonical({ hp: 1 }), canonical({ domain: 1 })];
  for (const body of invalidBodies) {
    const response = await h.contact(h.request(body));
    assert.equal(response.status, 400, `Expected invalid body ${JSON.stringify(body)}`);
    const result = await response.json();
    assert.equal(result.ok, false);
    assert.ok(result.message);
  }
  assert.equal(h.requests.length, 0);
});

test("compact input validation remains enforced and compact payloads are not accepted by /api/contact", async () => {
  const h = createHarness();
  for (const body of [compact({ privacyAgree: false }), compact({ phone: "1234" }),
    compact({ source: "unknown" }), compact({ name: "x".repeat(51) }),
    compact({ message: "x".repeat(801) })]) {
    assert.equal((await h.leads(h.request(body, { route: "leads" }))).status, 400);
  }
  assert.equal((await h.contact(h.request(compact()))).status, 400);
  assert.equal(h.requests.length, 0);
});

test("honeypot pretends success without a notification; whitespace does not block genuine inquiries", async () => {
  const h = createHarness();
  const trapped = await h.contact(h.request(canonical({ hp: " robot " })));
  assert.equal(trapped.status, 200);
  assert.equal((await trapped.json()).ok, true);
  assert.equal(h.requests.length, 0);
  assert.equal((await h.contact(h.request(canonical({ hp: " \t\n " })))).status, 200);
  assert.equal(h.requests.length, 1);
});

test("the fourth request is limited across both aliases and a fresh window allows another request", async () => {
  const h = createHarness();
  const headers = { "x-forwarded-for": "198.51.100.17, 203.0.113.2" };
  assert.equal((await h.contact(h.request(canonical(), { headers }))).status, 200);
  assert.equal((await h.leads(h.request(compact(), { route: "leads", headers }))).status, 200);
  assert.equal((await h.contact(h.request(canonical({ hp: "robot" }), { headers }))).status, 200);
  const limited = await h.leads(h.request(canonical(), { route: "leads", headers }));
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).error, "TOO_MANY_REQUESTS");
  assert.equal(h.requests.length, 2);
  h.advanceTime(60_001);
  assert.equal((await h.contact(h.request(canonical(), { headers }))).status, 200);
  assert.equal(h.requests.length, 3);
});

test("validation failures consume the shared IP allowance and x-real-ip is the fallback", async () => {
  const h = createHarness();
  const headers = { "x-forwarded-for": "", "x-real-ip": "198.51.100.18" };
  for (let i = 0; i < 3; i++) {
    assert.equal((await h.contact(h.request(canonical({ privacyAgreed: false }), { headers }))).status, 400);
  }
  assert.equal((await h.leads(h.request(compact(), { route: "leads", headers }))).status, 429);
  assert.equal(h.requests.length, 0);
});

test("missing or invalid provider configuration returns a generic 500 without fetching", async () => {
  for (const key of Object.keys(defaultEnv)) {
    const env = { ...defaultEnv };
    delete env[key];
    const h = createHarness({ env });
    const response = await h.contact(h.request(canonical()));
    assert.equal(response.status, 500, `Missing ${key}`);
    const result = await response.json();
    assert.equal(result.ok, false);
    assert.ok(!JSON.stringify(result).includes(key));
    assert.equal(h.requests.length, 0);
  }
  for (const key of ["SMS_TO", "SMS_FROM"]) {
    const h = createHarness({ env: { ...defaultEnv, [key]: "invalid-number" } });
    assert.equal((await h.contact(h.request(canonical()))).status, 500);
    assert.equal(h.requests.length, 0);
  }
});

test("provider HTTP failures and network exceptions return generic errors without leaking provider details", async () => {
  for (const provider of [
    async () => new Response("provider-private-debug test-api-secret", { status: 401 }),
    async () => { throw new Error("provider-private-debug test-api-secret"); },
  ]) {
    const h = createHarness({ provider });
    const response = await h.contact(h.request(canonical()));
    assert.equal(response.status, 500);
    const body = await response.json();
    assert.equal(body.ok, false);
    assert.ok(body.message);
    assert.ok(!JSON.stringify(body).includes("provider-private-debug"));
    assert.ok(!JSON.stringify(body).includes("test-api-secret"));
    assert.equal(h.requests.length, 1);
  }
});

test("same-origin protection and bounded request bodies remain in force", async () => {
  const h = createHarness();
  assert.equal((await h.contact(h.request(canonical(),
    { headers: { origin: "https://elsewhere.example" } }))).status, 403);
  assert.equal((await h.leads(h.request(compact(),
    { route: "leads", headers: { origin: "https://elsewhere.example" } }))).status, 403);
  assert.equal((await h.contact(h.request("x".repeat(16_385)))).status, 413);
  assert.equal(h.requests.length, 0);
  assert.equal((await h.contact(h.request(canonical(), { headers: {
    origin: "https://ddukson.example", host: "ddukson.example", "x-forwarded-proto": "https",
  } }))).status, 200);
  assert.equal(h.requests.length, 1);
});
