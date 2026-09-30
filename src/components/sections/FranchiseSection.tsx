import { franchiseTopics } from "@/data/site";
import { ArrowIcon, BowlIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function FranchiseSection() {
  return (
    <section id="franchise" className="section franchise-section" aria-labelledby="franchise-title">
      <div className="container franchise-layout">
        <Reveal className="franchise-invitation">
          <SectionEyebrow number="06">FRANCHISE</SectionEyebrow>
          <h2 id="franchise-title" className="section-title">좋은 한 그릇이,<br />좋은 시작이 되도록.</h2>
          <p className="body-copy">뚝손의 다음 한 그릇을<br />함께할 분을 기다립니다.</p>
          <a href="#inquiry" className="button button-primary">창업 문의하기<ArrowIcon /></a>
          <BowlIcon className="franchise-bowl" />
        </Reveal>
        <div className="franchise-topics">
          <div className="franchise-topics-heading"><span>함께 알아갈 이야기</span><span>WITH DDUKSON</span></div>
          {franchiseTopics.map((item) => (
            <Reveal key={item.number}>
              <details className="franchise-topic">
                <summary>
                  <span className="topic-number">{item.number}</span>
                  <span className="topic-copy">
                    <span className="topic-title">{item.title}</span>
                    <span className="topic-description">{item.description}</span>
                  </span>
                  <span aria-hidden="true" className="details-plus" />
                </summary>
                <p>{item.detail}</p>
              </details>
            </Reveal>
          ))}
          <p className="franchise-footnote">브랜드의 생각부터 차근차근 만나보세요.</p>
        </div>
      </div>
    </section>
  );
}
