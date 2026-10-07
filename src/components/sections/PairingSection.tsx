import { pairingFeature } from "@/data/site";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SectionBackground } from "@/components/ui/SectionBackground";

export function PairingSection() {
  return (
    <section id="pairing" className="section pairing-section section-background-host" aria-labelledby="pairing-title">
      <SectionBackground name="pairing" />
      <div className="container">
        <div className="pairing-heading">
          <Reveal>
            <SectionEyebrow number="04">함께 즐기는 한 상</SectionEyebrow>
            <h2 id="pairing-title" className="section-title">한 그릇에서,<br />한 상으로.</h2>
          </Reveal>
          <Reveal as="p" effect="fade" delay={0.15} className="body-copy">
            국밥 곁에 한 접시를 놓으면,<br />
            함께 먹는 즐거움도 커집니다.<br />
            오늘의 한 상을 이렇게 즐겨보세요.
          </Reveal>
        </div>
        <div className="pairing-table">
          <Reveal effect="settle" duration={0.9} className="pairing-visual">
            <MediaFrame
              image={pairingFeature.image}
              label="국밥과 곁들임 한 상"
              caption="뚝손의 한 상"
              className="pairing-media"
              sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1299px) calc(100vw - 64px), 1240px"
            />
            {!pairingFeature.image && (
              <div className="table-setting" aria-hidden="true">
                <span className="table-bowl" /><span className="table-plate" /><span className="table-chopsticks" />
              </div>
            )}
          </Reveal>
          <div className="pairing-list" aria-label="추천 곁들임 조합">
            {pairingFeature.suggestions.map((suggestion, index) => (
              <Reveal as="article" delay={index * 0.1} className="pairing-item" key={suggestion.title}>
                <p className="pairing-occasion"><span>0{index + 1}</span>{suggestion.title}</p>
                <h3>
                  {suggestion.dishes[0]}
                  <span className="pairing-plus" aria-label="그리고">＋</span>
                  {suggestion.dishes[1]}
                </h3>
                <p className="pairing-description">{suggestion.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <p className="pairing-footnote">취향에 맞는 메뉴 선택을 돕기 위한 추천 조합입니다.</p>
      </div>
    </section>
  );
}
