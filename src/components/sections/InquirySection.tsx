import Image from "next/image";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { brand } from "@/data/site";
import typography from "./SectionTypography.module.css";

export function InquirySection() {
  return (
    <section
      id="inquiry"
      className={`section section-light section-background-host inquiry-section ${typography.backdropSection}`}
      aria-labelledby="inquiry-title"
    >
      <div className="inquiry-background" aria-hidden="true">
        <Image className="inquiry-background-desktop" src="/images/inquiry/contact-desktop.webp" alt="" fill sizes="(max-width: 767px) 1px, 100vw" />
        <Image className="inquiry-background-mobile" src="/images/inquiry/contact-mobile.webp" alt="" fill sizes="(max-width: 767px) 100vw, 1px" />
      </div>
      <div className={`container inquiry-grid ${typography.content}`}>
        <Reveal effect="from-left" className="inquiry-copy">
          <SectionEyebrow>뚝손과 함께 시작</SectionEyebrow>
          <h2 id="inquiry-title" className="section-title display-font">
            뚝손국밥과
            <br />
            함께 시작하세요.
          </h2>
          <p className="body-copy">
            든든한 한 끼를 만드는 일.
            <br />그 시작에 뚝손이 함께하고 싶습니다.
          </p>
          <div className="inquiry-topics" aria-label="상담 주제">
            <span>브랜드 이야기</span>
            <span>메뉴 구성</span>
            <span>창업 상담</span>
          </div>
          <div className="inquiry-note">
            <span className="status-dot" />
            <div>
              <strong>창업 문의</strong>
              <a className="inquiry-phone" href={brand.phoneHref}>
                {brand.phone}
              </a>
              <p>
                브랜드와 창업에 대해 궁금한 점을
                <br />
                아래 상담 폼 또는 전화로 문의해주세요.
              </p>
              <a className="inquiry-email" href={`mailto:${brand.email}`}>
                이메일로 문의하기
              </a>
            </div>
          </div>
          <p className="inquiry-signature">
            산본에프앤비 <span>×</span> 뚝손국밥
          </p>
        </Reveal>
        <Reveal effect="fade" duration={0.65} delay={0.12}>
          <InquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
