import Image, { getImageProps } from "next/image";
import { nurungjiMenus, nurungjiStory } from "@/data/nurungji";
import { ArrowIcon } from "@/components/ui/Icons";
import { NurungjiMenuFeature } from "@/components/ui/NurungjiMenuFeature";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./NurungjiSection.module.css";

const backgroundProps = {
  alt: "",
  fill: true,
  sizes: "100vw",
  quality: 90,
};

const { props: desktopBackground } = getImageProps({
  ...backgroundProps,
  src: "/images/backgrounds/nurungji-desktop.png",
});

const { props: mobileBackground } = getImageProps({
  ...backgroundProps,
  src: "/images/backgrounds/nurungji-mobile.png",
});

export function NurungjiSection() {
  return (
    <section
      id="nurungji"
      className={`section ${styles.section}`}
      aria-labelledby="nurungji-title"
    >
      <div className={styles.background} aria-hidden="true">
        <picture>
          <source media="(max-width: 899px)" srcSet={mobileBackground.srcSet} sizes={mobileBackground.sizes} />
          <img {...desktopBackground} alt="" className={styles.backgroundImage} fetchPriority="low" />
        </picture>
      </div>
      <div className={`container ${styles.container}`}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <Reveal as="h2" id="nurungji-title" className={styles.title}>
              <span><em>누룽지</em>를 더한</span>
              <span>한 그릇.</span>
            </Reveal>
            <Reveal effect="fade" delay={0.12} className={styles.introduction}>
              <p className={styles.lead}>{nurungjiStory.lead}</p>
              <p className={styles.description}>
                {nurungjiStory.description.map((line) => <span key={line}>{line}</span>)}
              </p>
            </Reveal>

            <Reveal effect="fade" delay={0.18} className={styles.combination}>
              <div>
                <span>뜨끈한 한 그릇</span>
                <strong>국밥</strong>
              </div>
              <span className={styles.plus} aria-hidden="true">+</span>
              <div>
                <span>고소한 여운</span>
                <strong>누룽지</strong>
              </div>
            </Reveal>

            <Reveal effect="fade" delay={0.24} className={styles.detail}>
              <figure className={styles.detailPhoto}>
                <Image
                  src="/images/food/nurungji-spoon.png"
                  alt="김이 오르는 뚝배기 위로 나무 숟가락에 뜬 누룽지"
                  fill
                  sizes="(max-width: 599px) 112px, 144px"
                  quality={90}
                />
              </figure>
              <div className={styles.detailCopy}>
                <h3>{nurungjiStory.detailTitle}</h3>
                <p>{nurungjiStory.detailDescription}</p>
              </div>
            </Reveal>
          </div>

          <NurungjiMenuFeature menus={nurungjiMenus} />
        </div>

        <Reveal effect="fade" className={styles.closing}>
          <p>돼지국밥에도, 순대국밥에도.<br className={styles.mobileBreak} /> 누룽지의 고소함을 더했습니다.</p>
          <a href="#menu" className={styles.menuLink}>
            전체 메뉴 살펴보기<ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
