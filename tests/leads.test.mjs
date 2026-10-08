import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { createHmac } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const requireDependency = createRequire(import.meta.url);
const testDirectory = path.dirname(fileURLToPath(import.meta.url));

function loadTypeScript(file, dependencies = {}) {
  const source = fs.readFileSync(path.join(testDirectory, '..', file), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: compiledModule, exports: compiledModule.exports, require: (name) => dependencies[name] ?? requireDependency(name),
    process, Buffer, FormData, Uint8Array, URL, AbortSignal,
    fetch: (...args) => global.fetch(...args),
  }, { filename: file });
  return compiledModule.exports;
}
const inquiry = loadTypeScript('src/lib/inquiry.ts');
const { POST } = loadTypeScript('src/app/api/leads/route.ts', { '@/lib/inquiry': inquiry });
const payload = { name: '테스트', phone: '010-1234-5678', region: '군포시',
  message: '테스트 문의', privacyAgree: true, source: 'contact', hp: '' };
let sequence = 0;
function request(body, headers = {}) {
  return new Request('http://localhost:3000/api/leads', {
    method: 'POST', headers: { 'Content-Type': 'application/json',
      'x-forwarded-for': `192.0.2.${++sequence}`, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

test('validation, configuration and SOLAPI responses without sending real SMS', async () => {
  const originalFetch = global.fetch;
  const keys = ['SOLAPI_API_KEY', 'SOLAPI_API_SECRET', 'SMS_FROM', 'SMS_TO'];
  const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  let sent = 0;
  try {
    keys.forEach((key) => delete process.env[key]);
    global.fetch = async () => { sent++; throw new Error('must not send'); };
    assert.equal((await POST(request(payload))).status, 503);
    assert.equal((await POST(request({ ...payload, privacyAgree: false }))).status, 400);
    assert.equal((await POST(request({ ...payload, phone: '1234' }))).status, 400);
    assert.equal((await POST(request({ ...payload, name: 'x'.repeat(51) }))).status, 400);
    assert.equal((await POST(request({ ...payload, message: 'x'.repeat(801) }))).status, 400);
    assert.equal((await POST(request('{broken'))).status, 400);
    assert.equal((await POST(request('x'.repeat(17000)))).status, 413);
    assert.equal((await POST(request(payload, { origin: 'https://elsewhere.example' }))).status, 403);
    assert.equal((await POST(request({ ...payload, hp: 'bot' }))).status, 200);
    assert.equal((await POST(request(payload, {
      origin: 'https://example.test', host: 'example.test', 'x-forwarded-proto': 'https',
    }))).status, 503);
    assert.equal(sent, 0);
    for (let i = 0; i < 3; i++) assert.equal((await POST(request(payload, { 'x-forwarded-for': '198.51.100.1' }))).status, 503);
    assert.equal((await POST(request(payload, { 'x-forwarded-for': '198.51.100.1' }))).status, 429);

    Object.assign(process.env, { SOLAPI_API_KEY: 'fake-key', SOLAPI_API_SECRET: 'fake-secret',
      SMS_FROM: '0212345678', SMS_TO: '01012345678' });
    global.fetch = async (url, options) => {
      sent++;
      assert.equal(url, 'https://api.solapi.com/messages/v4/send-many/detail');
      const auth = options.headers.Authorization;
      const date = auth.match(/date=([^,]+)/)[1];
      const salt = auth.match(/salt=([^,]+)/)[1];
      assert.ok(auth.endsWith(createHmac('sha256', 'fake-secret').update(date + salt).digest('hex')));
      const message = JSON.parse(options.body).messages[0];
      assert.equal(message.type, 'LMS');
      assert.ok(message.text.includes('01012345678'));
      assert.ok(message.text.includes('뚝손국밥'));
      return Response.json({ groupInfo: { count: { registeredSuccess: 1, registeredFailed: 0 } } });
    };
    assert.equal((await POST(request(payload))).status, 200);
    assert.equal((await POST(request({ ...payload, source: 'floating', message: '' }))).status, 200);
    assert.equal(sent, 2);
    assert.equal((await POST(request({ ...payload, message: '가'.repeat(800) }))).status, 400);
    assert.equal(sent, 2);
    global.fetch = async () => Response.json({ groupInfo: { count: { registeredSuccess: 0, registeredFailed: 1 } } });
    assert.equal((await POST(request(payload))).status, 502);
    global.fetch = async () => Response.json({ error: 'invalid key' }, { status: 401 });
    assert.equal((await POST(request(payload))).status, 502);
    global.fetch = async () => { throw new Error('timeout'); };
    assert.equal((await POST(request(payload))).status, 504);
  } finally {
    global.fetch = originalFetch;
    keys.forEach((key) => originalEnv[key] === undefined ? delete process.env[key] : process.env[key] = originalEnv[key]);
  }
});
