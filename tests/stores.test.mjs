import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const requireDependency = createRequire(import.meta.url);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
function loadTypeScript(file, dependencies = {}) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
  } }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: compiledModule, exports: compiledModule.exports,
    require: (name) => dependencies[name] ?? requireDependency(name),
    process, URL, AbortSignal, console: { warn() {}, error() {} },
    fetch: (...args) => global.fetch(...args),
  }, { filename: file });
  return compiledModule.exports;
}

const { parseStoresCsv, StoresDataError, createStoreGeocoder, loadStoresFromCsv, cleanStoreAddress } = loadTypeScript('src/lib/stores.ts');
const header = 'id,region,name,address,latitude,longitude,phone,status\n';
const csv = (...rows) => header + rows.join('\n');
const row = (id, address, latitude = '', longitude = '', status = 'OPEN') =>
  `${id},경기,테스트 매장,${address},${latitude},${longitude},,${status}`;
const found = (latitude = '37.359', longitude = '126.932', address = '경기 군포시 산본로 1') =>
  Response.json({ documents: [{ y: latitude, x: longitude, address_name: address, road_address_name: address }] });
const empty = () => Response.json({ documents: [] });
const plain = (value) => JSON.parse(JSON.stringify(value));

test('CSV parser handles BOM, quoted commas, escaped quotes, CRLF and multiline cells', () => {
  const text = '\uFEFF' + header.replace('\n', '\r\n') +
    'S01,경기,"테스트 ""가맹점""","경기 군포시 산본로 1,\r\n2층",37.35,126.93,031-000-0000,OPEN\r\n';
  const parsed = parseStoresCsv(text);
  assert.equal(parsed.stores.length, 1);
  assert.equal(parsed.stores[0].name, '테스트 "가맹점"');
  assert.equal(parsed.stores[0].address, '경기 군포시 산본로 1,\r\n2층');
  assert.equal(parsed.stores[0].coordinateStatus, 'provided');
  assert.equal(parsed.stores[0].latitude, 37.35);
  assert.equal(parsed.warnings.length, 0);
  assert.equal(parseStoresCsv(header).stores.length, 0);
});

test('global malformed CSV/schema and duplicate IDs are errors; invalid rows are isolated', () => {
  for (const text of ['', 'id,name\nS01,Test', header + '"unclosed',
    csv(row('S01', '주소'), row('S01', '다른 주소')),
    header.replace('phone', 'name')]) {
    assert.throws(() => parseStoresCsv(text), StoresDataError);
  }
  const parsed = parseStoresCsv(csv(
    row('valid', '주소', '0', '0'), row('pair', '주소', '37'),
    row('range', '주소', '91', '180'), row('nan', '주소', 'NaN', '126'),
    row('infinite', '주소', '37', 'Infinity'), row('hex', '주소', '0x25', '126'),
    row('status', '주소', '', '', 'UNKNOWN'), 'missing,경기,,주소,,,,OPEN', 'short,경기',
  ));
  assert.equal(parsed.stores.length, 1);
  assert.equal(parsed.stores[0].latitude, 0);
  assert.equal(parsed.warnings.length, 8);
  assert.ok(parsed.warnings.every((warning) => Number.isInteger(warning.row)));
});

test('OPEN filtering, supplied coordinates and empty lists work without a REST key', async () => {
  let calls = 0;
  const geocoder = createStoreGeocoder({ fetch: async () => { calls++; throw new Error('must not fetch'); } });
  const result = await loadStoresFromCsv(csv(
    row('open', '주소', '37.35', '126.93'), row('closed', '주소', '', '', 'CLOSED'),
    row('missing', '다른 주소'),
  ), undefined, geocoder);
  assert.equal(calls, 0);
  assert.equal(result.total, 2);
  assert.equal(result.withCoordinates, 1);
  assert.equal(result.stores[1].coordinateStatus, 'missing');
  assert.equal(result.warnings[0].code, 'GEOCODING_UNAVAILABLE');
  const blank = await loadStoresFromCsv(header, undefined, geocoder);
  assert.deepEqual(plain(blank), { stores: [], total: 0, withCoordinates: 0 });
  await loadStoresFromCsv(csv(row('provided', '주소', '37.3', '126.9'), row('closed', '주소', '', '', 'CLOSED')), 'test-key', geocoder);
  assert.equal(calls, 0);
});

