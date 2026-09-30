"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowIcon } from "./Icons";

type Field = "name" | "phone" | "region" | "consent";
type Errors = Partial<Record<Field, string>>;

export function InquiryForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [checked, setChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors: Errors = {};
    if (!String(data.get("name") ?? "").trim())
      nextErrors.name = "이름을 입력해주세요.";
    const phone = String(data.get("phone") ?? "").replace(/[\s()-]/g, "");
    if (!/^0\d{8,10}$/.test(phone))
      nextErrors.phone = "연락 가능한 전화번호를 확인해주세요.";
    if (!String(data.get("region") ?? "").trim())
      nextErrors.region = "희망 지역을 입력해주세요.";
    if (data.get("consent") !== "on")
      nextErrors.consent = "동의 항목을 확인해주세요.";
    setErrors(nextErrors);
    setChecked(Object.keys(nextErrors).length === 0);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError)
      formRef.current
        ?.querySelector<HTMLInputElement>(`[name="${firstError}"]`)
        ?.focus();
    // Preview only: never send or persist personal information.
  }

  function error(field: Field) {
    return errors[field] ? (
      <p id={`${field}-error`} className="field-error">
        {errors[field]}
      </p>
    ) : null;
  }

  return (
    <form
      ref={formRef}
      className="inquiry-form"
      onSubmit={handleSubmit}
      onChange={() => {
        if (checked) setChecked(false);
      }}
      noValidate
    >
      <div className="form-heading">
        <h3>가맹 상담 문의</h3>
        <span>
          <i>*</i> 필수 입력
        </span>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="inquiry-name">
            이름 <span>*</span>
          </label>
          <input
            id="inquiry-name"
            name="name"
            autoComplete="name"
            placeholder="성함을 입력해주세요"
            maxLength={50}
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {error("name")}
        </div>
        <div className="form-field">
          <label htmlFor="inquiry-phone">
            연락처 <span>*</span>
          </label>
          <input
            id="inquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="010-0000-0000"
            maxLength={20}
            required
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {error("phone")}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="inquiry-region">
          희망 지역 <span>*</span>
        </label>
        <input
          id="inquiry-region"
          name="region"
          autoComplete="address-level2"
          placeholder="예) 경기도 군포시"
          maxLength={100}
          required
          aria-invalid={!!errors.region}
          aria-describedby={errors.region ? "region-error" : undefined}
        />
        {error("region")}
      </div>
      <div className="form-field">
        <label htmlFor="inquiry-message">
          문의 내용 <span className="optional">선택</span>
        </label>
        <textarea
          id="inquiry-message"
          name="message"
          placeholder="뚝손국밥에 궁금한 점을 편하게 남겨주세요."
          rows={3}
          maxLength={2000}
        />
      </div>
      <div className="consent-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={!!errors.consent}
            aria-describedby={
              errors.consent ? "consent-error" : "privacy-notice"
            }
          />
          <span>개인정보 수집 및 이용에 동의합니다.</span>
        </label>
        <details className="privacy-details">
          <summary>내용 보기</summary>
          <p id="privacy-notice">
            현재는 문의 폼 초안으로 입력 정보는 전송·저장되지 않습니다. 실제
            접수 전 수집 항목, 이용 목적, 보유 기간 및 동의 거부에 관한 안내를
            확정할 예정입니다.
          </p>
        </details>
      </div>
      {error("consent")}
      <button className="button button-primary form-submit" type="submit">
        상담 내용 확인하기
        <ArrowIcon />
      </button>
      <p className="form-caption">
        상담 접수 준비 중 · 입력하신 정보는 전송·저장되지 않습니다.
      </p>
      <div className="form-status" role="status" aria-live="polite">
        {checked && (
          <p>
            입력 내용을 확인했습니다. 아직 상담이 접수된 것은 아닙니다. 정식
            접수가 시작되면 안내드리겠습니다.
          </p>
        )}
      </div>
    </form>
  );
}
