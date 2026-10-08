export type InquiryField = "name" | "phone" | "region" | "message" | "consent";
export type InquiryErrors = Partial<Record<InquiryField, string>>;

export function validateInquiry(data: FormData): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!String(data.get("name") ?? "").trim() || String(data.get("name")).length > 50)
    errors.name = "이름을 입력해주세요.";
  const phone = String(data.get("phone") ?? "").replace(/[\s()-]/g, "");
  if (!/^0\d{8,10}$/.test(phone))
    errors.phone = "연락 가능한 전화번호를 확인해주세요.";
  if (!String(data.get("region") ?? "").trim() || String(data.get("region")).length > 100)
    errors.region = "희망 지역을 입력해주세요.";
  if (String(data.get("message") ?? "").length > 800)
    errors.message = "문의 내용은 800자 이내로 입력해주세요.";
  if (data.get("consent") !== "on")
    errors.consent = "동의 항목을 확인해주세요.";
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

export const inquiryPrivacyNotice = "수집 주체: 주식회사 산본에프앤비. 수집 항목: 이름, 연락처, 희망 지역, 문의 내용(선택). 이용 목적: 가맹 상담 및 문의 응대. 상담 목적 달성 후 지체 없이 파기합니다. 동의를 거부할 수 있으며, 거부 시 온라인 상담 접수가 제한됩니다. 상담 내용은 SOLAPI를 통해 담당자에게 문자로 전달됩니다.";
