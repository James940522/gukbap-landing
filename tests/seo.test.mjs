import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const plain = (value) => JSON.parse(JSON.stringify(value));
function load(file, env = {}, dependencies = {}, globals = {}) {
  const compiled = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: compiledModule, exports: compiledModule.exports, process: { env }, URL,
    require: (name) => {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    }, ...globals,
  }, { filename: file });
  return compiledModule.exports;
}
const seo = load('src/lib/seo.ts');
const publicEnv = { SEO_DEPLOYMENT_ENV: 'production', SEO_INDEXABLE: 'true' };

test('indexing requires an explicit production opt-in; preview always overrides it', () => {
  for (const env of [{}, { NODE_ENV: 'production' }, { SEO_INDEXABLE: 'true' },
    { SEO_DEPLOYMENT_ENV: 'production' }, { ...publicEnv, SEO_DEPLOYMENT_ENV: 'staging' },
    { ...publicEnv, VERCEL_ENV: 'preview' }, { ...publicEnv, VERCEL_ENV: 'development' }]) {
    assert.equal(seo.getSeoConfig(env).indexable, false);
  }
  assert.equal(seo.getSeoConfig(publicEnv).indexable, true);
  assert.equal(seo.getSeoConfig({ VERCEL_ENV: 'production', SEO_INDEXABLE: 'true' }).indexable, true);
  assert.equal(seo.getSeoConfig({}).origin, 'https://www.ttukson.com');
});

