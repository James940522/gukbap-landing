"use client";

import { ArrowIcon } from "./Icons";
import { budgetOptions, referralSourceOptions, type ContactFormValues } from "@/lib/contact-schema";
import { inquiryPrivacyNotice } from "@/lib/inquiry";
import { useContactSubmission } from "@/lib/useContactSubmission";

const phoneFields = [
  { name: "phoneFirst", label: "연락처 앞자리", maxLength: 3 },
  { name: "phoneMiddle", label: "연락처 가운데 자리", maxLength: 4 },
  { name: "phoneLast", label: "연락처 마지막 자리", maxLength: 4 },
] as const;

export function InquiryForm() {
  const { register, formState: { errors, isSubmitting }, status, handleSubmit } = useContactSubmission();

  function error(field: keyof ContactFormValues) {
    return errors[field] ? (
      <p id={`inquiry-${field}-error`} className="field-error">
        {errors[field]?.message}
      </p>
    ) : null;
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      <input className="inquiry-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" {...register("hp")} />
      <fieldset className="inquiry-fields" disabled={isSubmitting}>
        <div className="form-heading">
          <h3>가맹 상담 문의</h3>
          <span><i>*</i> 필수 입력</span>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="inquiry-name">이름 <span>*</span></label>
            <input
              id="inquiry-name"
              autoComplete="name"
              placeholder="성함을 입력해주세요"
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "inquiry-name-error" : undefined}
              {...register("name")}
            />
            {error("name")}
          </div>
          <div className="form-field">
            <label htmlFor="inquiry-region">창업 희망 지역 <span>*</span></label>
            <input
              id="inquiry-region"
              autoComplete="address-level2"
              placeholder="예) 경기도 군포시"
              required
              aria-invalid={!!errors.desiredRegion}
              aria-describedby={errors.desiredRegion ? "inquiry-desiredRegion-error" : undefined}
              {...register("desiredRegion")}
            />
            {error("desiredRegion")}
          </div>
        </div>
        <fieldset className="inquiry-fields form-field">
          <legend className="form-legend">연락처 <span>*</span></legend>
          <div className="inquiry-phone-fields">
            {phoneFields.map((field) => (
              <div key={field.name}>
                <label className="sr-only" htmlFor={`inquiry-${field.name}`}>{field.label}</label>
                <input
                  id={`inquiry-${field.name}`}
                  type="tel"
                  inputMode="numeric"
                  autoComplete={field.name === "phoneFirst" ? "tel-area-code" : field.name === "phoneMiddle" ? "tel-local-prefix" : "tel-local-suffix"}
                  maxLength={field.maxLength}
                  placeholder={field.name === "phoneFirst" ? "010" : "0000"}
                  required
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={errors[field.name] ? `inquiry-${field.name}-error` : undefined}
                  {...register(field.name)}
                />
                {error(field.name)}
              </div>
            ))}
          </div>
        </fieldset>
        <div className="form-field">
          <label htmlFor="inquiry-budget">예상 창업 비용 <span>*</span></label>
          <select
            id="inquiry-budget"
            required
            aria-invalid={!!errors.expectedBudget}
            aria-describedby={errors.expectedBudget ? "inquiry-expectedBudget-error" : undefined}
            {...register("expectedBudget")}
          >
            <option value="">예상 창업 비용을 선택해주세요</option>
            {budgetOptions.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
          </select>
          {error("expectedBudget")}
        </div>
        <div className="form-field">
          <label htmlFor="inquiry-message">문의 내용 <span>*</span></label>
          <textarea
            id="inquiry-message"
            placeholder="희망 상권, 오픈 시기, 궁금한 점을 남겨주세요."
            rows={3}
            required
            aria-invalid={!!errors.inquiryDetail}
            aria-describedby={errors.inquiryDetail ? "inquiry-inquiryDetail-error" : undefined}
            {...register("inquiryDetail")}
          />
          {error("inquiryDetail")}
        </div>
        <fieldset className="inquiry-fields form-field" aria-describedby={errors.referralSources ? "inquiry-referralSources-error" : undefined}>
          <legend className="form-legend">방문 유입 경로 <span>*</span></legend>
          <div className="inquiry-referral-options">
            {referralSourceOptions.map((source) => (
              <label key={source} className="checkbox-label">
                <input type="checkbox" value={source} aria-invalid={!!errors.referralSources} {...register("referralSources")} />
                <span>{source}</span>
              </label>
            ))}
          </div>
          {error("referralSources")}
        </fieldset>
        <div className="consent-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              required
              aria-invalid={!!errors.privacyAgreed}
              aria-describedby={errors.privacyAgreed ? "inquiry-privacyAgreed-error" : "privacy-notice"}
              {...register("privacyAgreed")}
            />
            <span>개인정보 수집 및 이용에 동의합니다.</span>
          </label>
          <details className="privacy-details">
            <summary>내용 보기</summary>
            <p id="privacy-notice">{inquiryPrivacyNotice}</p>
          </details>
        </div>
        {error("privacyAgreed")}
        <button className="button button-primary form-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "문의 접수 중" : "가맹 상담 신청하기"}<ArrowIcon />
        </button>
      </fieldset>
      <p className="form-caption">남겨주신 연락처로 담당자가 연락드립니다.</p>
      <div className="form-status" role="status" aria-live="polite">{status && <p>{status}</p>}</div>
    </form>
  );
}
