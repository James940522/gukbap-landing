import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { loadStoresFromCsv, StoresDataError } from "@/lib/stores";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const noCacheHeaders = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    // Read on every request so CSV edits/deployments never reuse a stale list.
    const csv = await readFile(path.join(process.cwd(), "data", "stores.csv"), "utf8");
    const result = await loadStoresFromCsv(csv, process.env.KAKAO_REST_API_KEY);
    return NextResponse.json(result, { headers: noCacheHeaders });
  } catch (error) {
    if (error instanceof StoresDataError) {
      return NextResponse.json({ error: error.message }, { status: 422, headers: noCacheHeaders });
    }
    if (process.env.NODE_ENV !== "production") console.error("[stores] Unable to read store data");
    return NextResponse.json(
      { error: "매장 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500, headers: noCacheHeaders },
    );
  }
}