test('malformed origins and public localhost, HTTP or temporary URLs are rejected', () => {
  for (const url of ['broken', 'javascript:alert(1)', 'https://user:password@www.ttukson.com',
    'https://www.ttukson.com/menu', 'https://www.ttukson.com?x=1', 'https://www.ttukson.com#menu']) {
    assert.throws(() => seo.getSeoConfig({ NEXT_PUBLIC_SITE_URL: url }));
  }
  for (const url of ['http://www.ttukson.com', 'https://localhost', 'https://127.0.0.1',
    'https://[::1]', 'https://draft.vercel.app', 'https://draft.netlify.app', 'https://www.ttukson.com:3000']) {
    assert.throws(() => seo.getSeoConfig({ ...publicEnv, NEXT_PUBLIC_SITE_URL: url }));
  }
  assert.equal(seo.getSeoConfig({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' }).indexable, false);
});

test('store metadata has its own canonical and sharing copy and remains noindex until ready', () => {
  const config = seo.getSeoConfig(publicEnv);
  const metadata = plain(seo.createPageMetadata({ path: '/stores', title: '매장 안내', description: '매장 설명', ready: false }, config));
  assert.equal(metadata.alternates.canonical, 'https://www.ttukson.com/stores');
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal(metadata.openGraph.title, '매장 안내');
  assert.equal(metadata.twitter.title, '매장 안내');
  assert.equal(metadata.openGraph.images[0].url, 'https://www.ttukson.com/opengraph-image.jpeg');
  assert.equal(metadata.twitter.images[0].url, metadata.openGraph.images[0].url);
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.robots.follow, true);
  assert.equal(seo.createPageMetadata({ path: '/stores', title: '매장', description: '설명', ready: true }, config).robots.index, true);
});

test('verification tokens are optional and emitted under the correct names', () => {
  assert.deepEqual(plain(seo.verificationMetadata({})), {});
  assert.deepEqual(plain(seo.verificationMetadata({ GOOGLE_SITE_VERIFICATION: ' google-test ', NAVER_SITE_VERIFICATION: ' naver-test ' })), {
    verification: { google: 'google-test' }, other: { 'naver-site-verification': 'naver-test' },
  });
});

test('sitemap contains only indexable, ready canonical pages; no generated lastmod', async () => {
  let directory = { stores: [], error: false };
  const dependencies = {
    '@/lib/seo': load('src/lib/seo.ts', publicEnv),
    '@/lib/stores': { getStoreDirectory: async () => directory },
  };
  const { default: sitemap } = load('src/app/sitemap.ts', publicEnv, dependencies);
  assert.deepEqual(plain(await sitemap()), [{ url: 'https://www.ttukson.com/' }]);
  directory = { stores: [{ id: 'fixture' }], error: false };
  assert.deepEqual(plain(await sitemap()), [{ url: 'https://www.ttukson.com/' }, { url: 'https://www.ttukson.com/stores' }]);
  directory.error = true;
  assert.equal((await sitemap()).length, 1);
  dependencies['@/lib/seo'] = seo;
  const draftSitemap = load('src/app/sitemap.ts', {}, dependencies).default;
  assert.deepEqual(plain(await draftSitemap()), []);
  const { default: robots } = load('src/app/robots.ts', {}, { '@/lib/seo': seo });
  assert.deepEqual(plain(robots()), { rules: { userAgent: '*', allow: '/' } });
  const publicRobots = load('src/app/robots.ts', publicEnv, { '@/lib/seo': load('src/lib/seo.ts', publicEnv) }).default();
  assert.equal(publicRobots.sitemap, 'https://www.ttukson.com/sitemap.xml');
});

test('alternate host redirect is permanent and APIs are excluded from indexing', async () => {
  const config = load('next.config.ts', {}, { './src/lib/seo': seo }).default;
  const [redirect] = await config.redirects();
  assert.equal(redirect.destination, 'https://www.ttukson.com/:path*');
  assert.equal(redirect.permanent, true);
  assert.equal(new RegExp(`^${redirect.has[0].value}$`).test('ttukson.com'), true);
  assert.equal(new RegExp(`^${redirect.has[0].value}$`).test('ttuksonXcom'), false);
  const [header] = await config.headers();
  assert.equal(header.source, '/api/:path*');
  assert.deepEqual(plain(header.headers), [{ key: 'X-Robots-Tag', value: 'noindex' }]);
});

test('analytics queue contains only allowlisted data and never propagates provider errors', () => {
  const delivered = [];
  const browser = { location: { pathname: '/stores', search: '?phone=private', hash: '#private' }, dispatchEvent: (event) => delivered.push(event.detail) };
  class LocalEvent { constructor(name, options) { this.type = name; this.detail = options.detail; } }
  const analytics = load('src/lib/analytics.ts', {}, {}, { window: browser, CustomEvent: LocalEvent });
  analytics.trackEvent('generate_lead', 'contact');
  analytics.trackEvent('phone_click', 'private phone value');
  analytics.trackEvent('private event value', 'contact');
  assert.deepEqual(plain(browser.dataLayer), [
    { event: 'generate_lead', source: 'contact', page_path: '/stores' },
    { event: 'phone_click', source: 'other', page_path: '/stores' },
  ]);
  assert.equal(delivered.length, 2);
  browser.dataLayer = { push() { throw new Error('broken provider'); } };
  assert.doesNotThrow(() => analytics.trackEvent('generate_lead', 'floating'));
  const serverAnalytics = load('src/lib/analytics.ts');
  assert.doesNotThrow(() => serverAnalytics.trackEvent('generate_lead', 'contact'));
});

test('Next Link inquiry intents are captured before routing prevents the native click', () => {
  const events = [];
  let listener;
  let cleanup;
  const browserDocument = {
    addEventListener(name, callback, capture) { assert.equal(name, 'click'); assert.equal(capture, true); listener = callback; },
    removeEventListener(name, callback, capture) { assert.equal(name, 'click'); assert.equal(callback, listener); assert.equal(capture, true); },
  };
  class LocalElement {
    constructor(href) { this.href = href; }
    closest(selector) { return selector === 'a, button' || selector === 'header' ? this : null; }
    matches() { return false; }
    getAttribute() { return this.href; }
  }
  const dependencies = {
    react: { useEffect: (effect) => { cleanup = effect(); } },
    '@/lib/analytics': { ANALYTICS_SOURCES: [], trackEvent: (...args) => events.push(args) },
  };
  const { SiteAnalytics } = load('src/components/seo/SiteAnalytics.tsx', {}, dependencies, {
    Element: LocalElement, document: browserDocument,
    window: { location: { href: 'http://localhost:3000/stores', origin: 'http://localhost:3000' } },
  });
  assert.equal(SiteAnalytics(), null);
  const event = { defaultPrevented: false, target: new LocalElement('/#inquiry') };
  listener(event);
  // Next Link prevents the native event later, during its bubbling handler.
  event.defaultPrevented = true;
  assert.deepEqual(events, [['inquiry_cta_click', 'header']]);
  listener({ defaultPrevented: false, target: new LocalElement('https://elsewhere.example/#inquiry') });
  assert.equal(events.length, 1);
  cleanup();
});

test('lead events follow successful API acknowledgement and skip validation, failures and honeypots', async () => {
  let validationErrors = {};
  let response = { ok: true, json: async () => ({ ok: true }) };
  const events = [];
  let calls = 0;
  const dependencies = {
    react: { useRef: (current) => ({ current }), useState: (value) => [value, () => {}] },
    './inquiry': { validateInquiry: () => validationErrors },
    './analytics': { trackEvent: (...args) => events.push(args) },
  };
  class LocalFormData { constructor(form) { this.values = form.values; } get(key) { return this.values[key] ?? null; } }
  const { useInquirySubmission } = load('src/lib/useInquirySubmission.ts', {}, dependencies, {
    FormData: LocalFormData, AbortSignal: { timeout: () => ({}) },
    fetch: async () => { calls++; return response; },
  });
  const form = { values: { name: 'private', phone: 'private', region: 'private', consent: 'on', hp: '' },
    reset() {}, querySelector: () => ({ focus() {} }) };
  const event = { preventDefault() {}, currentTarget: form };
  const { handleSubmit } = useInquirySubmission('contact');
  validationErrors = { name: 'invalid' };
  assert.equal(await handleSubmit(event), false);
  assert.equal(calls, 0);
  validationErrors = {};
  response = { ok: false, json: async () => ({ ok: false }) };
  assert.equal(await handleSubmit(event), false);
  response = { ok: true, json: async () => ({ ok: false }) };
  assert.equal(await handleSubmit(event), false);
  response = { ok: true, json: async () => ({ ok: true }) };
  form.values.hp = 'bot';
  assert.equal(await handleSubmit(event), true);
  assert.equal(events.length, 0);
  form.values.hp = '';
  assert.equal(await handleSubmit(event), true);
  assert.deepEqual(events, [['generate_lead', 'contact']]);
});
