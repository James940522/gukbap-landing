"use client";

import { useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormValues } from "./contact-schema";
import { trackEvent } from "./analytics";

type ContactSubmitResponse = { ok?: boolean; message?: string };

export function useContactSubmission() {
  const pending = useRef(false);
  const [status, setStatus] = useState("");
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phoneFirst: "010",
      phoneMiddle: "",
      phoneLast: "",
      desiredRegion: "",
      expectedBudget: "",
      inquiryDetail: "",
      referralSources: [],
      hp: "",
      domain: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    if (pending.current) return;
    pending.current = true;
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, domain: window.location.hostname }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => null) as ContactSubmitResponse | null;

      if (!response.ok || result?.ok !== true) {
        setStatus(result?.message || "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      if (!values.hp?.trim()) trackEvent("generate_lead", "contact");
      form.reset();
      setStatus(result.message || "문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
    } catch {
      setStatus("접수 결과를 확인하지 못했습니다. 중복 접수를 피하려면 전화로 확인해주세요.");
    } finally {
      pending.current = false;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    await form.handleSubmit(onSubmit, () => setStatus(""))(event);
  }

  return { ...form, status, handleSubmit };
}
