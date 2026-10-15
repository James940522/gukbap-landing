// Server-only data access. Client components import the shared types instead.
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parse } from "csv-parse/sync";
import type { Store, StoresApiResponse, StoresWarning } from "@/types/stores";

const CSV_HEADERS = [
  "id", "region", "name", "address", "latitude", "longitude", "phone", "status",
] as const;
const ADDRESS_ENDPOINT = "https://dapi.kakao.com/v2/local/search/address.json";
const KEYWORD_ENDPOINT = "https://dapi.kakao.com/v2/local/search/keyword.json";
const DAY = 24 * 60 * 60 * 1000;
const FAILURE_TTL = 15 * 1000;
const FATAL_TTL = 60 * 1000;
const NOT_FOUND_TTL = 5 * 60 * 1000;
const CACHE_LIMIT = 1000;
const REQUEST_TIMEOUT = 8000;

export class StoresDataError extends Error {
  constructor(message = "매장 데이터 형식을 확인해주세요.") {
    super(message);
    this.name = "StoresDataError";
  }
}

type CsvRecord = { record: string[]; info: { lines: number } };
type ParsedStores = { stores: Store[]; warnings: StoresWarning[] };
export type StoreDirectoryResult = { stores: Store[]; error: boolean };
type Coordinates = { latitude: number; longitude: number };
type Failure = "not-found" | "authentication" | "quota" | "unavailable" | "invalid-response";
type GeocodeResult = { coordinates: Coordinates; failure?: never } | { failure: Failure; coordinates?: never };
type Batch = { fatal?: "authentication" | "quota" };
type KakaoDocument = {
  x?: unknown;
  y?: unknown;
  address_name?: unknown;
  road_address_name?: unknown;
};
type KakaoResult = { documents: KakaoDocument[]; failure?: never } | { failure: Failure; documents?: never };

function parseCoordinate(value: string, max: number): number | null {
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return null;
  const number = Number(value);
  return Number.isFinite(number) && Math.abs(number) <= max ? number : null;
}

export function parseStoresCsv(csvText: string): ParsedStores {
  let records: CsvRecord[];
  try {
    records = parse(csvText, {
      bom: true,
      skip_empty_lines: true,
      trim: true,
      info: true,
      // An uneven row is isolated below; malformed quoting remains a fatal error.
      relax_column_count: true,
      max_record_size: 16000,
    }) as unknown as CsvRecord[];
  } catch {
    throw new StoresDataError();
  }
  const headers = records[0]?.record;
  if (!headers || new Set(headers).size !== headers.length ||
      CSV_HEADERS.some((header) => !headers.includes(header))) {
    throw new StoresDataError("매장 CSV의 필수 헤더를 확인해주세요.");
  }
  const idIndex = headers.indexOf("id");
  const ids = new Set<string>();
  // Check every nonempty ID before rejecting individual rows.
  for (const { record } of records.slice(1)) {
    const id = record[idIndex]?.trim();
    if (!id) continue;
    if (ids.has(id)) throw new StoresDataError("매장 CSV에 중복된 ID가 있습니다.");
    ids.add(id);
  }

  const stores: Store[] = [];
  const warnings: StoresWarning[] = [];
  for (const { record, info } of records.slice(1)) {
    const row = info.lines;
    if (record.length !== headers.length) {
      warnings.push({ code: "INVALID_ROW", message: "열 개수가 다른 매장 행을 제외했습니다.", row });
      continue;
    }
    const values = Object.fromEntries(headers.map((header, index) => [header, record[index].trim()]));
    const required = [values.id, values.region, values.name, values.address, values.status];
    if (required.some((value) => !value) || values.id.length > 100 ||
        values.region.length > 100 || values.name.length > 200 || values.address.length > 500 ||
        values.phone.length > 100 || !["OPEN", "CLOSED"].includes(values.status)) {
      warnings.push({ code: "INVALID_ROW", message: "필수값 또는 상태가 올바르지 않은 매장 행을 제외했습니다.", row });
      continue;
    }
    const hasLatitude = values.latitude !== "";
    const hasLongitude = values.longitude !== "";
    const latitude = hasLatitude ? parseCoordinate(values.latitude, 90) : null;
    const longitude = hasLongitude ? parseCoordinate(values.longitude, 180) : null;
    if (hasLatitude !== hasLongitude ||
        (hasLatitude && (latitude === null || longitude === null))) {
      warnings.push({ code: "INVALID_COORDINATES", message: "좌표가 올바르지 않은 매장 행을 제외했습니다.", row, storeId: values.id });
      continue;
    }
    stores.push({
      id: values.id,
      region: values.region,
      name: values.name,
      address: values.address,
      latitude,
      longitude,
      phone: values.phone,
      status: values.status as Store["status"],
      coordinateStatus: hasLatitude ? "provided" : "missing",
    });
  }
  return { stores, warnings };
}

