export type InquiryField = "name" | "phone" | "region" | "consent";
export type InquiryErrors = Partial<Record<InquiryField, string>>;

export function validateInquiry(data: FormData): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!String(data.get("name") ?? "").trim())
    errors.name = "이름을 입력해주세요.";
  const phone = String(data.get("phone") ?? "").replace(/[\s()-]/g, "");
  if (!/^0\d{8,10}$/.test(phone))
    errors.phone = "연락 가능한 전화번호를 확인해주세요.";
  if (!String(data.get("region") ?? "").trim())
    errors.region = "희망 지역을 입력해주세요.";
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
