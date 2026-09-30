import { nurungjiFeature } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function NurungjiSection() {
  return (
    <section id="nurungji" className="section nurungji-section" aria-labelledby="nurungji-title">
      <div className="container nurungji-layout">
        <Reveal className="nurungji-copy">
          <SectionEyebrow number="02">NURUNGJI GUKBAP</SectionEyebrow>
          <h2 id="nurungji-title" className="section-title">
            누룽지를 더한<br />한 그릇.
          </h2>
          <p className="nurungji-lead">익숙한 국밥에, 고소한 여운.</p>
          <p className="body-copy">
            돼지국밥에도, 순대국밥에도.<br />
            얼큰하게 즐기는 한 그릇에도.<br />
            오늘은 누룽지 국밥으로 만나보세요.
          </p>
          <ol className="nurungji-menu-list" aria-label="누룽지 국밥 메뉴">
            {nurungjiFeature.menus.map((menu, index) => (
              <li key={menu.id}>
                <span className="nurungji-menu-number">0{index + 1}</span>
                <h3>{menu.name}</h3>
              </li>
            ))}
          </ol>
          <a className="text-link" href="#menu">전체 메뉴 살펴보기<ArrowIcon /></a>
        </Reveal>
        <Reveal className="nurungji-visual">
          <span className="nurungji-stamp" aria-hidden="true">누룽지<br /><i>한 그릇의 여운</i></span>
          <MediaFrame
            image={nurungjiFeature.image}
            label="누룽지 국밥 한 그릇"
            englishLabel="A BOWL WITH NURUNGJI"
            className="nurungji-media"
            sizes="(max-width: 899px) calc(100vw - 48px), (max-width: 1299px) 48vw, 600px"
          />
          <p className="nurungji-visual-note"><span>뜨끈함에 고소함을 더하다.</span><span>NURUNGJI × GUKBAP</span></p>
        </Reveal>
      </div>
    </section>
  );
}
