import type { KakaoMapsNamespace } from "@/types/kakao-maps";

const SDK_URL = "https://dapi.kakao.com/v2/maps/sdk.js";
let sdkPromise: Promise<KakaoMapsNamespace> | null = null;
let sdkKey: string | null = null;

/** Shared by every finder instance, including React Strict Mode mounts. */
export function loadKakaoMaps(apiKey: string, timeoutMs = 12_000): Promise<KakaoMapsNamespace> {
  if (typeof window === "undefined" || !apiKey.trim()) {
    return Promise.reject(new Error("Map service unavailable"));
  }

  if (sdkPromise) {
    return sdkKey === apiKey
      ? sdkPromise
      : Promise.reject(new Error("Map service configuration changed"));
  }

  sdkKey = apiKey;
  const pending = new Promise<KakaoMapsNamespace>((resolve, reject) => {
    let settled = false;
    let script: HTMLScriptElement | null = null;
    const timeout = window.setTimeout(() => fail(), timeoutMs);

    const cleanup = () => {
      window.clearTimeout(timeout);
      script?.removeEventListener("load", startMaps);
      script?.removeEventListener("error", fail);
    };

    const fail = () => {
      if (settled) return;
      settled = true;
      cleanup();
      // Failed scripts must not trap the next retry waiting for a past load event.
      script?.remove();
      reject(new Error("Map service could not be loaded"));
    };

    const startMaps = () => {
      if (settled) return;
      const maps = window.kakao?.maps;
      if (!maps || typeof maps.load !== "function") {
        fail();
        return;
      }

      try {
        maps.load(() => {
          if (settled) return;
          if (typeof maps.Map !== "function" || typeof maps.LatLng !== "function"
            || typeof maps.LatLngBounds !== "function" || typeof maps.CustomOverlay !== "function") {
            fail();
            return;
          }
          settled = true;
          cleanup();
          resolve(maps);
        });
      } catch {
        fail();
      }
    };

    const matchingScript = Array.from(document.scripts).find((candidate) => {
      try {
        const url = new URL(candidate.src);
        return `${url.origin}${url.pathname}` === SDK_URL && url.searchParams.get("appkey") === apiKey;
      } catch {
        return false;
      }
    });

    // Another application key must never be silently reused.
    const otherScript = Array.from(document.scripts).some((candidate) => {
      try {
        const url = new URL(candidate.src);
        return `${url.origin}${url.pathname}` === SDK_URL && url.searchParams.get("appkey") !== apiKey;
      } catch {
        return false;
      }
    });
    if (otherScript) {
      fail();
      return;
    }

    script = matchingScript ?? document.createElement("script");
    script.addEventListener("load", startMaps);
    script.addEventListener("error", fail);

    if (window.kakao?.maps && matchingScript) {
      startMaps();
      return;
    }

    if (!matchingScript) {
      const url = new URL(SDK_URL);
      url.searchParams.set("appkey", apiKey);
      url.searchParams.set("autoload", "false");
      script.src = url.toString();
      script.async = true;
      script.dataset.dduksonKakaoSdk = "true";
      document.head.appendChild(script);
    }
  });

  sdkPromise = pending.catch((error: unknown) => {
    sdkPromise = null;
    sdkKey = null;
    throw error;
  });
  return sdkPromise;
}