test('geocoding tries original then cleaned address and validates the keyword candidate address', async () => {
  const queries = [];
  const geocoder = createStoreGeocoder({ fetch: async (url, options) => {
    const parsed = new URL(url);
    queries.push([parsed.pathname, parsed.searchParams.get('query')]);
    assert.equal(options.headers.Authorization, 'KakaoAK test-key');
    assert.equal(options.cache, 'no-store');
    if (parsed.pathname.includes('/address.')) return empty();
    return Response.json({ documents: [
      { address_name: '경기 군포시 산본로 100', x: '126.1', y: '37.1' },
      { road_address_name: '경기도 군포시 산본로 1', x: '126.932', y: '37.359' },
    ] });
  } });
  const result = await loadStoresFromCsv(csv(row('S01', '경기도 군포시 산본로 1 (빌딩) 2층')), 'test-key', geocoder);
  assert.equal(queries.length, 3);
  assert.equal(queries[0][1], '경기도 군포시 산본로 1 (빌딩) 2층');
  assert.equal(queries[1][1], '경기도 군포시 산본로 1');
  assert.ok(queries[2][0].includes('/keyword.'));
  assert.equal(result.stores[0].latitude, 37.359);
  assert.equal(result.stores[0].coordinateStatus, 'geocoded');
  assert.equal(result.stores[0].address, '경기도 군포시 산본로 1 (빌딩) 2층');
  assert.equal(cleanStoreAddress('경기 군포시 산본로 1, 2층, 102호'), '경기 군포시 산본로 1');
  assert.equal(cleanStoreAddress('경기 군포시 산본로 1 101동 102호'), '경기 군포시 산본로 1');
});

test('uncertain keyword matches and invalid provider coordinates retain list entries without pins', async () => {
  const geocoder = createStoreGeocoder({ fetch: async (url) => {
    const parsed = new URL(url);
    if (parsed.searchParams.get('query') === '잘못된 좌표') return found('91', '126.93');
    if (parsed.pathname.includes('/address.')) return empty();
    return found('37.3', '126.9', '완전히 다른 주소');
  } });
  const result = await loadStoresFromCsv(csv(row('wrong', '원래 주소'), row('coords', '잘못된 좌표')), 'test-key', geocoder);
  assert.equal(result.total, 2);
  assert.equal(result.withCoordinates, 0);
  assert.ok(result.stores.every((store) => store.latitude === null && store.coordinateStatus === 'failed'));
  assert.deepEqual(new Set(result.warnings.map((warning) => warning.code)), new Set(['GEOCODING_NOT_FOUND', 'GEOCODING_INVALID_RESPONSE']));
});

test('identical addresses deduplicate in-flight work; changed addresses/keys do not reuse cached coordinates', async () => {
  let time = 1000;
  let calls = 0;
  const geocoder = createStoreGeocoder({ now: () => time, fetch: async () => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, 5));
    return found();
  } });
  const source = csv(row('S01', '주소 하나'), row('S02', '주소 하나'));
  const [first, second] = await Promise.all([
    loadStoresFromCsv(source, 'key-a', geocoder), loadStoresFromCsv(source, 'key-a', geocoder),
  ]);
  assert.equal(calls, 1);
  assert.equal(first.withCoordinates, 2);
  assert.equal(second.withCoordinates, 2);
  await loadStoresFromCsv(source, 'key-a', geocoder);
  assert.equal(calls, 1);
  await loadStoresFromCsv(csv(row('S01', '주소 수정')), 'key-a', geocoder);
  assert.equal(calls, 2);
  await loadStoresFromCsv(source, 'key-b', geocoder);
  assert.equal(calls, 3);
  time += 24 * 60 * 60 * 1000 + 1;
  await loadStoresFromCsv(source, 'key-a', geocoder);
  assert.equal(calls, 4);
});

