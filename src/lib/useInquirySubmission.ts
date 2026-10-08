"use client";

import { useRef, useState, type FormEvent } from "react";
import { validateInquiry, type InquiryErrors } from "./inquiry";

export function useInquirySubmission(source: "contact" | "floating") {
  const formRef = useRef<HTMLFormElement>(null);
  const pending = useRef(false);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<boolean> {
    event.preventDefault();
    if (pending.current) return false;
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validateInquiry(data);
    setErrors(nextErrors);
    setStatus("");
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      form.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return false;
    }
    pending.current = true;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"), phone: data.get("phone"), region: data.get("region"),
          message: data.get("message") ?? "", privacyAgree: data.get("consent") === "on",
          hp: data.get("hp") ?? "", source,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        setStatus(result?.message || "접수에 실패했습니다. 잠시 후 다시 시도하거나 전화로 문의해주세요.");
        return false;
      }
      form.reset();
      setStatus("가맹문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
      return true;
    } catch {
      setStatus("접수 결과를 확인하지 못했습니다. 중복 접수를 피하려면 전화로 확인해주세요.");
      return false;
    } finally {
      pending.current = false;
      setIsSubmitting(false);
    }
  }

  return { formRef, errors, isSubmitting, status, handleSubmit };
}
