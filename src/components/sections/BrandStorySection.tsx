import { brandValues, foodImages } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function BrandStorySection() {
  return (
    <section id="brand" className="section section-light brand-section" aria-labelledby="brand-title">
      <div className="container">
        <div className="brand-heading">
          <Reveal>
            <SectionEyebrow>뚝손 이야기</SectionEyebrow>
            <h2 id="brand-title" className="section-title display-font">
              뚝배기에 담은<br />우리의 손맛.
            </h2>
          </Reveal>
          <Reveal effect="fade" delay={0.16} className="brand-introduction">
            <p className="lead">특별한 날이 아니어도,<br />제대로 된 한 끼는 필요하니까.</p>
            <p className="body-copy">
              바쁜 하루의 한가운데, 따뜻한 국밥 한 그릇.<br />
              뚝손은 그 익숙한 위로에서 시작합니다.
            </p>
          </Reveal>
        </div>
        <div className="brand-story-layout">
          <Reveal effect="settle" duration={0.9} className="brand-visual">
            <MediaFrame
              image={foodImages.cooking}
              label="김이 오르는 가마솥 위로 고기와 순대를 들어 올리는 모습"
              caption="뚝손의 손맛"
              className="brand-media"
              sizes="(max-width: 899px) calc(100vw - 48px), (max-width: 1299px) 62vw, 760px"
            />
            <p className="brand-photo-note"><span>화려한 말보다, 깊은 맛으로.</span><ArrowIcon /></p>
          </Reveal>
          <div className="brand-values">
            {brandValues.map((value, i) => (
              <Reveal key={value.keyword} effect="from-right" delay={i * 0.09} className="brand-value">
                <div>
                  <span className="small-label">{value.keyword}</span>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
