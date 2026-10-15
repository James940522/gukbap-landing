"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { loadKakaoMaps } from "@/lib/kakao-maps";
import { filterStores, getStoreDirections, getStorePhoneHref, hasStoreCoordinates, readStoresResponse } from "@/lib/store-search";
import type { KakaoCustomOverlay, KakaoMap, KakaoMapsNamespace } from "@/types/kakao-maps";
import type { Store } from "@/types/stores";
import styles from "./StoreMapSection.module.css";

const MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? "";
const INITIAL_CENTER = { latitude: 36.5, longitude: 127.5 };
type MobileTab = "list" | "map";
type MapStatus = "loading" | "ready" | "error" | "unavailable";
type DataStatus = "loading" | "ready" | "error";
type Pin = { overlay: KakaoCustomOverlay; button: HTMLButtonElement; dispose: () => void };

function SearchIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>;
}

function DirectionsLink({ store, primary = false }: { store: Store; primary?: boolean }) {
  const directions = getStoreDirections(store);
  return (
    <a
      href={directions.href}
      target="_blank"
      rel="noopener noreferrer"
      className={primary ? `button button-primary ${styles.cardDirections}` : styles.directions}
      aria-label={`${store.name} ${directions.label} (새 창)`}
    >
      {directions.label}<ArrowIcon />
    </a>
  );
}

function StorePhone({ store }: { store: Store }) {
  if (!store.phone) return null;
  const href = getStorePhoneHref(store.phone);
  return href ? <a className={styles.phone} href={href} aria-label={`${store.name} 전화 ${store.phone}`}>{store.phone}</a>
    : <span className={styles.phone}>{store.phone}</span>;
}

