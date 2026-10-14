export type Store = {
  id: string;
  region: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  status: "OPEN" | "CLOSED";
  coordinateStatus: "provided" | "geocoded" | "missing" | "failed";
};

export type StoresWarning = {
  code: string;
  message: string;
  row?: number;
  storeId?: string;
};

export type StoresApiResponse = {
  stores: Store[];
  total: number;
  withCoordinates: number;
  warnings?: StoresWarning[];
};
