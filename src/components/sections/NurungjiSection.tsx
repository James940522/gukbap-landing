import { nurungjiFeature } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SectionBackground } from "@/components/ui/SectionBackground";

export function NurungjiSection() {
  return (
    <section id="nurungji" className="section nurungji-section section-background-host" aria-labelledby="nurungji-title">
      <SectionBackground name="nurungji" className="nurungji-background" />
      <div className="container nurungji-layout">
        <Reveal effect="from-left" className="nurungji-copy">
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
        <div className="nurungji-visual">
          <Reveal as="span" effect="fade" delay={0.28} className="nurungji-stamp" aria-hidden>누룽지<br /><i>한 그릇의 여운</i></Reveal>
          <Reveal effect="settle" duration={0.9}>
            {nurungjiFeature.image ? (
              <MediaFrame
                image={nurungjiFeature.image}
                label="누룽지 국밥 한 그릇"
                englishLabel="A BOWL WITH NURUNGJI"
                className="nurungji-media"
                sizes="(max-width: 899px) calc(100vw - 48px), (max-width: 1299px) 48vw, 600px"
              />
            ) : (
              <div className="nurungji-atmosphere" aria-hidden="true" />
            )}
          </Reveal>
          <Reveal as="p" effect="fade" delay={0.18} className="nurungji-visual-note">
            <span>{nurungjiFeature.image ? "뜨끈함에 고소함을 더하다." : "뚝배기 연출 이미지 · 메뉴 사진 준비 중"}</span>
            <span>NURUNGJI × GUKBAP</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
