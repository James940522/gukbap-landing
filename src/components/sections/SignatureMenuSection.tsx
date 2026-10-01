import { foodImages } from "@/data/site";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { MenuGallery } from "@/components/ui/MenuGallery";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SectionBackground } from "@/components/ui/SectionBackground";

export function SignatureMenuSection() {
  return (
    <section
      id="menu"
      className="section section-light menu-section section-background-host"
      aria-labelledby="menu-title"
    >
      <SectionBackground name="menu" />
      <div className="container">
        <div className="section-heading menu-heading">
          <Reveal>
            <SectionEyebrow number="03">SIGNATURE MENU</SectionEyebrow>
            <h2 id="menu-title" className="section-title">
              가장 자신 있는
              <br />
              뚝손의 한 그릇.
            </h2>
          </Reveal>
          <Reveal effect="settle" delay={0.12} className="menu-intro">
            <MediaFrame
              image={foodImages.sundae}
              label="젓가락으로 집어 올린 김이 나는 순대 한 점"
              englishLabel="WITH YOUR BOWL"
              className="menu-intro-media"
              sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 999px) 40vw, 400px"
            />
            <p className="section-heading-note">
              맑게, 얼큰하게. 오늘의 입맛에 맞게.
              <br />
              국밥부터 곁들임까지, 든든하게 즐겨보세요.
            </p>
          </Reveal>
        </div>
        <MenuGallery />
        <p className="menu-footnote">메뉴별 사진과 상세 정보는 순차적으로 준비하고 있습니다.</p>
      </div>
    </section>
  );
}
