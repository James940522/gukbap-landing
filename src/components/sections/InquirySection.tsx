import { InquiryForm } from "@/components/ui/InquiryForm";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { brand } from "@/data/site";

export function InquirySection() {
  return (
    <section
      id="inquiry"
      className="section section-light inquiry-section"
      aria-labelledby="inquiry-title"
    >
      <div className="container inquiry-grid">
        <Reveal effect="from-left" className="inquiry-copy">
          <SectionEyebrow number="07">START WITH DDUKSON</SectionEyebrow>
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
            <span><i>01</i>브랜드 이야기</span>
            <span><i>02</i>메뉴 구성</span>
            <span><i>03</i>창업 상담</span>
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
                전화 또는 이메일로 문의해주세요.
              </p>
              <a className="inquiry-email" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>
            </div>
          </div>
          <p className="inquiry-signature">
            SANBON F&B <span>×</span> DDUKSON GUKBAP
          </p>
        </Reveal>
        <Reveal effect="fade" duration={0.65} delay={0.12}>
          <InquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
