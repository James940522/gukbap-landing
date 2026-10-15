import { z } from "zod";

export const referralSourceOptions = [
  "네이버 검색",
  "인스타그램",
  "유튜브",
  "카카오톡 배너광고",
  "카페·커뮤니티",
  "지인 추천",
] as const;

export const budgetOptions = [
  "5천만원 미만",
  "5천만원~1억원",
  "1억원~1억5천만원",
  "1억5천만원 이상",
  "상담 후 결정",
] as const;

const phoneSegment = z.string().trim().regex(/^\d+$/, "숫자만 입력해 주세요.");

// Shared by the main form and API. Referral sources are optional.
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "성함을 입력해 주세요."),
  phoneFirst: phoneSegment.min(2, "연락처를 확인해 주세요.").max(3, "연락처를 확인해 주세요."),
  phoneMiddle: phoneSegment.min(3, "연락처를 확인해 주세요.").max(4, "연락처를 확인해 주세요."),
  phoneLast: phoneSegment.min(4, "연락처를 확인해 주세요.").max(4, "연락처를 확인해 주세요."),
  desiredRegion: z.string().trim().min(2, "창업 희망 지역을 입력해 주세요."),
  expectedBudget: z.string().trim().min(1, "예상 창업 비용을 선택해 주세요."),
  inquiryDetail: z.string().trim().min(5, "문의 내용을 5자 이상 입력해 주세요."),
  referralSources: z.array(z.enum(referralSourceOptions)).default([]),
  privacyAgreed: z.literal(true, { error: "개인정보 수집 및 이용에 동의해 주세요." }),
  hp: z.string().optional(),
  domain: z.string().optional(),
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormValues = z.output<typeof contactFormSchema>;

export function formatContactPhone(
  values: Pick<ContactFormValues, "phoneFirst" | "phoneMiddle" | "phoneLast">,
) {
  return `${values.phoneFirst}-${values.phoneMiddle}-${values.phoneLast}`;
}
