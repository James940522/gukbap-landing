import { pairingFeature } from "@/data/site";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function PairingSection() {
  return (
    <section id="pairing" className="section pairing-section" aria-labelledby="pairing-title">
      <div className="container">
        <Reveal className="pairing-heading">
          <div>
            <SectionEyebrow number="04">BETTER TOGETHER</SectionEyebrow>
            <h2 id="pairing-title" className="section-title">한 그릇에서,<br />한 상으로.</h2>
          </div>
          <p className="body-copy">
            국밥 곁에 한 접시를 놓으면,<br />
            함께 먹는 즐거움도 커집니다.<br />
            오늘의 한 상을 이렇게 즐겨보세요.
          </p>
        </Reveal>
        <Reveal className="pairing-table">
          <div className="pairing-visual">
            <MediaFrame
              image={pairingFeature.image}
              label="국밥과 곁들임 한 상"
              englishLabel="ON THE DDUKSON TABLE"
              className="pairing-media"
              sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1299px) calc(100vw - 64px), 1240px"
            />
            {!pairingFeature.image && (
              <div className="table-setting" aria-hidden="true">
                <span className="table-bowl" /><span className="table-plate" /><span className="table-chopsticks" />
              </div>
            )}
          </div>
          <div className="pairing-list" aria-label="추천 곁들임 조합">
            {pairingFeature.suggestions.map((suggestion, index) => (
              <article className="pairing-item" key={suggestion.title}>
                <p className="pairing-occasion"><span>0{index + 1}</span>{suggestion.title}</p>
                <h3>
                  {suggestion.dishes[0]}
                  <span className="pairing-plus" aria-label="그리고">＋</span>
                  {suggestion.dishes[1]}
                </h3>
                <p className="pairing-description">{suggestion.description}</p>
              </article>
            ))}
          </div>
        </Reveal>
        <p className="pairing-footnote">취향에 맞는 메뉴 선택을 돕기 위한 추천 조합입니다.</p>
      </div>
    </section>
  );
}
