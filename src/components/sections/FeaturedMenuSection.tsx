import { FeaturedMenuCarousel } from "@/components/ui/FeaturedMenuCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import styles from "./FeaturedMenuSection.module.css";

export function FeaturedMenuSection() {
  return (
    <section
      id="featured-menu"
      className={`section section-light section-background-host ${styles.section}`}
      aria-labelledby="featured-menu-title"
    >
      <SectionBackground name="featuredMenu" />
      <div className={styles.container}>
        <Reveal effect="fade" className={styles.heading}>
          <h2 id="featured-menu-title" className={styles.title}>뚝손의 대표 한 그릇.</h2>
          <p className={styles.description}>
            뜨끈한 국물부터 푸짐한 건더기까지.
            <span>오늘의 입맛에 맞는 뚝손의 한 그릇을 만나보세요.</span>
          </p>
        </Reveal>
        <FeaturedMenuCarousel />
      </div>
    </section>
  );
}