/** Read public store text without waiting for map coordinates or external APIs. */
export async function readStoreDirectory(): Promise<StoreDirectoryResult> {
  try {
    const csv = await readFile(path.join(process.cwd(), "data", "stores.csv"), "utf8");
    const { stores } = parseStoresCsv(csv);
    return { stores: stores.filter((store) => store.status === "OPEN"), error: false };
  } catch {
    // Never expose filesystem paths or malformed CSV details to the public page.
    return { stores: [], error: true };
  }
}

// Shared by server page content, metadata and sitemap within the same render.
export const getStoreDirectory = cache(readStoreDirectory);

/** Preserve the displayed original, removing only details for a retry query. */
export function cleanStoreAddress(address: string): string {
  return address.trim()
    .replace(/\s*[(（][^)）]*[)）]\s*/g, " ")
    .replace(/[,\s]+(?:(?:지하\s*)?[A-Za-z]?\d+\s*층|\d+(?:-\d+)?\s*호|[A-Za-z0-9]+\s*동)(?:[,\s]+.*)?$/u, "")
    .replace(/[\s,.\u3000]+$/g, "")
    .replace(/\s+/g, " ").trim();
}

function canonicalAddress(address: string): string {
  const aliases: Record<string, string> = {
    서울: "서울특별시", 부산: "부산광역시", 대구: "대구광역시", 인천: "인천광역시",
    광주: "광주광역시", 대전: "대전광역시", 울산: "울산광역시", 세종: "세종특별자치시",
    경기: "경기도", 강원: "강원특별자치도", 강원도: "강원특별자치도",
    충북: "충청북도", 충남: "충청남도", 전북: "전북특별자치도", 전라북도: "전북특별자치도",
    전남: "전라남도", 경북: "경상북도", 경남: "경상남도", 제주: "제주특별자치도", 제주도: "제주특별자치도",
  };
  const cleaned = cleanStoreAddress(address).normalize("NFC");
  const [province, ...rest] = cleaned.split(" ");
  return [aliases[province] ?? province, ...rest].join(" ").toLowerCase();
}

function documentCoordinates(document: KakaoDocument): Coordinates | null {
  if (typeof document.y !== "string" || typeof document.x !== "string") return null;
  const latitude = parseCoordinate(document.y.trim(), 90);
  const longitude = parseCoordinate(document.x.trim(), 180);
  return latitude === null || longitude === null ? null : { latitude, longitude };
}

function keywordMatches(document: KakaoDocument, address: string): boolean {
  const expected = canonicalAddress(address);
  return [document.address_name, document.road_address_name].some((candidate) =>
    typeof candidate === "string" && canonicalAddress(candidate) === expected);
}

const failureMessages: Record<Failure, string> = {
  "not-found": "주소에 맞는 좌표를 찾지 못했습니다.",
  authentication: "지도 좌표 서비스 설정을 확인하고 있습니다.",
  quota: "지도 좌표 서비스가 일시적으로 사용량 한도에 도달했습니다.",
  unavailable: "지도 좌표 서비스에 일시적으로 연결할 수 없습니다.",
  "invalid-response": "주소의 좌표를 확인하지 못했습니다.",
};

