import { z } from "zod";

export type InquiryField = "name" | "phone" | "region" | "message" | "consent";
export type InquiryErrors = Partial<Record<InquiryField, string>>;

// The compact inquiry desk keeps its original fields and /api/leads contract.
export const quickInquirySchema = z.object({
  name: z.string().trim().min(2, "이름을 2자 이상 입력해주세요.").max(50, "이름은 50자 이내로 입력해주세요."),
  phone: z.string().transform((value) => value.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^0\d{8,10}$/, "연락 가능한 전화번호를 확인해주세요.")),
  region: z.string().trim().min(1, "희망 지역을 입력해주세요.").max(100, "희망 지역은 100자 이내로 입력해주세요."),
  message: z.string().max(800, "문의 내용은 800자 이내로 입력해주세요.").default(""),
  privacyAgree: z.literal(true, { error: "동의 항목을 확인해주세요." }),
  hp: z.string().optional(),
  domain: z.string().optional(),
  source: z.enum(["contact", "floating"]),
});

export function validateInquiry(data: FormData): InquiryErrors {
  const errors: InquiryErrors = {};
  const parsed = quickInquirySchema.safeParse({
    name: data.get("name") ?? "",
    phone: data.get("phone") ?? "",
    region: data.get("region") ?? "",
    message: data.get("message") ?? "",
    privacyAgree: data.get("consent") === "on",
    source: "floating",
  });
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] === "privacyAgree" ? "consent" : issue.path[0];
      if (field === "name" || field === "phone" || field === "region" || field === "message" || field === "consent") {
        errors[field] ??= issue.message;
      }
    }
  }
  return errors;
}

// Adapted from the reference projects; retain mobile and landline area codes.
export function sanitizePhoneInput(value: string) {
  const numbers = value.replace(/\D/g, "");
  const digits = numbers.slice(0, numbers.startsWith("02") ? 10 : 11);
  const prefixLength = digits.startsWith("02") ? 2 : 3;
  if (digits.length <= prefixLength) return digits;
  if (digits.length <= prefixLength + 4)
    return `${digits.slice(0, prefixLength)}-${digits.slice(prefixLength)}`;
  return `${digits.slice(0, prefixLength)}-${digits.slice(prefixLength, -4)}-${digits.slice(-4)}`;
}

export const inquiryPrivacyNotice = "수집 주체: 주식회사 산본에프앤비. 수집 항목: 이름, 연락처, 창업 희망 지역, 예상 창업 비용, 문의 내용, 방문 유입 경로, 동의 여부, 접수 도메인. 빠른 가맹문의는 이름, 연락처, 희망 지역, 동의 여부, 접수 도메인을 수집합니다. 이용 목적: 가맹 상담 및 문의 응대. 상담 목적 달성 후 지체 없이 파기합니다. 동의를 거부할 수 있으며, 거부 시 온라인 상담 접수가 제한됩니다. 상담 내용은 SOLAPI를 통해 담당자에게 문자로 전달됩니다.";
