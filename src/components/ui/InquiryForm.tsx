"use client";

import { ArrowIcon } from "./Icons";
import { inquiryPrivacyNotice, type InquiryField } from "@/lib/inquiry";
import { useInquirySubmission } from "@/lib/useInquirySubmission";

export function InquiryForm() {
  const { formRef, errors, isSubmitting, status, handleSubmit } = useInquirySubmission("contact");

  function error(field: InquiryField) {
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
      noValidate
      aria-busy={isSubmitting}
    >
      <input className="inquiry-honeypot" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <fieldset className="inquiry-fields" disabled={isSubmitting}>
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
            maxLength={800}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {error("message")}
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
              {inquiryPrivacyNotice}
            </p>
          </details>
        </div>
        {error("consent")}
        <button className="button button-primary form-submit" type="submit">
          {isSubmitting ? "접수 중…" : "가맹 상담 신청하기"}
          <ArrowIcon />
        </button>
      </fieldset>
      <p className="form-caption">남겨주신 연락처로 담당자가 연락드립니다.</p>
      <div className="form-status" role="status" aria-live="polite">
        {status && <p>{status}</p>}
      </div>
    </form>
  );
}
