import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { validateInquiry } from "@/lib/inquiry";

export const runtime = "nodejs";

// Same per-instance limit as the reference projects. See README for deployment limits.
const requests = new Map<string, number[]>();
function allowRequest(ip: string) {
  const now = Date.now();
  for (const [key, times] of requests) {
    if (times.every((time) => now - time >= 60000)) requests.delete(key);
  }
  const recent = (requests.get(ip) ?? []).filter((time) => now - time < 60000);
  if (recent.length >= 3 || (!requests.has(ip) && requests.size >= 10000)) return false;
  requests.set(ip, [...recent, now]);
  return true;
}

function failure(status: number, message: string) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next may normalize request.url to localhost behind a proxy; use the actual Host.
  const requestUrl = new URL(request.url);
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProtocol === "https" || forwardedProtocol === "http"
    ? `${forwardedProtocol}:` : requestUrl.protocol;
  const expectedOrigin = new URL(`${protocol}//${request.headers.get("host") || requestUrl.host}`);
  if (origin && origin !== expectedOrigin.origin) {
    return failure(403, "접근할 수 없는 요청입니다.");
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip") || "unknown";
  if (!allowRequest(ip)) {
    return failure(429, "요청이 너무 많습니다. 1분 후 다시 시도해주세요.");
  }
  // Bound input before parsing; never log names, phone numbers, or provider bodies.
  const reader = request.body?.getReader();
  if (!reader) return failure(400, "입력 내용을 확인해주세요.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  let body: Record<string, unknown>;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        return failure(413, "문의 내용이 너무 깁니다.");
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch {
    return failure(400, "입력 내용을 확인해주세요.");
  }
  if (["name", "phone", "region"].some((key) => typeof body[key] !== "string")
    || (body.message !== undefined && typeof body.message !== "string")
    || (body.hp !== undefined && typeof body.hp !== "string")
    || body.privacyAgree !== true
    || !["contact", "floating"].includes(String(body.source))) {
    return failure(400, "입력 내용과 개인정보 동의를 확인해주세요.");
  }
  const data = new FormData();
  for (const key of ["name", "phone", "region", "message"]) data.set(key, String(body[key] ?? ""));
  data.set("consent", "on");
  const errors = validateInquiry(data);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, message: Object.values(errors)[0], errors }, { status: 400 });
  }
  if (body.hp) return NextResponse.json({ ok: true });

  const apiKey = process.env.SOLAPI_API_KEY?.trim();
  const apiSecret = process.env.SOLAPI_API_SECRET?.trim();
  const to = process.env.SMS_TO?.replace(/[\s()-]/g, "");
  const from = process.env.SMS_FROM?.replace(/[\s()-]/g, "");
  if (!apiKey || !apiSecret || !to || !from || !/^0\d{8,10}$/.test(to) || !/^0\d{8,10}$/.test(from)) {
    return failure(503, "온라인 상담 접수 준비 중입니다. 전화로 문의해주세요.");
  }
  const date = new Date().toISOString();
  const salt = randomUUID();
  const signature = createHmac("sha256", apiSecret).update(date + salt).digest("hex");
  const singleLine = (value: unknown) => String(value).trim().replace(/[\r\n\t]+/g, " ");
  // Enforce a conservative UTF-8 byte bound without silently truncating an inquiry.
  const text = `[뚝손국밥 가맹문의]\n이름: ${singleLine(body.name)}\n연락처: ${String(body.phone).replace(/\D/g, "")}\n희망 지역: ${singleLine(body.region)}\n접수 경로: ${body.source === "floating" ? "빠른 가맹문의" : "홈페이지 상담 폼"}\n\n문의 내용:\n${String(body.message ?? "").trim() || "-"}`;
  if (Buffer.byteLength(text, "utf8") > 2000) {
    return failure(400, "문의 내용이 문자 전송 한도를 넘습니다. 내용을 조금 줄여주세요.");
  }
  try {
    const response = await fetch("https://api.solapi.com/messages/v4/send-many/detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
      },
      body: JSON.stringify({ messages: [{ to, from, text, type: "LMS", subject: "뚝손국밥 가맹문의" }] }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.groupInfo?.count?.registeredSuccess !== 1
      || result?.groupInfo?.count?.registeredFailed > 0 || result?.groupInfo?.count?.sentFailed > 0) {
      return failure(502, "접수에 실패했습니다. 잠시 후 다시 시도하거나 전화로 문의해주세요.");
    }
    return NextResponse.json({ ok: true });
  } catch {
    return failure(504, "접수 결과를 확인하지 못했습니다. 중복 접수를 피하려면 전화로 확인해주세요.");
  }
}