export function StoreMapSection({
  headingLevel = 2,
  initialStores,
  initialError = false,
}: {
  headingLevel?: 1 | 2;
  initialStores?: Store[];
  initialError?: boolean;
} = {}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const instanceId = useId();
  const listTabId = `${instanceId}-list-tab`;
  const mapTabId = `${instanceId}-map-tab`;
  const listPanelId = `${instanceId}-list-panel`;
  const mapPanelId = `${instanceId}-map-panel`;
  const searchId = `${instanceId}-search`;
  const [stores, setStores] = useState<Store[]>(initialStores ?? []);
  const [dataStatus, setDataStatus] = useState<DataStatus>(initialError ? "error" : initialStores ? "ready" : "loading");
  const [updateFailed, setUpdateFailed] = useState(false);
  const hasDirectoryRef = useRef(initialStores !== undefined && !initialError);
  const [dataAttempt, setDataAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectionAttempt, setSelectionAttempt] = useState(0);
  const [mobileTab, setMobileTab] = useState<MobileTab>("list");
  const [mapStatus, setMapStatus] = useState<MapStatus>(MAP_KEY.trim() ? "loading" : "unavailable");
  const [mapAttempt, setMapAttempt] = useState(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const sdkRef = useRef<KakaoMapsNamespace | null>(null);
  const pinsRef = useRef<Map<string, Pin>>(new Map());
  const listTabRef = useRef<HTMLButtonElement>(null);
  const mapTabRef = useRef<HTMLButtonElement>(null);
  const focusSelectionRef = useRef(false);
  const filteredStores = useMemo(() => filterStores(stores, query), [stores, query]);
  const selectedStore = useMemo(() => filteredStores.find((store) => store.id === selectedId) ?? null, [filteredStores, selectedId]);
  const missingCoordinates = filteredStores.filter((store) => !hasStoreCoordinates(store)).length;

  const clearPins = useCallback(() => {
    pinsRef.current.forEach((pin) => {
      pin.dispose();
      pin.overlay.setMap(null);
    });
    pinsRef.current.clear();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const timeout = window.setTimeout(() => controller.abort(), 25_000);

    async function fetchStores() {
      try {
        const response = await fetch("/api/stores", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Store request failed");
        const payload: unknown = await response.json();
        const result = readStoresResponse(payload);
        if (cancelled) return;
        setStores(result);
        setSelectedId((current) => result.some((store) => store.id === current) ? current : null);
        hasDirectoryRef.current = true;
        setDataStatus("ready");
        setUpdateFailed(false);
      } catch {
        if (!cancelled) {
          // Keep the server directory usable when coordinate refresh is unavailable.
          setDataStatus(hasDirectoryRef.current ? "ready" : "error");
          setUpdateFailed(hasDirectoryRef.current);
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void fetchStores();
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [dataAttempt]);

  useEffect(() => {
    if (!MAP_KEY.trim()) return;
    let cancelled = false;
    const container = mapContainerRef.current;

    void loadKakaoMaps(MAP_KEY).then((sdk) => {
      if (cancelled || !container) return;
      try {
        sdkRef.current = sdk;
        mapRef.current = new sdk.Map(container, {
          center: new sdk.LatLng(INITIAL_CENTER.latitude, INITIAL_CENTER.longitude),
          level: 13,
        });
        setMapStatus("ready");
      } catch {
        setMapStatus("error");
      }
    }).catch(() => {
      if (!cancelled) setMapStatus("error");
    });

    return () => {
      cancelled = true;
      clearPins();
      mapRef.current = null;
      sdkRef.current = null;
      container?.replaceChildren();
    };
  }, [clearPins, mapAttempt]);

  const selectStore = useCallback((store: Store, fromList = false) => {
    focusSelectionRef.current = true;
    setSelectedId(store.id);
    setSelectionAttempt((attempt) => attempt + 1);
    setMobileTab("map");
    if (fromList && window.matchMedia("(max-width: 899px)").matches) {
      mapTabRef.current?.focus();
    }
  }, []);

  const fitFilteredStores = useCallback(() => {
    const sdk = sdkRef.current;
    const map = mapRef.current;
    const container = mapContainerRef.current;
    if (!sdk || !map || !container?.clientWidth || !container.clientHeight) return;
    const positionedStores = filteredStores.filter(hasStoreCoordinates);
    if (positionedStores.length === 1) {
      const store = positionedStores[0];
      map.setCenter(new sdk.LatLng(store.latitude, store.longitude));
      map.setLevel(4);
    } else if (positionedStores.length > 1) {
      const bounds = new sdk.LatLngBounds();
      positionedStores.forEach((store) => bounds.extend(new sdk.LatLng(store.latitude, store.longitude)));
      map.setBounds(bounds, 54, 40, 54, 40);
    }
  }, [filteredStores]);

  // Overlay content contains DOM elements only; store strings never become HTML.
  useEffect(() => {
    const sdk = sdkRef.current;
    const map = mapRef.current;
    if (mapStatus !== "ready" || !sdk || !map) return;
    clearPins();

    filteredStores.filter(hasStoreCoordinates).forEach((store) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = styles.pin;
      button.setAttribute("aria-label", `${store.name} 매장 상세 보기`);
      button.setAttribute("aria-pressed", "false");
      const logo = document.createElement("img");
      logo.src = "/images/logos/ddukson-gukbap.png";
      logo.alt = "";
      logo.width = 48;
      logo.height = 20;
      button.appendChild(logo);
      const onClick = () => selectStore(store);
      button.addEventListener("click", onClick);
      const overlay = new sdk.CustomOverlay({
        map,
        content: button,
        position: new sdk.LatLng(store.latitude, store.longitude),
        xAnchor: 0.5,
        yAnchor: 1.2,
        zIndex: 2,
        clickable: true,
      });
      pinsRef.current.set(store.id, { overlay, button, dispose: () => button.removeEventListener("click", onClick) });
    });

    fitFilteredStores();
    return clearPins;
  }, [clearPins, filteredStores, fitFilteredStores, mapStatus, selectStore]);

  useEffect(() => {
    const sdk = sdkRef.current;
    const map = mapRef.current;
    if (mapStatus !== "ready" || !sdk || !map) return;
    pinsRef.current.forEach((pin, id) => {
      const selected = selectedStore?.id === id;
      pin.button.classList.toggle(styles.pinSelected, selected);
      pin.button.setAttribute("aria-pressed", String(selected));
      pin.overlay.setZIndex(selected ? 4 : 2);
    });
  }, [mapStatus, selectedStore, filteredStores]);

  useEffect(() => {
    const sdk = sdkRef.current;
    const map = mapRef.current;
    if (mapStatus !== "ready" || !sdk || !map) return;
    if (focusSelectionRef.current && selectedStore && hasStoreCoordinates(selectedStore) && mapContainerRef.current?.clientWidth) {
      map.setLevel(4);
      map.panTo(new sdk.LatLng(selectedStore.latitude, selectedStore.longitude));
    }
  }, [mapStatus, selectedStore, selectionAttempt]);

  // A hidden mobile map and every container resize need a fresh SDK layout.
  useEffect(() => {
    const map = mapRef.current;
    const sdk = sdkRef.current;
    const container = mapContainerRef.current;
    if (mapStatus !== "ready" || !map || !sdk || !container) return;
    let frame = 0;
    const relayout = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!container.clientWidth || !container.clientHeight) return;
        map.relayout();
        if (focusSelectionRef.current && selectedStore && hasStoreCoordinates(selectedStore)) {
          map.setCenter(new sdk.LatLng(selectedStore.latitude, selectedStore.longitude));
          map.setLevel(4);
        } else {
          fitFilteredStores();
        }
      });
    };
    const observer = new ResizeObserver(relayout);
    observer.observe(container);
    relayout();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [fitFilteredStores, mapStatus, mobileTab, selectedStore]);

  const updateQuery = (value: string) => {
    focusSelectionRef.current = false;
    setQuery(value);
    if (selectedId && !filterStores(stores, value).some((store) => store.id === selectedId)) setSelectedId(null);
  };

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextTab = event.key === "Home" ? "list" : event.key === "End" ? "map" : mobileTab === "list" ? "map" : "list";
    setMobileTab(nextTab);
    (nextTab === "list" ? listTabRef : mapTabRef).current?.focus();
  };

  const retryData = () => {
    if (!hasDirectoryRef.current) setDataStatus("loading");
    setUpdateFailed(false);
    setDataAttempt((attempt) => attempt + 1);
  };

  const retryMap = () => {
    setMapStatus("loading");
    setMapAttempt((attempt) => attempt + 1);
  };

  return (
    <section id="stores" className={`section ${styles.section}`} aria-labelledby="stores-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.sidebar}>
          <Reveal className={styles.heading}>
            <p className={`small-label ${styles.eyebrow}`}>FIND DDUKSON</p>
            <Heading id="stores-title" className={`section-title ${styles.title}`}>가까운 뚝손국밥을<br />찾아보세요</Heading>
            <p className={styles.introduction}>전국 뚝손국밥 매장을 확인하고,<br className={styles.desktopBreak} /> 가까운 매장을 만나보세요.</p>
            {headingLevel === 2 && stores.length > 0 && (
              <Link href="/stores" className="button button-secondary">전체 매장 보기<ArrowIcon /></Link>
            )}
          </Reveal>
          <div className={styles.search}>
            <label htmlFor={searchId} className={styles.searchLabel}>지역·매장명·주소 검색</label>
            <div className={styles.searchField}>
              <SearchIcon />
              <input id={searchId} type="search" autoComplete="off" placeholder="지역, 매장명 또는 주소" value={query} onChange={(event) => updateQuery(event.target.value)} />
              {query && <button type="button" className={styles.clearSearch} onClick={() => updateQuery("")} aria-label="검색어 지우기">×</button>}
            </div>
          </div>
          <div className={styles.tabs} role="tablist" aria-label="매장 보기 방식">
            <button ref={listTabRef} id={listTabId} role="tab" type="button" aria-controls={listPanelId} aria-selected={mobileTab === "list"} tabIndex={mobileTab === "list" ? 0 : -1} onClick={() => setMobileTab("list")} onKeyDown={handleTabKey}>매장 목록</button>
            <button ref={mapTabRef} id={mapTabId} role="tab" type="button" aria-controls={mapPanelId} aria-selected={mobileTab === "map"} tabIndex={mobileTab === "map" ? 0 : -1} onClick={() => setMobileTab("map")} onKeyDown={handleTabKey}>지도 보기</button>
          </div>
          <div className={styles.resultsSummary} role="status" aria-live="polite">
            {dataStatus === "loading" ? "매장 목록을 불러오는 중입니다." : dataStatus === "error" ? "매장 정보를 확인할 수 없습니다." : <>검색 결과 <strong>{filteredStores.length}</strong>개</>}
          </div>
          <div id={listPanelId} role="tabpanel" aria-labelledby={listTabId} tabIndex={0} className={`${styles.listPanel} ${mobileTab === "map" ? styles.mobileHidden : ""}`} aria-busy={dataStatus === "loading"}>
            {dataStatus === "loading" ? (
              <div className={styles.empty}><span className={styles.statusMark} aria-hidden="true">···</span><p>가까운 매장을 찾고 있습니다.</p></div>
            ) : dataStatus === "error" ? (
              <div className={styles.empty}><p>매장 정보를 불러오지 못했습니다.</p><span>잠시 후 다시 시도해주세요.</span><button type="button" className={`button button-secondary ${styles.retry}`} onClick={retryData}>다시 불러오기</button></div>
            ) : stores.length === 0 ? (
              <div className={styles.empty}><p>매장 정보를 준비하고 있습니다.</p><span>새로운 뚝손국밥 매장 소식을 기다려주세요.</span></div>
            ) : filteredStores.length === 0 ? (
              <div className={styles.empty}><p>검색 결과가 없습니다.</p><span>다른 지역이나 매장명으로 검색해보세요.</span><button type="button" className={`button button-secondary ${styles.retry}`} onClick={() => updateQuery("")}>전체 매장 보기</button></div>
            ) : (
              <ul className={styles.storeList}>
                {filteredStores.map((store) => (
                  <li key={store.id} className={`${styles.storeItem} ${selectedId === store.id ? styles.storeSelected : ""}`}>
                    <div className={styles.storeTopline}><span>{store.region}</span>{!hasStoreCoordinates(store) && <span className={styles.coordinateNote}>지도 위치 확인 중</span>}</div>
                    <h3><button type="button" className={styles.storeSelect} aria-pressed={selectedId === store.id} aria-label={`${store.name} 매장 상세 보기`} onClick={() => selectStore(store, true)}><span className={styles.storeName}>{store.name}</span><ArrowIcon /></button></h3>
                    <p className={styles.address}>{store.address}</p>
                    <div className={styles.storeActions}><StorePhone store={store} /><DirectionsLink store={store} /></div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {dataStatus === "ready" && missingCoordinates > 0 && <p className={styles.locationNotice}>지도 위치가 확인되지 않은 매장은 주소로 검색할 수 있습니다.</p>}
          {updateFailed && <p className={styles.locationNotice} role="status">매장 정보를 갱신하지 못했습니다. 표시된 주소와 연락처는 계속 확인할 수 있습니다. <button type="button" className={`button button-secondary ${styles.retry}`} onClick={retryData}>다시 불러오기</button></p>}
        </div>
        <div id={mapPanelId} role="tabpanel" aria-labelledby={mapTabId} tabIndex={0} className={`${styles.mapPanel} ${mobileTab === "list" ? styles.mobileHidden : ""}`} aria-busy={mapStatus === "loading"}>
          <div ref={mapContainerRef} className={styles.mapCanvas} aria-label="뚝손국밥 매장 지도" />
          {mapStatus !== "ready" && (
            <div className={styles.mapState} role="status">
              <p className="small-label">DDUKSON GUKBAP</p>
              <p className={styles.mapStateTitle}>{mapStatus === "loading" ? "지도를 불러오고 있습니다." : "지도를 잠시 이용할 수 없습니다."}</p>
              <p>{mapStatus === "loading" ? "잠시만 기다려주세요." : "매장 목록에서 주소와 연락처를 확인해주세요."}</p>
              {mapStatus === "error" && <button type="button" className={`button button-secondary ${styles.retry}`} onClick={retryMap}>지도 다시 불러오기</button>}
            </div>
          )}
          {mapStatus === "ready" && dataStatus === "ready" && filteredStores.length === 0 && <p className={styles.mapNotice}>{stores.length === 0 ? "등록된 매장 정보를 준비하고 있습니다." : "검색 조건에 맞는 매장이 없습니다."}</p>}
          {selectedStore && (
            <div className={styles.selectedCard} aria-live="polite">
              <div className={styles.cardTopline}><span className="small-label">{selectedStore.region}</span><button type="button" onClick={() => setSelectedId(null)} className={styles.closeCard} aria-label="선택 매장 정보 닫기">×</button></div>
              <h3>{selectedStore.name}</h3>
              <p className={styles.address}>{selectedStore.address}</p>
              {!hasStoreCoordinates(selectedStore) && <p className={styles.cardLocationNote}>지도 위치가 확인되지 않아 주소 검색으로 안내합니다.</p>}
              <div className={styles.cardActions}><StorePhone store={selectedStore} /><DirectionsLink store={selectedStore} primary /></div>
            </div>
          )}
          <button type="button" className={styles.backToList} onClick={() => { setMobileTab("list"); listTabRef.current?.focus(); }}>← 매장 목록</button>
        </div>
      </div>
    </section>
  );
}
