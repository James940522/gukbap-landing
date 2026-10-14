/** The small portion of the Kakao Maps SDK used by the store finder. */
export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoLatLngBounds {
  extend(position: KakaoLatLng): void;
}

export interface KakaoMap {
  setCenter(position: KakaoLatLng): void;
  panTo(position: KakaoLatLng): void;
  setLevel(level: number): void;
  setBounds(bounds: KakaoLatLngBounds, top?: number, right?: number, bottom?: number, left?: number): void;
  relayout(): void;
}

export interface KakaoCustomOverlay {
  setMap(map: KakaoMap | null): void;
  setZIndex(zIndex: number): void;
}

export interface KakaoMapsNamespace {
  load(callback: () => void): void;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  LatLngBounds: new () => KakaoLatLngBounds;
  CustomOverlay: new (options: {
    map?: KakaoMap;
    position: KakaoLatLng;
    content: HTMLElement;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
    clickable?: boolean;
  }) => KakaoCustomOverlay;
}

declare global {
  interface Window {
    kakao?: { maps?: KakaoMapsNamespace };
  }
}
