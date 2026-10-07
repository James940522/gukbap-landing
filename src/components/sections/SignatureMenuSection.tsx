import { MenuGallery } from "@/components/ui/MenuGallery";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SectionBackground } from "@/components/ui/SectionBackground";

export function SignatureMenuSection() {
  return (
    <section
      id="menu"
      className="section menu-section section-background-host"
      aria-labelledby="menu-title"
    >
      <SectionBackground name="nurungji" className="menu-background" />
      <div className="container">
        <div className="section-heading menu-heading">
          <Reveal>
            <SectionEyebrow number="03">뚝손의 메뉴</SectionEyebrow>
            <h2 id="menu-title" className="section-title">
              가장 자신 있는
              <br />
              뚝손의 한 그릇.
            </h2>
          </Reveal>
        </div>
        <MenuGallery />
      </div>
    </section>
  );
}
