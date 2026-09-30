import { standards } from "@/data/site";
import { BowlIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function WhyDduksonSection() {
  return (
    <section id="standard" className="section section-light standards-section" aria-labelledby="standards-title">
      <div className="container">
        <Reveal className="standards-intro">
          <SectionEyebrow number="03">WHY DDUKSON</SectionEyebrow>
          <h2 id="standards-title" className="section-title">익숙한 음식에,<br />분명한 기준.</h2>
          <p className="body-copy">좋은 한 그릇을 이루는, 뚝손의 네 가지 생각.</p>
        </Reveal>
        <div className="standards-diagram">
          <div className="standards-symbol" aria-hidden="true">
            <span>DDUKSON GUKBAP</span>
            <BowlIcon />
            <strong>한 그릇을<br />제대로.</strong>
            <i />
          </div>
          <div className="standards-list">
            {standards.map((item) => (
              <Reveal key={item.number}>
                <article className="standard-item">
                  <div className="standard-name">
                    <span className="standard-number">{item.number}</span>
                    <h3>{item.title}</h3>
                    <span className="small-label">{item.english}</span>
                  </div>
                  <h4>{item.subtitle}</h4>
                  <p>{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
