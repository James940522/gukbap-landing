import { createHmac, randomUUID } from "node:crypto";
import { formatContactPhone, type ContactFormValues } from "@/lib/contact-schema";

export type ContactNotificationResult = {
  status: "sent";
  provider: "solapi";
  messageId?: string;
  groupId?: string;
};

type SolapiSendResponse = {
  messageId?: unknown;
  groupId?: unknown;
};

function readRequiredEnv(name: "SOLAPI_API_KEY" | "SOLAPI_API_SECRET" | "SMS_TO" | "SMS_FROM") {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function normalizePhone(value: string) {
  const phone = value.replace(/\D/g, "");
  if (!phone) throw new Error("A notification phone number is not configured.");
  return phone;
}

function createSolapiAuthHeader(apiKey: string, apiSecret: string) {
  const date = new Date().toISOString();
  const salt = randomUUID();
  const signature = createHmac("sha256", apiSecret).update(date + salt).digest("hex");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

function createSmsText(values: ContactFormValues) {
  const phone = normalizePhone(formatContactPhone(values));
  const source = values.referralSources.length ? values.referralSources.join(", ") : "-";
  const domain = values.domain?.trim() || "-";
  const inquiryDetail = values.inquiryDetail.trim() || "-";

  return `[뚝손국밥 창업문의]
성함: ${values.name.trim()}
연락처: ${phone}
창업 희망 지역: ${values.desiredRegion.trim()}
예상 창업 비용: ${values.expectedBudget.trim() || "-"}
방문 유입 경로: ${source}
접수 도메인: ${domain}

문의 내용:
${inquiryDetail}`.slice(0, 1000);
}

export async function sendContactNotification(
  values: ContactFormValues,
): Promise<ContactNotificationResult> {
  const apiKey = readRequiredEnv("SOLAPI_API_KEY");
  const apiSecret = readRequiredEnv("SOLAPI_API_SECRET");
  const to = normalizePhone(readRequiredEnv("SMS_TO"));
  const from = normalizePhone(readRequiredEnv("SMS_FROM"));

  const response = await fetch("https://api.solapi.com/messages/v4/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: createSolapiAuthHeader(apiKey, apiSecret),
    },
    body: JSON.stringify({ message: { to, from, text: createSmsText(values) } }),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });

  // Provider response bodies can contain personal data. Do not log or return them.
  if (!response.ok) throw new Error("Solapi notification request failed.");
  const result = (await response.json().catch(() => null)) as SolapiSendResponse | null;

  return {
    status: "sent",
    provider: "solapi",
    ...(typeof result?.messageId === "string" ? { messageId: result.messageId } : {}),
    ...(typeof result?.groupId === "string" ? { groupId: result.groupId } : {}),
  };
}