/** A process-local cache; CSV coordinates remain the durable production option. */
export function createStoreGeocoder(options: {
  fetch?: typeof fetch;
  now?: () => number;
  concurrency?: number;
} = {}) {
  const fetcher = options.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  const now = options.now ?? Date.now;
  const limit = Math.max(1, Math.min(8, options.concurrency ?? 4));
  const cache = new Map<string, { result: GeocodeResult; expiresAt: number }>();
  const inFlight = new Map<string, Promise<GeocodeResult>>();
  const keyFailures = new Map<string, { reason: "authentication" | "quota"; expiresAt: number }>();
  const waiting: (() => void)[] = [];
  let active = 0;

  async function withSlot<T>(work: () => Promise<T>): Promise<T> {
    if (active >= limit) await new Promise<void>((resolve) => waiting.push(resolve));
    else active += 1;
    try {
      return await work();
    } finally {
      const next = waiting.shift();
      if (next) next();
      else active -= 1;
    }
  }

  async function request(endpoint: string, query: string, apiKey: string, fingerprint: string, batch: Batch): Promise<KakaoResult> {
    return withSlot(async () => {
      const blocked = keyFailures.get(fingerprint);
      if (blocked && blocked.expiresAt <= now()) keyFailures.delete(fingerprint);
      const fatal = batch.fatal ?? (blocked && blocked.expiresAt > now() ? blocked.reason : undefined);
      if (fatal) return { failure: fatal };
      const url = new URL(endpoint);
      url.searchParams.set("query", query);
      url.searchParams.set("page", "1");
      url.searchParams.set("size", endpoint === KEYWORD_ENDPOINT ? "15" : "10");
      try {
        const response = await fetcher(url.toString(), {
          headers: { Authorization: `KakaoAK ${apiKey}` },
          cache: "no-store",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          const quota = response.status === 429 || data?.code === -10 ||
            ["RequestThrottled", "QuotaExceeded", "DailyQuotaExceeded"].includes(data?.errorType);
          const reason: Failure = quota ? "quota" :
            response.status === 401 || response.status === 403 ? "authentication" : "unavailable";
          if (reason === "quota" || reason === "authentication") {
            batch.fatal = reason;
            keyFailures.set(fingerprint, { reason, expiresAt: now() + FATAL_TTL });
          }
          if (process.env.NODE_ENV !== "production") {
            console.warn("[stores] Kakao Local request failed", { status: response.status, reason });
          }
          return { failure: reason };
        }
        if (!data || !Array.isArray(data.documents) ||
            data.documents.some((document: unknown) => !document || typeof document !== "object")) {
          return { failure: "invalid-response" };
        }
        return { documents: data.documents as KakaoDocument[] };
      } catch {
        if (process.env.NODE_ENV !== "production") console.warn("[stores] Kakao Local request unavailable");
        return { failure: "unavailable" };
      }
    });
  }

  async function resolveAddress(address: string, apiKey: string, fingerprint: string, batch: Batch): Promise<GeocodeResult> {
    const original = address.trim().replace(/\s+/g, " ");
    const cleaned = cleanStoreAddress(original);
    for (const query of [...new Set([original, cleaned])].filter(Boolean)) {
      const response = await request(ADDRESS_ENDPOINT, query, apiKey, fingerprint, batch);
      if (response.failure) return { failure: response.failure };
      if (response.documents.length) {
        const coordinates = documentCoordinates(response.documents[0]);
        return coordinates ? { coordinates } : { failure: "invalid-response" };
      }
    }
    if (!cleaned) return { failure: "not-found" };
    const response = await request(KEYWORD_ENDPOINT, cleaned, apiKey, fingerprint, batch);
    if (response.failure) return { failure: response.failure };
    // A similarly named place is insufficient: its actual address must match.
    for (const document of response.documents) {
      if (!keywordMatches(document, cleaned)) continue;
      const coordinates = documentCoordinates(document);
      if (coordinates) return { coordinates };
    }
    return { failure: "not-found" };
  }

  async function geocode(address: string, apiKey: string, batch: Batch): Promise<GeocodeResult> {
    const fingerprint = createHash("sha256").update(apiKey).digest("hex");
    // Source address is part of the key, so CSV address edits cannot reuse a result.
    const cacheKey = `${fingerprint}:${address}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > now()) return cached.result;
    const pending = inFlight.get(cacheKey);
    if (pending) return pending;
    const job = resolveAddress(address, apiKey, fingerprint, batch).then((result) => {
      const ttl = result.coordinates ? DAY : result.failure === "not-found" ? NOT_FOUND_TTL :
        result.failure === "authentication" || result.failure === "quota" ? FATAL_TTL : FAILURE_TTL;
      // Prune expired entries before bounding cache size; no disk or key persistence.
      for (const [key, entry] of cache) if (entry.expiresAt <= now()) cache.delete(key);
      for (const [key, entry] of keyFailures) if (entry.expiresAt <= now()) keyFailures.delete(key);
      cache.delete(cacheKey);
      cache.set(cacheKey, { result, expiresAt: now() + ttl });
      if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value!);
      return result;
    }).finally(() => inFlight.delete(cacheKey));
    inFlight.set(cacheKey, job);
    return job;
  }

  return {
    async enrich(stores: Store[], apiKey?: string): Promise<{ stores: Store[]; warnings: StoresWarning[] }> {
      const openStores = stores.filter((store) => store.status === "OPEN");
      const warnings: StoresWarning[] = [];
      const restKey = apiKey?.trim();
      if (!restKey) {
        if (openStores.some((store) => store.latitude === null)) warnings.push({
          code: "GEOCODING_UNAVAILABLE", message: "일부 매장의 지도 좌표를 준비 중입니다. 목록에서 주소를 확인해주세요.",
        });
        return { stores: openStores, warnings };
      }
      const batch: Batch = {};
      const enriched = await Promise.all(openStores.map(async (store) => {
        if (store.latitude !== null && store.longitude !== null) return store;
        const result = await geocode(store.address, restKey, batch);
        if (result.coordinates) return { ...store, ...result.coordinates, coordinateStatus: "geocoded" as const };
        if (process.env.NODE_ENV !== "production") {
          console.warn("[stores] Store coordinates unavailable", { storeId: store.id, reason: result.failure });
        }
        warnings.push({
          code: `GEOCODING_${result.failure.replace(/-/g, "_").toUpperCase()}`,
          message: failureMessages[result.failure], storeId: store.id,
        });
        return { ...store, coordinateStatus: "failed" as const };
      }));
      return { stores: enriched, warnings };
    },
  };
}

const sharedGeocoder = createStoreGeocoder();

export async function loadStoresFromCsv(
  csvText: string,
  apiKey?: string,
  geocoder = sharedGeocoder,
): Promise<StoresApiResponse> {
  const parsed = parseStoresCsv(csvText);
  const enriched = await geocoder.enrich(parsed.stores, apiKey);
  const warnings = [...parsed.warnings, ...enriched.warnings];
  return {
    stores: enriched.stores,
    total: enriched.stores.length,
    withCoordinates: enriched.stores.filter((store) => store.latitude !== null && store.longitude !== null).length,
    ...(warnings.length ? { warnings } : {}),
  };
}
