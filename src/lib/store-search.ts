import type { Store } from "@/types/stores";

export function normalizeStoreSearch(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("ko-KR");
}

export function filterStores(stores: readonly Store[], query: string): Store[] {
  const keyword = normalizeStoreSearch(query);
  return stores.filter((store) => store.status === "OPEN" && (!keyword
    || normalizeStoreSearch([store.region, store.name, store.address].join(" ")).includes(keyword)));
}

export function hasStoreCoordinates(store: Store): store is Store & { latitude: number; longitude: number } {
  return typeof store.latitude === "number" && Number.isFinite(store.latitude)
    && store.latitude >= -90 && store.latitude <= 90
    && typeof store.longitude === "number" && Number.isFinite(store.longitude)
    && store.longitude >= -180 && store.longitude <= 180;
}

export function getStoreDirections(store: Store): { href: string; label: string } {
  if (hasStoreCoordinates(store)) {
    return {
      href: `https://map.kakao.com/link/to/${encodeURIComponent(store.name)},${store.latitude},${store.longitude}`,
      label: "길찾기",
    };
  }
  return {
    href: `https://map.kakao.com/link/search/${encodeURIComponent(store.address)}`,
    label: "주소로 검색",
  };
}

export function getStorePhoneHref(phone: string): string | undefined {
  if (!/^\+?[\d\s()-]+$/.test(phone)) return undefined;
  const number = phone.replace(/[^\d+]/g, "");
  return /\d/.test(number) ? `tel:${number}` : undefined;
}

function isStore(value: unknown): value is Store {
  if (!value || typeof value !== "object") return false;
  const store = value as Record<string, unknown>;
  return ["id", "region", "name", "address", "phone"].every((key) => typeof store[key] === "string")
    && (store.status === "OPEN" || store.status === "CLOSED")
    && (store.latitude === null || typeof store.latitude === "number")
    && (store.longitude === null || typeof store.longitude === "number")
    && ["provided", "geocoded", "missing", "failed"].includes(String(store.coordinateStatus));
}

/** A malformed API response is an error, never an empty search result. */
export function readStoresResponse(value: unknown): Store[] {
  if (!value || typeof value !== "object") throw new Error("Invalid store response");
  const payload = value as Record<string, unknown>;
  if (!Array.isArray(payload.stores) || !payload.stores.every(isStore)
    || typeof payload.total !== "number" || typeof payload.withCoordinates !== "number") {
    throw new Error("Invalid store response");
  }
  return payload.stores.filter((store) => store.status === "OPEN");
}