test('one failed network row is isolated, transient errors retry and negative cache expires sooner than success', async () => {
  let time = 1000;
  let brokenCalls = 0;
  let noMatchCalls = 0;
  const geocoder = createStoreGeocoder({ now: () => time, fetch: async (url) => {
    const query = new URL(url).searchParams.get('query');
    if (query === '연결 오류') { brokenCalls++; throw new Error('private provider details'); }
    if (query === '없는 주소') { noMatchCalls++; return empty(); }
    return found();
  } });
  const source = csv(row('broken', '연결 오류'), row('none', '없는 주소'), row('ok', '정상 주소'));
  const first = await loadStoresFromCsv(source, 'test-key', geocoder);
  assert.equal(first.total, 3);
  assert.equal(first.withCoordinates, 1);
  assert.equal(brokenCalls, 1);
  assert.equal(noMatchCalls, 2);
  await loadStoresFromCsv(source, 'test-key', geocoder);
  assert.equal(brokenCalls, 1);
  assert.equal(noMatchCalls, 2);
  time += 16000;
  await loadStoresFromCsv(source, 'test-key', geocoder);
  assert.equal(brokenCalls, 2);
  assert.equal(noMatchCalls, 2);
  time += 5 * 60 * 1000;
  await loadStoresFromCsv(source, 'test-key', geocoder);
  assert.equal(noMatchCalls, 4);
  assert.ok(!JSON.stringify(first).includes('private provider details'));
});

test('authentication/quota errors suppress queued calls and remain distinct sanitized diagnostics', async () => {
  for (const [status, payload, expected] of [
    [401, { message: 'secret-key', code: -401 }, 'GEOCODING_AUTHENTICATION'],
    [429, { errorType: 'RequestThrottled' }, 'GEOCODING_QUOTA'],
    [403, { code: -10 }, 'GEOCODING_QUOTA'],
  ]) {
    let calls = 0;
    const geocoder = createStoreGeocoder({ concurrency: 1, fetch: async () => {
      calls++;
      return Response.json(payload, { status });
    } });
    const result = await loadStoresFromCsv(csv(...Array.from({ length: 8 }, (_, index) => row(`S${index}`, `주소 ${index}`))), 'secret-key', geocoder);
    assert.equal(calls, 1);
    assert.equal(result.total, 8);
    assert.equal(result.withCoordinates, 0);
    assert.ok(result.warnings.every((warning) => warning.code === expected));
    assert.ok(!JSON.stringify(result).includes('secret-key'));
  }
});

test('the shared limiter bounds concurrent network requests across API batches', async () => {
  let active = 0;
  let highest = 0;
  const geocoder = createStoreGeocoder({ concurrency: 3, fetch: async () => {
    active++;
    highest = Math.max(highest, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active--;
    return found();
  } });
  await Promise.all([0, 1].map((batch) => loadStoresFromCsv(csv(...Array.from({ length: 10 }, (_, index) => row(`S${index}`, `주소 ${batch}-${index}`))), 'test-key', geocoder)));
  assert.equal(highest, 3);
});

test('GET rereads changed CSV, returns no-store, separates zero stores from validation/file failures', async () => {
  let text = header;
  let unreadable = false;
  let reads = 0;
  const { GET } = loadTypeScript('src/app/api/stores/route.ts', {
    '@/lib/stores': { loadStoresFromCsv, StoresDataError },
    'node:fs/promises': { readFile: async (filename) => {
      reads++;
      assert.ok(filename.endsWith(path.join('data', 'stores.csv')));
      if (unreadable) throw new Error('private filesystem path');
      return text;
    } },
  });
  const originalKey = process.env.KAKAO_REST_API_KEY;
  delete process.env.KAKAO_REST_API_KEY;
  try {
    const emptyResponse = await GET();
    assert.equal(emptyResponse.status, 200);
    assert.equal(emptyResponse.headers.get('Cache-Control'), 'no-store');
    assert.equal((await emptyResponse.json()).total, 0);
    text = csv(row('added', '신규 주소', '37.3', '126.9'));
    assert.equal((await (await GET()).json()).total, 1);
    text = csv(row('added', '수정 주소', '37.4', '127.0'));
    assert.equal((await (await GET()).json()).stores[0].address, '수정 주소');
    text = csv(row('added', '수정 주소', '37.4', '127.0', 'CLOSED'));
    assert.equal((await (await GET()).json()).total, 0);
    text = csv(row('duplicate', '주소'), row('duplicate', '다른 주소'));
    assert.equal((await GET()).status, 422);
    unreadable = true;
    const failure = await GET();
    assert.equal(failure.status, 500);
    assert.ok(!(await failure.text()).includes('private filesystem path'));
    assert.equal(reads, 6);
  } finally {
    if (originalKey === undefined) delete process.env.KAKAO_REST_API_KEY;
    else process.env.KAKAO_REST_API_KEY = originalKey;
  }
});
