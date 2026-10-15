import { NextResponse } from "next/server";
import { contactFormSchema, type ContactFormValues } from "@/lib/contact-schema";
import { quickInquirySchema } from "@/lib/inquiry";
import { sendContactNotification } from "@/lib/server/send-contact-notification";

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 3;
const MAX_BODY_BYTES = 16 * 1024;
const SUCCESS_MESSAGE = "문의가 접수되었습니다. 담당자가 확인 후 빠르게 연락드리겠습니다.";

// Shared by both routes within this server instance. This is not a distributed limit.
const requests = new Map<string, number[]>();

function allowRequest(ip: string) {
  const now = Date.now();
  for (const [key, timestamps] of requests) {
    if (timestamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW)) requests.delete(key);
  }
  const recent = (requests.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX || (!requests.has(ip) && requests.size >= 10000)) return false;
  requests.set(ip, [...recent, now]);
  return true;
}

function failure(status: number, message: string) {
  return NextResponse.json({ ok: false, message }, { status });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  // Next may normalize request.url behind a proxy, so retain the original Host.
  const requestUrl = new URL(request.url);
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProtocol === "https" || forwardedProtocol === "http"
    ? `${forwardedProtocol}:` : requestUrl.protocol;
  try {
    const expectedOrigin = new URL(`${protocol}//${request.headers.get("host") || requestUrl.host}`);
    return origin === expectedOrigin.origin;
  } catch {
    return false;
  }
}

async function readPayload(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return { payload: null };

  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { tooLarge: true as const, payload: null };
      }
      chunks.push(value);
    }
    return { payload: JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown };
  } catch {
    return { payload: null };
  } finally {
    reader.releaseLock();
  }
}

type QuickInquiryValues = ReturnType<typeof quickInquirySchema.parse>;

function adaptQuickInquiry(values: QuickInquiryValues): ContactFormValues {
  const phone = values.phone.replace(/\D/g, "");
  const prefixLength = phone.startsWith("02") ? 2 : 3;
  return {
    name: values.name,
    phoneFirst: phone.slice(0, prefixLength),
    phoneMiddle: phone.slice(prefixLength, -4),
    phoneLast: phone.slice(-4),
    desiredRegion: values.region,
    expectedBudget: "-",
    inquiryDetail: values.message.trim() || "-",
    referralSources: [],
    privacyAgreed: true,
    hp: values.hp,
    domain: values.domain,
  };
}

export async function handleContactRequest(request: Request, allowQuickInquiry = false) {
  try {
    if (!isSameOrigin(request)) return failure(403, "접근할 수 없는 요청입니다.");

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")?.trim() || "unknown";
    if (!allowRequest(ip)) {
      return NextResponse.json({
        ok: false,
        error: "TOO_MANY_REQUESTS",
        message: "너무 많은 요청입니다. 잠시 후 다시 시도해 주세요.",
      }, { status: 429 });
    }

    const body = await readPayload(request);
    if (body.tooLarge) return failure(413, "문의 내용이 너무 깁니다.");

    const isQuickInquiry = allowQuickInquiry && body.payload !== null
      && typeof body.payload === "object" && !Array.isArray(body.payload)
      && "phone" in body.payload;
    const parsed = isQuickInquiry
      ? quickInquirySchema.safeParse(body.payload)
      : contactFormSchema.safeParse(body.payload);

    if (!parsed.success) {
      return NextResponse.json({
        ok: false,
        error: "INVALID_INPUT",
        message: parsed.error.issues[0]?.message ?? "입력 내용을 다시 확인해 주세요.",
        issues: parsed.error.issues,
      }, { status: 400 });
    }

    const values = "phone" in parsed.data ? adaptQuickInquiry(parsed.data) : parsed.data;
    if (values.hp?.trim()) {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
    }

    const notification = await sendContactNotification(values);
    return NextResponse.json({ ok: true, notification, message: SUCCESS_MESSAGE });
  } catch {
    return failure(500, "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
}
